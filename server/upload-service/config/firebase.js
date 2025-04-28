const admin = require("firebase-admin");
const path = require("path");

// Import the service account file
const serviceAccount = require("./firebaseServiceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "foodorderingapp-bde2f.firebasestorage.app",
});

const bucket = admin.storage().bucket();

module.exports = bucket;
