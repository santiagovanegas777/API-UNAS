const mongoose = require('mongoose');
const connect = async () => {
    try{
        const db = await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        const {name, host} = db.connection;
        console.log(`Connected to ${name} in host: ${host}`);
    }catch(error){
        console.log(`Error connecting to DDBB ${error}`);
    }
}

module.exports = {connect};