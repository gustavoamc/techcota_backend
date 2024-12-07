const router = require('express').Router()

const BudgetController = require('../controllers/BudgetController')
const verifyToken = require('../middlewares/verifyToken')

router.post('/create', verifyToken, BudgetController.createBudget)

module.exports = router