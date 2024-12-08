const router = require('express').Router()

const BudgetController = require('../controllers/BudgetController')
const verifyToken = require('../middlewares/verifyToken')

router.post('/create', verifyToken, BudgetController.createBudget)
router.get('/all', verifyToken, BudgetController.getAllUserBudgets)
router.get('/:id', verifyToken, BudgetController.getAllUserBudgets)

//TODO: dashbord routes

module.exports = router