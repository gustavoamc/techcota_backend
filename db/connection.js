const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado com sucesso ao MongoDB!');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);
        process.exit(1); // Finaliza o processo em caso de erro
    }
};

module.exports = dbConnection;
