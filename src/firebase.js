require("dotenv").config();

const { getFirestore} = require("firebase-admin/firestore");
const { getStorage } = require('firebase-admin/storage');
const { initializeApp, cert } =require("firebase-admin/app");


//var admin = require("firebase-admin");
const serviceAccount = require("../registros-ce259-firebase-adminsdk-ikpti-de2d97cd19.json");

const firebaseConfig = {
  apiKey: "AIzaSyDs2YOl4zeVB4LOrSRMp_fT9upQRJIFmpA",
  authDomain: "registros-ce259.firebaseapp.com",
  projectId: "registros-ce259",
  storageBucket: "registros-ce259.appspot.com",
  messagingSenderId: "858738352015",
  appId: "1:858738352015:web:ce9025c4c19d42e250b5fa",
  storageBucket: "registros-ce259.appspot.com"
};

const app = initializeApp({credential: cert(serviceAccount),storageBucket:'registros-ce259.appspot.com'});
const db = getFirestore(app)
const bucket = getStorage(app).bucket();

module.exports = {
  app,
  firebaseConfig,
  db,
  bucket
};
