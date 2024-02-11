const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//Ajusto el modelo al que hemos acordado en la reunión de equipo:

const userSchema = new Schema(
    {
        email: {type: String, required: true},
        password: {type: String, required: true},
        username: {type:String, required: true},
        role: {type:String, default: "user", enum: ['admin', 'user']},
        telefono: {type:String, required: true},
        nombre: {type:String, required: true},
        apellidos: {type:String, required: true},
        direccion: {type:String, required: true},
        // destination: [{type: Schema.Types.ObjectId, ref: 'destinations'}],
        // activity: [{type: Schema.Types.ObjectId, ref: 'activities'}] 
         // la ref de reservas: es el nombre de la colección en la DB de donde toma los id
    },{
        timestamps: true,
        collection: 'users'
    }
)

const User = mongoose.model('users', userSchema);

module.exports = User;
