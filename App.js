const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
});


const userSchema = new mongoose.Schema({
    userid: Number,
    name: String,
});
const User = mongoose.model('User', userSchema);

mongoose.connect('mongodb://admin:password@localhost:27017/user-account?authSource=admin', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB:', err));

app.get('/get-profile', async (req, res) => {
    try {
        const user = await User.findOne({ userid: 1 }).exec();
        res.send(user);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).send('Internal Server Error');
    }
});

app.listen((4000), () => {
    console.log('Server is running on port 4000')
});