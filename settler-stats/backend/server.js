const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT; 
const uri = process.env.MONGODB_URI;


app.use(cors());
app.use(express.json()); 

// Make connection to the db
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {
}).then(() => console.log('Connected to MongoDB Atlas!')).catch(err => console.error('Could not connect to MongoDB Atlas...', err));

// Store the instance of db so we can listen to events.
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log('Connection Successful!');
});

// Basic route to test
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Your API endpoints will go here later...

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});