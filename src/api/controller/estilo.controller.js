const Estilo = require('../models/estilo.model.js')


// Devuelve todas las actividades
const getAllEstilos = async (req, res) => {
    try{
        const allEstilos = await Estilo.find()
        return res.status(200).json(allEstilos);
    }catch(error){
        return res.status(500).json(error);
    }
    
}

// Devuelve una actividad desde su _id por params
const getEstilosId = async (req, res) => {
    try{
        const {id} = req.params; 
        const getEstiloId = await Estilo.find({_id: id});
        return res.status(200).json(getEstiloId);
    }catch(error){
        return res.status(500).json(error);
    }
    
}

// Devuelve el precio de actividad desde su nombre por params
const getEstilosPrice = async (req, res) => {
    try{
        const {estiloName} = req.params; 
        const getEstiloPrice = await Estilo.find({estiloName: estiloName},{_id:0, estiloPrice:1});
        return res.status(200).json(getEstiloPrice);
    }catch(error){
        return res.status(500).json(error);
    }
    
}




// Crea un nueva actividad en la DB
const postEstilos = async (req, res) => {
    try{
        const newEstilo = new Estilo(req.body);

        if(req.file.path){
            newEstilo.estiloImg = req.file.path;
        }
        const createdEstilo = await newEstilo.save();
        return res.status(201).json(createdEstilo);
    }catch (error) {
        return res.status(500).json(error);
    }
}



// Modifica una actividad desde id por params y datos por el body
const putEstilos = async (req, res) => {
    console.log(req.body);
    try{
        const {id} = req.params;
        const putEstilo = new Estilo(req.body);
        putEstilo._id = id;
        if(req.file.path){
            putEstilo.estiloImg = req.file.path;
        }
        const updatedEstilo = await Estilo.findByIdAndUpdate(id, putEstilo, {new: true});
        if(!updatedEstilo){
            return res.status(404).json({message: "Estilo no encontrado"})
        }
        return res.status(200).json(updatedEstilo);
    }catch(error){
        return res.status(500).json(error)
    }
}
// Elimina actividades de la base de datos mandando su id por la url
const deleteEstilos = async (req, res) => {
    try{
        const {id} = req.params;
        const deletedEstilo = await Estilo.findByIdAndDelete(id);
        if(!deletedEstilo){
            return res.status(404).json({message:"Estilo no encontrado"});
        }
        return res.status(200).json(deletedEstilo);
    }catch(error){
        return res.status(500).json(error);
    }
    
}

module.exports = {
    getAllEstilos,
    getEstilosId,
    getEstilosPrice,
  
    // -----------------
    postEstilos, 
    putEstilos, 
    deleteEstilos, 
    };