const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv").config();


const app = express();

//import routes
const userRoutes = require('./routes/Users');

//app middleware
app.use(bodyParser.json());
app.use(cors());

//route middleware
app.use(userRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.send('Wellcome to weather Api 😎🤩!');
  });


const DB_URL = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;

mongoose.connect(DB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() =>{
    console.log('DB connected ✅');
})
.catch((err) => console.log('DB connection error 🔴',err));


app.listen(PORT, () =>{
    console.log(`App is running on ${PORT} 🟢`);
});