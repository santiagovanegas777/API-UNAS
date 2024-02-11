const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const estilosSchema = new Schema(
    {
        estiloName: {type: String, required: true},
        estiloPrice: {type: Number, required: true},
        estiloImg: {type: String, required: true},
      

    },{
        timestamps: true,
        collection: 'estilo'
    }
)

const Estilos = mongoose.model('estilo', estilosSchema);

module.exports = Estilos;