const express = require('express')
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.get('/profile', (req, res) => {
    MongoClient.connect('mongodb://admin:password@localhost:27017', (err, client) => {
        if (err) {
            console.error('Failed to connect to MongoDB:', err);
            return res.status(500).send('Internal Server Error');
        }

        const db = client.db('user-account');
        const query = { userid: 1 };
        db.collection('users').findOne(query, (err, result) => {
            if (err) {
                console.error('Error finding document:', err);
                client.close();
                return res.status(500).send('Internal Server Error');
            }

            client.close();
            res.send(result);
        });
    });
});

app.listen((3000), () => {
    console.log('Server is running on port 3000')
});