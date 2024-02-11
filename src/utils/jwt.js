const jwt = require('jsonwebtoken');

//Tengo que crear my key con el que crearé y firmaré tokens.
//Esta key está guardada en .env y debo tenerlo en cuenta cuando suba a vercel


//Creo dos funciones: una para crear el token y otra para comprobarlo:

const generateSign = (id,email)=>{
    //id e email son los correspondientes al usuario que solicita el token
    //El tercer parámetro es la duración del token
    return jwt.sign({id,email}, process.env.JWT_KEY, {expiresIn:"1h"});
}

const verifySign = (token)=>{
    return jwt.verify(token, process.env.JWT_KEY);
}

module.exports = {generateSign, verifySign};