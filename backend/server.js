const express = require('express')
const app = express();
const db = require('./db');
require('dotenv').config();
const cors = require('cors');

const bodyParser = require('body-parser');

app.use(cors({
  origin: [
    "http://localhost:3001",
    "https://online-voting-system-kappa-fawn.vercel.app"
  ]
}));

app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
})