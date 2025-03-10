const mysql = require('mysql2');
require('dotenv').config();

// creation d'une connection à la base de données
// les informations de connexion sont stockées dans un fichier .env
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const conn = connection.promise();

// // connexion à la base de données
// conn.connect((err) => {
//     if (err) throw err;
//     console.log('Connected to MySQL database');
// });

module.exports = conn;