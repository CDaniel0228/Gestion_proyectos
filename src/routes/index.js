const { auth } = require("../firebase");
const { Router } = require("express");
const router = Router();
const  alert =require('alert')
const {signInWithEmailAndPassword } =require("firebase/auth");

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
router.get('/', function(req, res){
  res.redirect('/index');
});

router.get('/index', function(req, res){
  res.render('index')
})

router.get('/login', function(req, res){
  res.render('./Login/login')
});
router.post('/login', async function(req, res){
  const box=req.body;
  try {
    const userCredentials=await signInWithEmailAndPassword(auth,box.email, box.password);
    console.log(userCredentials)
    res.redirect('/desh');
  } catch (error) {
    alert('Quedan');
    console.log(error);
  }
  
  
});

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

router.get('/desh', function(req, res){
  res.render('./Dashboard/desh')
});


router.get('/create', function(req, res){
  res.render('./Dashboard/Gestion/create')
});

router.post('/create',  function(req, res){
  const box=req.body;

  console.log(""+box.A_file1);
  try {
  } catch (error) {
    console.log(error);
  }
  
  
});

router.get('/home', function(req, res){
  res.render('./Dashboard/home')
});
/*app.locals.bucket = admin.storage().bucket();
app.post('/upload',upload.single('file'),async(req,res)=>{
  const name = saltedMd5(req.file.originalname, 'SUPER-S@LT!')
  const fileName = name + path.extname(req.file.originalname)
  await app.locals.bucket.file(fileName).createWriteStream().end(req.file.buffer)
  res.send('done');
})
//const blob = firebase.bucket.file(req.file.filename);
*/
module.exports = router;
