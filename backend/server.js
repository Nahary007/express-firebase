const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors');

const app =express();
app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:3000'
}));

const serviceAccount = require('./firebase-key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://teste-9644d-default-rtdb.firebaseio.com"
});

const db = admin.firestore();

//route pour inserer des données dans la collection 'Users'
app.post('/addUser', async (req, res)=> {
    try {
        const userData = req.body;//les données envoyer par le client

        const docRef = db.collection('Users').doc();

        await docRef.set(userData);

        res.status(200).send('User inséré avec succés');
    } catch (error) {
        console.error('Erreur sur insertion : ', error);
        res.status(500).send('Erreur sur insertion');
    }
});

//route pour recuperer des données dans la collections 'Users'
app.get('/getUsers', async (req, res) => {
    try {
        const usersRef = db.collection('Users');
        const snapshot = await usersRef.get();
        const users = [];

        snapshot.forEach(doc => {
            users.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json(users);
    } catch (error) {
        console.error('Error lors de la recuperation : ', error);
        res.status(500).send('Erreur lors de la recuperation');
    }
});

const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

