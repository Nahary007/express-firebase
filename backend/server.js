
const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());

// Autoriser React (port 3000) à appeler ton backend
app.use(cors({
  origin: 'http://localhost:3000'
}));

const serviceAccount = require('./firebase-key.json');

// Initialisation de Firebase Admin avec la Realtime Database
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://teste-9644d-default-rtdb.firebaseio.com" // Ton vrai databaseURL
});


const db = admin.database();

app.post('/addUser', async (req, res) => {
  try {
    const userData = req.body; // Données envoyées par le frontend
    if (!userData.nom || !userData.email || !userData.age) {
      return res.status(400).send('Champs manquants (nom, email, age)');
    }

    // Crée un nouvel enregistrement dans "Users" avec un ID auto-généré
    const newUserRef = db.ref("Users").push();
    await newUserRef.set(userData);

    res.status(200).send('User inséré avec succès ✅');
  } catch (error) {
    console.error('❌ Erreur sur insertion : ', error);
    res.status(500).send('Erreur sur insertion');
  }
});


app.get('/getUsers', async (req, res) => {
  try {
    const usersRef = db.ref("Users");
    const snapshot = await usersRef.once("value");

    const users = [];
    snapshot.forEach(child => {
      users.push({ id: child.key, ...child.val() });
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('❌ Erreur lors de la récupération : ', error);
    res.status(500).send('Erreur lors de la récupération');
  }
});


app.delete('/deleteUser/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    await db.ref("Users").child(userId).remove();
    res.status(200).send(`Utilisateur ${userId} supprimé avec succès ✅`);
  } catch (error) {
    console.error('❌ Erreur lors de la suppression : ', error);
    res.status(500).send('Erreur lors de la suppression');
  }
});


app.put('/updateUser/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const newData = req.body;
    await db.ref("Users").child(userId).update(newData);
    res.status(200).send(`Utilisateur ${userId} mis à jour avec succès ✅`);
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour : ', error);
    res.status(500).send('Erreur lors de la mise à jour');
  }
});


const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
