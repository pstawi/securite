const bdd = require('../config/bdd');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class UserService {
    async register(username,email,password){
        try{
            // préparations de la requête
            const addUser = 'INSERT INTO users (username,email,password) VALUES (?,?,?)';
            
            // hasher le mot de passe
            const hashedPassword = await bcrypt.hash(password, 10);
            
            // insérer l'utilisateur dans la base de données
           const [user] = await bdd.query(addUser,[username,email,hashedPassword]);
           console.log(user);

           return {
                id: user.insertId,
                username: username,
                email: email
           };
           
        } catch(error){
            throw new Error(error);
        }
    }

     login(email, password) {
        try {

            // récupérer l'utilisateur correspondant à l'adresse email dans la base de données 0
            const getUser = 'SELECT * FROM users WHERE email =?';
            // récupérer le premier résultat (il y en aura qu'un seul) 1
            const user =  bdd.query(getUser, [email]);

            // check si l'utilisateur existe
            if (!user) {
                throw new Error('utilisateur inconnu');
            }

            // vérifier si le mot de passe est correcte
            const validPassword =  bcrypt.compare(password, user[0].password);

            // check si le mot de passe est correcte
            if (!validPassword) {
                throw new Error('mot de passe incorrect');
            }

            //génération du token
            const token = jwt.sign(
                {
                email: user[0].email,
                username: user[0].username,
                id: user[0].id
                },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
            );

            return {
                token: token,
            };

        } catch(error){
            throw new Error(error);
        };
    };
};
module.exports = new UserService();