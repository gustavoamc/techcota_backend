const {Schema, default:mongoose} = require('mongoose')

const Budget = mongoose.model(
    'Budget',
    new Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
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
        ratesUsed: {
            maintenance: { type: Number, required: true },
            creation: { type: Number, required: true },
            development: { type: Number, required: true },
            integration: { type: Number, required: true },
            extra: { type: Number, required: true },
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
        },
        minInstallmentValue: {
            type: Number,
            required: true,
        },
        installments:{
            type: Array,
            required: true,
        }
    },
    {timestamps: true}, // Adds `createdAt` and `updatedAt`
)
)

module.exports = Budget