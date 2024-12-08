const ObjectId = require('mongoose').Types.ObjectId

const Budget = require('../models/Budget')

const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

//budget "belongs to" user but is here to ease handling of the data
module.exports = class BudgetController {
    static async createBudget(req, res) {
        // get data from req.body, except status which is set to "waiting" by default
        const { generalVision, proposal, startDate, endDate, maintenanceHours, creationHours, developmentHours, integrationHours, extraHours } = req.body
        const token = getToken(req)

        const user = await getUserByToken(token)

        // check if user exists
        if (!user) {
            res.status(422).json({
                message: "Usuário não encontrado!",
            })
            return
        }

        // validations
        if(!generalVision) {
            res.status(422).json({message: 'O campo Visão geral é obrigatório!'})
            return
        }
        if(!proposal) {
            res.status(422).json({message: 'O campo Proposta é obrigatório!'})
            return
        }
        if(!startDate) {
            res.status(422).json({message: 'O campo Data de início é obrigatório!'})
            return
        }
        if(!endDate) {
            res.status(422).json({message: 'O campo Data de término é obrigatório!'})
            return
        }
        if(!maintenanceHours || !creationHours || !developmentHours || !integrationHours || !extraHours) {
            res.status(422).json({message: 'Todos os campos de horas devem ser preenchidos!'})
            return
        }

        // get user company service rates
        const rates = user.settings.serviceRates

        // create a budget
        const newBudget = new Budget({
            user: new ObjectId(user._id),
            status: "waiting",
            generalVision,
            proposal,
            startDate,
            endDate,
            hoursAndValues: {
                maintenanceHours,
                creationHours,
                developmentHours,
                integrationHours,
                extraHours,
                maintenanceValue: maintenanceHours * rates.maintenance,
                creationValue: creationHours * rates.creation,
                developmentValue: developmentHours * rates.development,
                integrationValue: integrationHours * rates.integration,
                extraValue: extraHours * rates.extra,
            }
        })

        try {
            // save budget data
            const savedBudget = await newBudget.save()

            res.status(201).json({
                message: 'Orçamento criado com sucesso!',
                budget: savedBudget,
            })
            return
        }
        catch (error) {
            res.status(500).json({message: error})
            return
        }
    }
    
    static async getAllUserBudgets(req, res) {
        const token = getToken(req)
        const user = await getUserByToken(token)

        // check if user exists
        if (!user) {
            res.status(422).json({
                message: "Usuário não encontrado!",
            })
            return
        }

        try {
            // get all budgets from user
            const budgets = await Budget.find({user: user._id}).sort('-createdAt')

            res.status(200).json({
                budgets: budgets,
            })
            return
        }
        catch (error) {
            res.status(500).json({message: error})
            return
        }
    }

    static async getBudgetById(req, res) {
        const id = req.params.id
        const token = getToken(req)
        const user = await getUserByToken(token)

        try {
            const budget = await Budget.findOne({_id: id})
            
            if (!budget) {
                res.status(422).json({message: 'Orçamento não encontrado!'})
                return
            }

            if (user._id.toString() !== budget.user.toString()) {
                res.status(422).json({message: 'Erro interno do sistema!'})
                return
            }

            res.status(200).json({
                budget: budget,
            })
            return
        } catch (error) {
            res.status(500).json({message: error})
            return
        }

    }

    static async updateBudget(req, res) {
        const id = req.params.id
        const { status, generalVision, proposal, startDate, endDate, maintenanceHours, creationHours, developmentHours, integrationHours, extraHours } = req.body

        const token = getToken(req)
        const user = await getUserByToken(token)

        // check if user exists
        if (!user) {
            res.status(422).json({
                message: "Usuário não encontrado!",
            })
            return
        }

        // check if budget exists
        const budget = await Budget.findOne({_id: id})

        if (!budget) {
            res.status(422).json({message: 'Orçamento não encontrado!'})
            return
        }

        // check if user registered this budget
        if (user._id.toString() !== budget.user.toString()) {
            res.status(422).json({message: 'Erro interno do sistema!'})
            return
        }

        // get user's company service rates
        const rates = user.settings.serviceRates

        // validations
        if (!status){
            res.status(422).json({message: 'O campo Status é obrigatório!'})
            return
        }
        if(!generalVision) {
            res.status(422).json({message: 'O campo Visão geral é obrigatório!'})
            return
        }
        if(!proposal) {
            res.status(422).json({message: 'O campo Proposta é obrigatório!'})
            return
        }
        if(!startDate) {
            res.status(422).json({message: 'O campo Data de início é obrigatório!'})
            return
        }
        if(!endDate) {
            res.status(422).json({message: 'O campo Data de término é obrigatório!'})
            return
        }
        if(!maintenanceHours || !creationHours || !developmentHours || !integrationHours || !extraHours) {
            res.status(422).json({message: 'Todos os campos de horas devem ser preenchidos!'})
            return
        }

        const updateBudget = {
            status,
            generalVision,
            proposal,
            startDate,
            endDate,
            hoursAndValues: {
                maintenanceHours,
                creationHours,
                developmentHours,
                integrationHours,
                extraHours,
                maintenanceValue: maintenanceHours * rates.maintenance,
                creationValue: creationHours * rates.creation,
                developmentValue: developmentHours * rates.development,
                integrationValue: integrationHours * rates.integration,
                extraValue: extraHours * rates.extra,
            }
        }

        try{
            // update budget
            const updatedBudget = await Budget.findOneAndUpdate({_id: id}, updateBudget)

            res.status(200).json({
                message: 'Orçamento atualizado com sucesso!',
                budget: updatedBudget,
            })
            return
        }
        catch (error) {
            res.status(500).json({message: error})
            return
        }
    }

    static async deleteBudget(req, res) {
        const id = req.params.id
        const token = getToken(req)
        const user = await getUserByToken(token)

        // check if user exists
        if (!user) {
            res.status(422).json({
                message: "Usuário não encontrado!",
            })
            return
        }

        // check if budget exists
        const budget = await Budget.findOne({_id: id})

        if (!budget) {
            res.status(422).json({message: 'Orçamento não encontrado!'})
            return
        }

        // check if user registered this budget
        if (user._id.toString() !== budget.user.toString()) {
            res.status(422).json({message: 'Erro interno do sistema!'})
            return
        }

        try {
            await Budget.findByIdAndDelete({_id: id})
            res.status(200).json({message: 'Orçamento excluído com sucesso!'})
            return
        } catch (error) {
            res.status(500).json({message: error})
            return
        }
    }
        
    static async dashboard(req, res) {
        const token = getToken(req)
        const user = await getUserByToken(token)

        // check if user exists
        if(!user){
            res.status(422).json({
                message: "Usuário não encontrado!",
            })
            return
        }

        const threeMonthsAgo = new Date()
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

        try{
            const totalWaitingBudgetsCount = await Budget.countDocuments({
                status: 'waiting', 
                user: user._id
            }).sort('-createdAt')

            const totalApprovedBudgetsCount = await Budget.countDocuments({
                status: 'approved', 
                user: user._id
            }).sort('-createdAt')

            const lastThreeMonthsBudgets = await Budget.countDocuments({user: user._id, createdAt: {$gte: threeMonthsAgo}})

            res.status(200).json({
                totalWaitingBudgetsCount,
                totalApprovedBudgetsCount,
                lastThreeMonthsBudgets,
            })
            return
        }
        catch (error) {
            res.status(500).json({message: error})
            return
        }
    }
}