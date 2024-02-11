const express = require('express');
const upload = require("../../middlewares/upload.file")
const {
    getAllEstilos, 
    getEstilosId,
    getEstilosPrice,
   
    // --------------------
    postEstilos, 
    putEstilos, 
    deleteEstilos, 
    } = require('../controller/estilo.controller');

const router = express.Router();

router.get('/', getAllEstilos);

router.get('/id/:id', getEstilosId);
router.get('/EstiloPrice/:EstiloName', getEstilosPrice);

// -----------------------------------------
router.post('/', upload.single('estiloImg'), postEstilos);
router.put('/:id', upload.single('estiloImg'), putEstilos);
router.delete('/:id', deleteEstilos);



module.exports = router;