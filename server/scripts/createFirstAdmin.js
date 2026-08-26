require('dotenv').config();
const { admin, db } = require('../config/firebase');

const email = process.argv[2];
const password = process.argv[3];
const displayName = process.argv[4] || 'Admin User';

if (!email || !password) {
  console.log('Usage: node createFirstAdmin.js <email> <password> [displayName]');
  process.exit(1);
}

const createAdmin = async () => {
  try {
    console.log(`Creating admin account for ${email}...`);
    
    // 1. Create or get user in Firebase Auth
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(email);
      console.log('User already exists in Auth. Updating password and claim...');
      await admin.auth().updateUser(userRecord.uid, { password });
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        userRecord = await admin.auth().createUser({
          email,
          password,
          displayName,
        });
      } else {
        throw err;
      }
    }

    // 2. Set custom claim
    await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true, role: 'owner' });
    console.log('Successfully set admin custom claim.');

    // 3. Add to Firestore users collection
    await db.collection('users').doc(userRecord.uid).set({
      email,
      displayName,
      role: 'owner',
      createdAt: new Date(),
    }, { merge: true });

    console.log(`Success! ${email} is now an admin. You can log in at /admin/login`);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
