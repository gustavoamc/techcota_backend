require('dotenv').config(); // loads .env
const express = require('express');
const cors = require('cors');
const dbConnection = require('./db/connection');

const UserRoutes = require('./routes/UserRoutes');
const BudgetRoutes = require('./routes/BudgetRoutes');

const app = express();

// connect to mongodb
dbConnection();

// global middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/user', UserRoutes);
app.use('/budget', BudgetRoutes);

// Initialize server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
