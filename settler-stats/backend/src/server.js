import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import * as dotenv from 'dotenv';

dotenv.config();

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
app.use('/api/game', gameRoutes);

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});