const express = require('express');
const cors = require('cors'); // Import the cors middleware
const app = express();
const port = 3001; 

app.use(cors()); // Enable CORS for all origins (or configure for specific origins)
app.use(express.json()); // To parse JSON in request bodies

// Basic route to test
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Your API endpoints will go here later...

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});