const admin = require('firebase-admin');
const { db } = require('./config/firebase');

async function testAuth() {
  try {
    const listUsersResult = await admin.auth().listUsers(10);
    console.log("Users:", listUsersResult.users.length);
    process.exit(0);
  } catch (error) {
    console.error("Auth error:", error);
    process.exit(1);
  }
}

testAuth();
