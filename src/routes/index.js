const { firebaseConfig, bucket, db } = require("../firebase");
const { Router } = require("express");
const router = Router();
const alert = require('alert')
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const { initializeApp } =require("firebase/app");

const { check, validationResult } = require("express-validator");
const Multer = require('multer');
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  },

});

router.get('/', function (req, res) {
  res.redirect('/index');
});

router.get('/index', function (req, res) {
  res.render('index')
})

router.get('/login', function (req, res) {
  res.render('./Login/login')
});

router.get('/create', function (req, res) {
  res.render('./Dashboard/Gestion/create')
});
var search3 = []
router.get('/modificar', function (req, res) {
  var contacts = []
  contacts = search3
  res.render('./Dashboard/Gestion/modificar', { contacts })
  search3 = []
});

var search2 = [];
router.get('/eliminar', function (req, res) {
  var contacts = []
  contacts = search2
  res.render('./Dashboard/Gestion/eliminar', { contacts })
});

var contacts = [];
router.get('/data/:id', async function (req, res) {
  const querySnapshot = db.collection("analisis").doc(req.params.id);
  const item = await querySnapshot.get()
  contacts.push(item.data())
  res.redirect('/archivos')
});

router.get('/confirmar/:id', async function (req, res) {
  console.log(req.params.id)
  try {
    const querySnapshot = db.collection("analisis").doc(req.params.id);
    const item = await querySnapshot.get()
    search2 = []
    var nomlink = item.data().nomlink
    for (i = 0; i < nomlink.length; i++) {
      const fileUpload = bucket.file(nomlink[i]);
      fileUpload.delete()
    }
    await querySnapshot.delete()
    res.redirect("/eliminar");
  } catch (error) { }
});

router.get('/archivos', async function (req, res) {
  var url = contacts[0].link
  console.log(url)
  res.render('./Dashboard/archivos', { url })
  contacts = []
});

router.get('/reportes', async function (req, res) {
  try {
    const querySnapshot = await db.collection("analisis").get();
    const contacts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.render('./Dashboard/reportes', { contacts });
  } catch (error) {
    console.error(error);
  }
});
var search = [];
router.get('/home', async function (req, res) {
  var contacts = []
  try {
    if (search.length === 0) {
      const querySnapshot = await db.collection("analisis").get();
      contacts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.render('./Dashboard/home', { contacts });
    } else {
      contacts = search
      res.render('./Dashboard/home', { contacts });
      search = []
    }
  } catch (error) {
    console.error(error);
  }
});

router.post('/buscar', async function (req, res) {
  const nombre = req.body.nombre;
  try {
    const querySnapshot = await db.collection("analisis").where('nombre', "==", nombre).get();
    const contacts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(contacts[0])
    search = contacts
    res.redirect('/home');
  } catch (error) {
    console.error(error);
  }
});

router.post('/mod', async function (req, res) {
  const nombre = req.body.nombre;
  try {
    const querySnapshot = await db.collection("analisis").where('nombre', "==", nombre).get();
    const contacts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(contacts[0])
    search3 = contacts
    res.redirect('/modificar');
  } catch (error) {
    console.error(error);
  }
});

router.post('/modificar/:id', multer.array('myFiles', 12), async function (req, res) {
  const querySnapshot = db.collection("analisis").doc(req.params.id);
  const item = await querySnapshot.get()
  var nomPr2 = item.data().nombre
  var nomLin2=item.data().nomlink
  const files = req.files
  const id = req.params.id
  var link = [];
  var nomlink = [];
  if (files) {
    for (i = 0; i < files.length; i++) {
      const fileUpload = bucket.file(nomLin2[i]);
      nomlink.push(fileName)
      const archivo = await fileUpload.getSignedUrl({ action: 'read', expires: '03-09-2491', });
      link.push(archivo[0])
      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: req.files[i].mimetype
        }
      });
      blobStream.on('error', (err) => {
      });

      blobStream.on('finish', () => {
      });

      blobStream.end(req.files[i].buffer);
    };
    await db
      .collection("Analisis")
      .doc(id)
      .update({
         nomPr2,
         link,
         nomlink, });
    res.redirect("/modificar");
  }
});

router.post('/eliminar', async function (req, res) {
  const nombre = req.body.nombre;
  try {
    const querySnapshot = await db.collection("analisis").where('nombre', "==", nombre).get();
    const contacts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(contacts[0])
    search2 = contacts
    res.redirect('/eliminar');
  } catch (error) {
    console.error(error);
  }
});

router.post('/login',[check("email").isEmail().withMessage("invalid email address").normalizeEmail(),
check("password").isLength({min: 7, max: 15}).withMessage("minimo 7").trim(),],
  async function (req, res) {
  const errors = validationResult(req)
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app)

  if (!errors.isEmpty()) {
    alert(errors.array());
  }else{
  const box = req.body
  try {
    const userCredentials = await signInWithEmailAndPassword(auth, box.email, box.password)
    if (userCredentials) {
      res.redirect('/home');
    }
  } catch (error) {
    console.log(error);
  }
}
});

router.post('/create', multer.array('myFiles', 12), async (req, res) => {
  try {
    const files = req.files
    const nombre = req.body.nombre
    var link = [];
    var nomlink = [];
    if (files) {
      for (i = 0; i < files.length; i++) {
        const folder = 'Analisis'
        const fileName = `${folder}/${Date.now()}`;
        const fileUpload = bucket.file(fileName);
        nomlink.push(fileName)
        const archivo = await fileUpload.getSignedUrl({ action: 'read', expires: '03-09-2491', });
        link.push(archivo[0])
        const blobStream = fileUpload.createWriteStream({
          metadata: {
            contentType: req.files[i].mimetype
          }
        });
        blobStream.on('error', (err) => {
        });

        blobStream.on('finish', () => {
        });

        blobStream.end(req.files[i].buffer);
      };
      await db.collection("analisis").add({
        nombre,
        link,
        nomlink,
      });
    }
    res.redirect('/create')
  } catch (error) {
    console.log(error);
  }
});



router.get('/desh', function (req, res) {
  res.render('./Dashboard/menu')
});

router.get('/envio', function (req, res) {
  var nombre = "daniel";
  var array = [
    { nombre: 'a', edad: 1 },
    { nombre: 'b', edad: 2 }
  ];
  res.render('./Dashboard/envio', {
    nombre: nombre,
    array: array
  })
});

module.exports = router;