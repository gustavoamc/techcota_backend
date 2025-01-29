const router = require('express').Router()

const BudgetController = require('../controllers/BudgetController')
const verifyToken = require('../middlewares/verifyToken')

router.post('/create', verifyToken, BudgetController.createBudget)
router.get('/all', verifyToken, BudgetController.getAllUserBudgets)
router.get('/:id', verifyToken, BudgetController.getBudgetById)
router.put('/:id', verifyToken, BudgetController.updateBudget)
router.delete('/:id', verifyToken, BudgetController.deleteBudget)
router.get('/', verifyToken, BudgetController.dashboard)
router.post('/generate-pdf/:id', verifyToken, BudgetController.generatePDF)

module.exports = router