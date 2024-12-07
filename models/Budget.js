const {Schema, default:mongoose} = require('mongoose')

const Budget = mongoose.model(
    'Budget',
    new Schema({
        status: {
            type: String,
            required: true,
        },
        generalVision: {
            type: String,
            required: true,
        },
        proposal: {
            type: String,
            required: true,
        },
        startDate:{
            type: Date,
            required: true,
        },
        endDate:{
            type: Date,
            required: true,
        },
        hoursAndValues:{
            maintenanceHours: { type: Number, required: true },
            creationHours: { type: Number, required: true },
            developmentHours: { type: Number, required: true },
            integrationHours: { type: Number, required: true },
            extraHours: { type: Number, required: true },
            maintenanceValue: { type: Number, required: true },
            creationValue: { type: Number, required: true },
            developmentValue: { type: Number, required: true },
            integrationValue: { type: Number, required: true },
            extraValue: { type: Number, required: true },
        }
    })
)

module.exports = Budget