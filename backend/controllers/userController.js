const userService = require('../services/userService');

class UserController {

    // fonction de connection
    login(req,res){
        try{
            const {email,password} = req.body;
            // connexion de l'utilisateur
             userService.login(email,password);
        
            return res.status(200).json({message: 'User logged in successfully'});
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
}

module.exports = new UserController();