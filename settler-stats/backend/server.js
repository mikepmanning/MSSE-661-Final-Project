const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001; 
const uri = process.env.MONGODB_URI;


app.use(cors());
app.use(express.json()); 

mongoose.Promise = global.Promise;
mongoose.connect(uri, {
}).then(() => console.log('Connected to MongoDB Atlas!')).catch(err => console.error('Could not connect to MongoDB Atlas...', err));

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log('Connection Successful!');
});


app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});