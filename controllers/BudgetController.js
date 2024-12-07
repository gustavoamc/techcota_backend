const Budget = require('../models/Budget')
const User = require('../models/User')

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
        if(!maintenanceHours) {
            res.status(422).json({message: 'O campo Horas de manutenção é obrigatório!'})
            return
        }
        if(!creationHours) {
            res.status(422).json({message: 'O campo Horas de criação é obrigatório!'})
            return
        }
        if(!developmentHours) {
            res.status(422).json({message: 'O campo Horas de desenvolvimento é obrigatório!'})
            return
        }
        if(!integrationHours) {
            res.status(422).json({message: 'O campo Horas de integração é obrigatório!'})
            return
        }
        if(!extraHours) {
            res.status(422).json({message: 'O campo Horas extras é obrigatório!'})
            return
        }

        // get user company service rates
        const rates = user.settings.serviceRates

        // create a budget
        const newBudget = new Budget({
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

            // associate budget to user
            user.budgets.push(savedBudget._id)
            await user.save()

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
}