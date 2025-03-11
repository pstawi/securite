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

    async login(email, password) {

        console.log("service", email, password);
        
        try {
            // récupérer l'utilisateur correspondant à l'adresse email dans la base de données 0
            const getUser = 'SELECT * FROM users WHERE email =?';
            // récupérer le premier résultat (il y en aura qu'un seul) 1
            const [rows] = await bdd.query(getUser, [email]);
            // check si l'utilisateur existe
            if (!rows || rows.length === 0) {
                throw new Error('utilisateur inconnu');
            }
            const user = rows[0];
            // vérifier si le mot de passe est correcte
            const validPassword = await bcrypt.compare(password, user.password);

            console.log(validPassword);
            
            // check si le mot de passe est correcte
            if (!validPassword) {
                throw new Error('mot de passe incorrect');
            }
            //génération du token
            const token = jwt.sign(
                {
                email: user.email,
                username: user.username,
                id: user.id
                },
            process.env.JWT_SECRET,
            { expiresIn: '3h' }
            );
            return {
                token: token,
            };
        } catch(error){
            throw new Error(error);
        };
    };

    async getAllUsers(){
        try{
            const getAllUsers = 'SELECT * FROM users';
            const [users] = await bdd.query(getAllUsers);
            return users;
        } catch(error){
            throw new Error(error);
        }
    };

    async deleteUser(id){
        try{
            // préparation de la requête
            const deleteUser = 'DELETE FROM users WHERE id = ?';
            // supprimer l'utilisateur de la base de données
            const [user] = await bdd.query(deleteUser,[id]);
            return user;
        } catch(error){
            throw new Error(error);
        }
    };

    async updateUser(id, username, email, password) {
        try {
            // Vérifier si l'utilisateur existe
            const checkUser = 'SELECT * FROM users WHERE id = ?';
            const [existingUser] = await bdd.query(checkUser, [id]);
    
            if (existingUser.length === 0) {
                throw new Error('User not found');
            }
    
            // Hasher le mot de passe uniquement s'il est fourni
            // Garder l'ancien mot de passe par défaut
            let hashedPassword = existingUser[0].password;
            if (password) {
                hashedPassword = await bcrypt.hash(password, 10);
            }
    
            // Mise à jour de l'utilisateur
            const updateQuery = 'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?';
            await bdd.query(updateQuery, [username, email, hashedPassword, id]);
    
            // Récupérer et retourner l'utilisateur mis à jour
            const [updatedUser] = await bdd.query(checkUser, [id]);
            return updatedUser[0];
        } catch (error) {
            throw new Error(error.message);
        }
    }
    
};
module.exports = new UserService();