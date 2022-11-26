const { auth, bucket, db } = require("../firebase");
const { Router } = require("express");
const router = Router();
const alert = require('alert')
const { signInWithEmailAndPassword } = require("firebase/auth");
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

router.get('/modificar', function (req, res) {
  res.render('./Dashboard/Gestion/modificar')
});
var search2=[];
router.get('/eliminar',  function (req, res) {
  var contacts=[]
  contacts=search2
    res.render('./Dashboard/Gestion/eliminar',{contacts})
});

var contacts=[];
router.get('/data/:id', async function (req, res) {
  const querySnapshot =  db.collection("analisis").doc(req.params.id);
    const item=await querySnapshot.get()
    contacts.push(item.data())
  res.redirect('/archivos')
});
router.get('/data', async function (req, res) {
  let text = "Press a button!\nEither OK or Cancel.";
  if (confirm(text) == true) {
    text = "You pressed OK!";
    res.render('eliminar')
  } else {
    text = "You canceled!";
  }
  
});

router.get('/archivos', async function (req, res) {
  var url=contacts[0].link
  console.log(url)
  res.render('./Dashboard/archivos',{url})
  contacts=[]
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
var search=[];
router.get('/home', async function (req, res) {
  var contacts=[]
  try {
    if(search.length===0){
    const querySnapshot = await db.collection("analisis").get();
     contacts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.render('./Dashboard/home', { contacts });
  }else{
    contacts=search
    res.render('./Dashboard/home', { contacts });
  }
  } catch (error) {
    console.error(error);
  }
});

router.post('/buscar', async function (req, res) {
  const nombre = req.body.nombre;
  try {
    const querySnapshot = await db.collection("analisis").where('nombre',"==", nombre).get();
    const contacts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(contacts[0])
    search=contacts
    res.redirect('/home');
  } catch (error) {
    console.error(error);
  }
});

router.post('/eliminar', async function (req, res) {
  const nombre = req.body.nombre;
  try {
    const querySnapshot = await db.collection("analisis").where('nombre',"==", nombre).get();
    const contacts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log(contacts[0])
    search2=contacts
    res.redirect('/eliminar');
  } catch (error) {
    console.error(error);
  }
});

router.post('/login', async function (req, res) {
  const box = req.body;
  try {
    const userCredentials = await signInWithEmailAndPassword(auth, box.email, box.password);
    if(userCredentials){
      res.redirect('/home');
    }
  } catch (error) {
    alert('Quedan');
    console.log(error);
  }
});

router.post('/create', multer.array('myFiles', 12), async (req, res) => {
  try {
    const files = req.files
    const nombre = req.body.nombre
    var link = [];
    if (files) {
      for (i = 0; i < files.length; i++) {
        const folder = 'Analisis'
        const fileName = `${folder}/${files[i].originalname}`;
        const fileUpload = bucket.file(fileName);
        //fileUpload.download()
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

/*router.get("/", async (req, res) => {
  try {
    const querySnapshot = await db.collection("contacts").get();
    const contacts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.render("index", { contacts });
  } catch (error) {
    console.error(error);
  }
});

router.post("/new-contact", async (req, res) => {
  const { firstname, lastname, email, phone } = req.body;
  await db.collection("contacts").add({
    firstname,
    lastname,
    email,
    phone,
  });
  res.redirect("/");
});

router.get("/delete-contact/:id", async (req, res) => {
  await db.collection("contacts").doc(req.params.id).delete();
  res.redirect("/");
});

router.get("/edit-contact/:id", async (req, res) => {
  const doc = await db.collection("contacts").doc(req.params.id).get();
  res.render("index", { contact: { id: doc.id, ...doc.data() } });
});

router.post("/update-contact/:id", async (req, res) => {
  const { firstname, lastname, email, phone } = req.body;
  const { id } = req.params;
  await db
    .collection("contacts")
    .doc(id)
    .update({ firstname, lastname, email, phone });
  res.redirect("/");
});*/
/*router.post('/logup', async function(req, res){
  try {
    const { user } = await admin.auth().signInWithEmailAndPassword(email, password);
    const customToken = await admin.auth().createCustomToken(user.uid);
    return res.status(200).send(JSON.stringify(customToken));
  } catch (error) {
    return res.status(404).send(error);
  }
});

router.post('/newcount', async function(req, res){
  const cuenta=await admin.auth().createUser({
    email: req.body.email,
    password: req.body.email,
    emailVerified: false,
    disable: false
  });
  res.json(cuenta);
});*/