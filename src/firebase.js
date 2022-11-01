require("dotenv").config();

const { getFirestore } = require("firebase-admin/firestore");
var admin = require("firebase-admin");
var serviceAccount = require("../registros-ce259-firebase-adminsdk-ikpti-de2d97cd19.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = getFirestore();
module.exports = {
  db,
};
