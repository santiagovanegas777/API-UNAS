
const User = require('../models/user.model.js')

const bcrypt = require("bcrypt");
const {
  validatePassword,
  validateEmail,
  usedEmail,
  usedUserName,
  getUserId
} = require("../../utils/validators");
const { generateSign } = require("../../utils/jwt");


//El Usuario completa sus datos de login (email y password) y envía el formulario. Comparamos si existe ese email y el password encriptado y, si son correctos, generamos el token

const loginUser = async (req, res) => {
    //Debo comparar la contraseña con la encriptada
    try {
      const userInfo = await User.findOne({ email: req.body.email });
      if (
        !userInfo ||
        !bcrypt.compareSync(req.body.password, userInfo.password)
      ) {
        return res.status(400).json({ message: "Datos incorrectos" });
      }
      //console.log(userInfo.id);
      const token = generateSign(userInfo.id, userInfo.email);
      //console.log(token);
      //Debo enviar el token con la información del usuario
      return res.status(200).json({ token, userInfo });
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  
  //Cuando el usuario envía el formulario de registro, validamos que la contraseña y el email se corresponden con sus regex y, además, comporbamos que no existen email y username duplicados.
  //Cumplido esto, encriptamos su contraseña

  const registerUser = async (req, res) => {
    try {
      const newUser = new User(req.body);
  
      //Los validadores los definimos en utils y debemos aplicarlos antes de encriptar
  
      if (!validatePassword(newUser.password)) {
        return res.status(400).json({ message: "Contraseña incorrecta" });
      }
      if (!validateEmail(newUser.email)) {
        return res.status(400).json({ message: "Formato email incorrecto" });
      }
      if ((await usedEmail(newUser.email)) > 0) {
        //OJO: Esta función es asíncrona porque así está definida en el validators
        return res
          .status(400)
          .json({ message: "Email ya registrado. No se puede dar de alta" });
      }
      if ((await usedUserName(newUser.username)) > 0) {
        //OJO: Esta función es asíncrona porque así está definida en el validators
        return res
          .status(400)
          .json({ message: "Username ya registrado. No se puede dar de alta" });
      }
  
      //Para poder encriptar la contraseña, debo importar la librería y usarla:
  
      newUser.password = bcrypt.hashSync(newUser.password, 10);
  
      const createdUser = await newUser.save();
      return res.status(200).json(createdUser);
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  
  const checkSession = async (req, res) => {
    try {
      res.status(200).json(req.user); //Este user lo recibo desde auth.js una vez verificado el token
    } catch (error) {
      return res.status(500).json(error);
    }
  };
  const adminRole = async (req, res) => {
    try {
      res.status(200).json(req.user); //Este user lo recibo desde auth.js una vez verificado el token
    } catch (error) {
      return res.status(500).json(error);
    }
  };




// Devuelve todos los usuarios
const getAllUsers = async (req, res) => {
    try{
        const allUsers = await User.find()
        .populate({
        path: "destinations", select:"destinationPlace"
        },{
          path: "activities", select:"activityName"
          }); // .find({_id: id}) es lo mismo que .findById(id);
        return res.status(200).json(allUsers);
    }catch(error){
        return res.status(500).json(error);
    }
    
}

// Devuelve un usuario según su _id
const getUserById = async (req, res) => {
    try{
        const {id} = req.params;
        const getUserId = await User.findById(id)
        // const getUserId = await User.findById(id).populate({
        //     path: "destinations", select:"destinationName"
        // }); // .find({_id: id}) es lo mismo que .findById(id)
        return res.status(200).json(getUserId);
    }catch(error){
        return res.status(500).json(error);
    }
    
}

// Devuelve el nombre del usuario al mandar su email por la URL
const getUserByName = async (req, res) => {
    try{
        const {email} = req.params; 
        const getUserName = await User.find({email: email},{_id:0, username:1});
        return res.status(200).json(getUserName);
    }catch(error){
        return res.status(500).json(error);
    }
    
}


// Modifica un usuario enviando id por la url y datos nuevos por el body
const updateUser = async (req, res) => {
    try{
        const {id} = req.params;
        const putUser = new User(req.body);
        putUser._id = id;

      
        if (!validatePassword(putUser.password)) {
          return res.status(400).json({ message: "Contraseña incorrecta" });
        }
        if (!validateEmail(putUser.email)) {
          return res.status(400).json({ message: "Formato email incorrecto" });
        }

         const actualUser= await getUserId(id);

        if(actualUser.email!== putUser.email){

              if ((await usedEmail(putUser.email)) > 0) {
                      //OJO: Esta función es asíncrona porque así está definida en el validators
                      return res
                        .status(400)
                        .json({ message: "Email ya registrado. No se puede dar de alta" });
                    }
        }
        
        if(actualUser.username !== putUser.username){
          if ((await usedUserName(putUser.username)) > 0) {
          //OJO: Esta función es asíncrona porque así está definida en el validators
          return res
            .status(400)
            .json({ message: "Username ya registrado. No se puede dar de alta" });
          }
        }

        putUser.password = bcrypt.hashSync(putUser.password, 10);
    
 
        const updatedUser = await User.findByIdAndUpdate(id, putUser, {new: true});
        if(!updatedUser){
            return res.status(404).json({message: "Usuario no encontrado"})
        }
        return res.status(200).json(updatedUser);
    }catch(error){
        console.log(error)
        return res.status(500).json(error)
    }
}

// Elimina usuarios de la base de datos mandando su id por la url
const deleteUser = async (req, res) => {
    try{
        const {id} = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if(!deletedUser){
            return res.status(404).json({message:"Usuario no encontrado"});
        }
        return res.status(200).json(deletedUser);
    }catch(error){
        return res.status(500).json(error);
    }
    
}

// Añade un destino al array destinations[] del usuario ENVIANDO iduser y idDestino mediante query:


const getAddDestinationToUser = async (req, res) => {
    try{
        const {iduser, idDestination} = req.query;
               
        const updatedUser = await User.findOneAndUpdate(
            {_id: iduser},
            {$push:{detinations: idDestination}}, 
            {new:true}
            );
        return res.status(200).json(updatedUser);
    }catch(error){
        return res.status(500).json(error);
    }
    
}

const getAddActivityToUser = async (req, res) => {
  try{
      const {iduser, idActivity} = req.query;
             
      const updatedUser = await User.findOneAndUpdate(
          {_id: iduser},
          {$push:{activities: idActivity}}, 
          {new:true}
          );
      return res.status(200).json(updatedUser);
  }catch(error){
      return res.status(500).json(error);
  }
  
}

module.exports = {
    loginUser,
    registerUser,
    checkSession,
    adminRole,
    getAllUsers,
    getUserById,
    getUserByName,
    updateUser, 
    deleteUser,
    getAddDestinationToUser,
    getAddActivityToUser
    };