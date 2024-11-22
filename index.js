const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/route')
require('dotenv').config();

const app = express();

// Use the MongoDB URI from the .env file
const Db = process.env.MONGO_URL; // MongoDB URI from .env

app.use(cors());
app.use(express.json());

mongoose
  .connect(Db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB Connection Successful');
  })
  .catch((err) => {
    console.error('DB Connection Error: ' + err.message);
  });

  app.use('/api/user', userRoutes);

const server = app.listen(process.env.PORT || 5000, () =>
  console.log(`Server started on port ${process.env.PORT || 5000}`)
);
