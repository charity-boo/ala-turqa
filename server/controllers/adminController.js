const { admin, db } = require('../config/firebase');

const createStaffUser = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // 1. Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: displayName || 'Staff Member',
    });

    // 2. Set custom claim to make them an admin
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });

    // 3. Store reference in Firestore (optional but good for listing staff in UI)
    await db.collection('users').doc(userRecord.uid).set({
      email,
      displayName: displayName || 'Staff Member',
      role: 'admin',
      createdAt: new Date(),
    });

    res.status(201).json({ 
      message: 'Staff user created successfully', 
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName
      }
    });

  } catch (error) {
    console.error('Error creating staff user:', error);
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ error: 'The email address is already in use by another account.' });
    }
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

const getStaffUsers = async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').where('role', 'in', ['admin', 'owner']).get();
    const users = [];
    usersSnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching staff users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const checkSetup = async (req, res) => {
  try {
    const snapshot = await db.collection('users').where('role', '==', 'owner').limit(1).get();
    res.status(200).json({ hasSetup: !snapshot.empty });
  } catch (error) {
    console.error('Error checking setup:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const setupFirstAdmin = async (req, res) => {
  try {
    // 1. Check if an owner already exists
    const snapshot = await db.collection('users').where('role', '==', 'owner').limit(1).get();
    if (!snapshot.empty) {
      return res.status(403).json({ error: 'Setup has already been completed.' });
    }

    const { email, password, displayName } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
      // User exists, update password
      await admin.auth().updateUser(userRecord.uid, { password });
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        userRecord = await admin.auth().createUser({
          email,
          password,
          displayName: displayName || 'Admin',
        });
      } else {
        throw err;
      }
    }

    // Set claims
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true, role: 'owner' });

    // Store in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email,
      displayName: displayName || 'Admin',
      role: 'owner',
      createdAt: new Date(),
    }, { merge: true });

    res.status(201).json({ message: 'First admin created successfully' });
  } catch (error) {
    console.error('Error in setup:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createStaffUser,
  getStaffUsers,
  checkSetup,
  setupFirstAdmin
};
