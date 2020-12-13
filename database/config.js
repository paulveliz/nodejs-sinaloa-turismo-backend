const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('MongoDB Activated');
    } catch (error) {
       console.log(error); 
       throw new Error('Error detectado');
    }
}

module.exports ={
    dbConnection
}