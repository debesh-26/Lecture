const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.join(__dirname, '../firebase-service-account.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'lectureprogress-bf4ce.firebasestorage.app'
});

const bucket = admin.storage().bucket();

module.exports = bucket;
