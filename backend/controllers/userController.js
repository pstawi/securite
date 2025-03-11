const userService = require('../services/userService');

class UserController {
    // fonction de connection
   async login(req,res){
        try{
            const {email,password} = req.body;
            console.log("controller",email,password);
            // connexion de l'utilisateur
            const userToken = await userService.login(email,password);     
            return res.status(200).json({
                sucess: true,
                message: 'User logged in successfully',
                data: userToken
            });
        }
        catch(error){
            return res.status(400).json({message: error.message});
        }
    };
    // fonction d'inscription
  async register(req,res){
        try{
            // Vérification des champs email, username et password
            const {username,email,password} = req.body;
            // inscription de l'utilisateur
          const user = await userService.register(username,email,password);
            // renvoi du message de succès
            return res.status(201).json({
                sucess: true,
                data: user,
                message: 'User registered successfully'});
        }
        catch(error){
            return res.status(400).json({message: error.message});
        }
    }

    // fonction pour récupérer tous les utilisateurs
    async getAllUsers(req,res){
        try{
            const users = await userService.getAllUsers();
            return res.status(200).json({
                sucess: true,
                data: users
            });
        }
        catch(error){
            return res.status(400).json({message: error.message});
        }
    };

    // fonction pour supprimer un utilisateur
    async deleteUser(req,res){
        try{
            const {id} = req.params;
            const user = await userService.deleteUser(id);
            return res.status(200).json({
                sucess: true,
                data: user,
                message: 'User deleted successfully'
            });
        }
        catch(error){
            return res.status(400).json({message: error.message});
        }
    };
}

module.exports = new UserController();