const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const userSchema = new mongoose.Schema({
    userid: Number,
    name: String,
});
const User = mongoose.model('User', userSchema);
const uri = process.env.MONGODB_URI;

const initializeDatabase = async () => {
    try {
        console.log(uri);
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;

        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(col => col.name);

        if (!collectionNames.includes('users')) {
            console.log('Initializing database...');
            await db.createCollection('users');
            console.log('Database initialized');
        }

        const userCollection = db.collection('users');
        const existingUser = await userCollection.findOne({ userid: 1 });
        if (!existingUser) {
            await userCollection.insertOne({ userid: 1, name: 'mehdi' });
            console.log('Default user added');
        }

        // Start the server after the database is initialized
        app.listen(4000, () => {
            console.log('Server is running on port 4000');
        });

    } catch (err) {
        console.error('Database initialization error:', err);
        process.exit(1);
    }
};

// Call initializeDatabase to start the process
initializeDatabase();

app.get('/add-profile', async (req, res) => {
    const { name, email } = req.query;
    try {
        const newUser = new User({ name, email});
        const savedUser = await newUser.save();
        res.status(201).send(savedUser);
    } catch (err) {
        console.error('Error adding user:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/get-profile', async (req, res) => {
    try {
        const user = await User.findOne({ userid: 1 }).exec();
        res.send(user);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).send('Internal Server Error');
    }
});