const router = require('express').Router()

const BudgetController = require('../controllers/BudgetController')
const verifyToken = require('../middlewares/verifyToken')

router.post('/create', verifyToken, BudgetController.createBudget)
router.get('/all', verifyToken, BudgetController.getAllUserBudgets)
router.get('/:id', verifyToken, BudgetController.getAllUserBudgets)
router.put('/:id', verifyToken, BudgetController.updateBudget)
router.delete('/:id', verifyToken, BudgetController.deleteBudget)

//TODO: dashbord routes

module.exports = router