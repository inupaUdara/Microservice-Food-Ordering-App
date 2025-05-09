const admin = require("firebase-admin");
const path = require("path");

// Import the service account file
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "foodorderapp-c4f78.firebasestorage.app",
});

const bucket = admin.storage().bucket();

module.exports = bucket;
