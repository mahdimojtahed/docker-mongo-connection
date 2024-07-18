const express = require('express')
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get('/get-profile', (req, res) => {
    let response = res;
    MongoClient.connect('mongodb://admin:password@localhost:27017', (e, c) => {
        if (e) throw e;

        let db = c.db('user-account')
        let query = {userid: 1}
        db.collection('users').findOne(query, (e, r) => {
            if (e) throw e;
            c.close();
            response.send(r)
        })
    })

})

app.listen((3000), () => {
    console.log('Server is running on port 3000')
});