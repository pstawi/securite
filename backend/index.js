const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const connection = require('./config/bdd');
const user = require('./routes/userRoute');


//middleware
// utilisation de cors pour éviter les erreurs de CORS
app.use(cors());

//config bodyparser
app.use(express.json());

// routes
app.use('/user', user);
//start server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});