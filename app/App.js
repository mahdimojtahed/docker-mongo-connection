const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!');
});


const uri = process.env.MONGODB_URI;

const initializeDatabase = async () => {
    try {
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        const db = mongoose.connection.db;

        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(col => col.name);

        if (!collectionNames.includes('users')) {
            await db.createCollection('users');
        }
    } catch (err) {
        console.error('Database initialization error:', err);
        process.exit(1);
    }
};

// Call initializeDatabase to start the process
initializeDatabase();

app.get('/add-profile', async (req, res) => {
    const { name, userid } = req.query;
    try {
        const db = mongoose.connection.db;
        const userCollection = db.collection('users');
        let user = await userCollection.insertOne({name, userid});
        res.status(201).send(user);
    } catch (err) {
        console.error('Error adding user:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/get-profile', async (req, res) => {
    const { userid } = req.query;
    console.log(userid);

    try {
        const db = mongoose.connection.db;
        const user = await db.collection('users').findOne({ userid: userid });

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.send(user);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});