const express = require('express');
const {
    loginUser,
    registerUser,
    checkSession,
    adminRole,
    //------------
    getAllUsers, 
    getUserById,
    getUserByName,
    // -------------
    updateUser, 
    deleteUser, 
    // -------------
    getAddDestinationToUser,
    getAddActivityToUser
    } = require('../controller/user.controller');

//Para validar usuarios debo importar los ficheros del MIDDLEWARE

const { isAuth, isAdmin } = require('../../middlewares/auth');




const router = express.Router();

//RUTAS DE PRUEBA------------------
router.get('/pruebaAll/', getAllUsers);
router.get('/pruebaEmail/:email', getUserByName);
router.put('/pruebaUpdate/:id', updateUser);
router.delete('/pruebaDelete/:id', deleteUser);
//------------------------------------
router.post('/login', loginUser);
router.post('/register', registerUser)
router.post('/checkSession', [isAuth], checkSession);
router.post('/admin', [isAdmin], adminRole);
//------------------------------
router.get('/', [isAdmin], getAllUsers);
router.get('/id/:id', getUserById);
router.get('/email/:email', [isAuth], getUserByName);
// ----------------------------------------
router.put('/update/:id', [isAuth], updateUser);
router.delete('/delete/:id', [isAuth], deleteUser);
// ----------------------------------------
router.get('/addDestination', [isAuth], getAddDestinationToUser);
router.get('/addActivity', [isAuth], getAddActivityToUser);


module.exports = router;