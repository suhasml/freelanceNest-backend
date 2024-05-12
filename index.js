const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config({ path: "./.env"});
const projectsRouter = require('./routes/project');
const freelancerRouter = require('./routes/freelancer');
require("dotenv").config({ path: "../.env"});
const express = require('express');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;

const options ={ serverApi: { version: '1', strict: true, deprecationErrors: true } };

// Use routes

// app.use('/projects', projectsRouter);

// Start the server
mongoose.connect(uri, options);

const connection = mongoose.connection;

app.use('/PM', projectsRouter);
app.use('/freelancer', freelancerRouter);

connection.once("open", () => {
  console.log("MongoDB connection established successfully");
  app.listen(port, () => {
    console.log(`Server is running on Port ${port}`);
  });
});