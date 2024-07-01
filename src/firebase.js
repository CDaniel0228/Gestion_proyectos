require("dotenv").config();

const { getFirestore} = require("firebase-admin/firestore");
const { getStorage } = require('firebase-admin/storage');
const { initializeApp, cert } =require("firebase-admin/app");


//var admin = require("firebase-admin");
const serviceAccount = require("../registros-ce259-firebase-adminsdk-ikpti-de2d97cd19.json");

const firebaseConfig = {
  apiKey: "AIzaSyBkqzyZGASrTROj1uPl69EZJfhG1QDAXOI",
  authDomain: "trans-serenity-367020.firebaseapp.com",
  databaseURL: "https://trans-serenity-367020-default-rtdb.firebaseio.com",
  projectId: "trans-serenity-367020",
  storageBucket: "trans-serenity-367020.appspot.com",
  messagingSenderId: "28291341601",
  appId: "1:28291341601:web:ecaabc3ca2bdb4ddf97260"
};

const app = initializeApp({credential: cert(serviceAccount),storageBucket:'trans-serenity-367020.appspot.com'});
const db = getFirestore(app)
const bucket = getStorage(app).bucket();

module.exports = {
  app,
  firebaseConfig,
  db,
  bucket
};
