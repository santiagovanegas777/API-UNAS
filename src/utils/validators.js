const User = require('../api/models/user.model')


const validatePassword = (pass) => {
    const regex =
       //regex sencillo: mínimo 8 caracteres, una letra y un número
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    return regex.test(pass);
};

const validateEmail = (email) => {
    const regex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; //Regex email
    return regex.test(email);
};

//Para poder hacer las validaciones, debo recorrer los registros ya existentes en la base de datos.
//Importo el modelo de datos.

const usedEmail = async (email)=>{

    const users = await User.find({email:email});
    //El primer email es el que recibo en el find y, el segundo es el debo comprobar y que recibo por parámetros 
    //Lo que recibo como resultado es el ARRAY de objetos que cumplen con esa condición. Si no hay objetos que lo cumplan, la longitud del array es 0.
    return users.length;
};

const usedUserName = async (username)=>{

    const users = await User.find({username:username});
    //Idem para el username 

    return users.length;
}

const getUserId = async (id) => {
    
        
        const getUser = await User.findById(id)
        
        return getUser;
    
    
}

module.exports = { validatePassword, validateEmail, usedEmail, usedUserName, getUserId }