const { verifySign} = require('../utils/jwt');
//Debo importar el modelo para poder comporbar que el id y el email se corresponden con el token
const User = require('../api/models/user.model');

//DEBO CREAR UNA RUTA PARA CHEQUEAR EL INICIO DE SESIÓN

//Validamos si el token existe

const isAuth = async (req,res,next)=>{
    try {
    //Necesito recibir un token que no se recibe ni por params ni por query.paramas si no por los headers
    const authorization = req.headers.authorization
        if(!authorization){
            return res.status(401).json({message:'No estás autorizado'});
        }
    //Para coger la segunda parte del token que es la que tiene el valor del id y del email, necesito hacer un split y me quedo con la posición [1]

    const token = authorization.split(" ")[1];
    if(!token){
        return res.status(401).json({message:'No he recibido token: no estás autorizado'});
    }

    //Verificamos que el token ha sido creado con el jwt
    
    let tokenVerified = verifySign(token, process.env.JWT_KEY);

    if(!tokenVerified){
        return res.status(401).json(tokenVerified);
    }
    console.log(tokenVerified);//El Postman parece colgarse=> verificar en la terminal

    const loggedUser = await User.findById(tokenVerified.id);

    req.user = loggedUser;

    //Tengo que utilizar la función next, que me permitirá ejecutar las funciones que estén autorizadas en el caso de que lo estén

    next();

    } catch (error) {
        return res.status(500).json(error);
    }
}

const isAdmin = async (req,res,next)=>{
    try {
        //Necesito recibir un token que no se recibe ni por params ni por query.paramas si no por los headers
        const authorization = req.headers.authorization
            if(!authorization){
                return res.status(401).json({message:'No estás autorizado'});
            }
        //Para coger la segunda parte del token que es la que tiene el valor del id y del email, necesito hacer un split y me quedo con la posición [1]
    
        const token = authorization.split(" ")[1];
        if(!token){
            return res.status(401).json({message:'No he recibido token: no estás autorizado'});
        }
    
        //Verificamos que el token ha sido creado con el jwt
        
        let tokenVerified = verifySign(token, process.env.JWT_KEY);
    
        if(!tokenVerified){
            return res.status(401).json(tokenVerified);
        }
        console.log(tokenVerified);//El Postman parece colgarse=> verificar en la terminal
    
        const loggedUser = await User.findById(tokenVerified.id);

        //Ahora tengo que valorar que el usuario logueado es admin
        
        if(loggedUser.role !== "admin"){

            return res.status(401).json({message:'No tienes privilegios de administrador: NO PUEDES PASAR!!!!'});
        }
    
        //Tengo que utilizar la función next, que me permitirá ejecutar las funciones que estén autorizadas en el caso de que lo estén
    
        req.user = loggedUser;    

        next();
    
        } catch (error) {
            return res.status(500).json(error);
        }
}

module.exports = { isAuth, isAdmin }