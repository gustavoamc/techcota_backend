const { Schema, default: mongoose } = require('mongoose')

const User = mongoose.model(
    'User',
        new Schema({
            name: {
                type: String,
                required: true,
            },
            email: {
                type: String,
                required: true,
                unique: true,
                match: /^\S+@\S+\.\S+$/, // email regex validation
            },
            password: {
                type: String,
                required: true,
            },
            settings: {
                companyName: {
                    type: String,
                    required: true,
                    trim: true,
                },
                cnpj: {
                    type: String,
                    required: true,
                    unique: true,
                    match: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, // CNPJ regex validation (99.999.999/9999-99)
                },
                serviceRates: {
                    maintenance: { type: Number, required: true },
                    creation: { type: Number, required: true },
                    development: { type: Number, required: true },
                    integration: { type: Number, required: true },
                    extra: { type: Number, required: true },
                },
                address: {
                    type: String,
                    required: true,
                    trim: true,
                },
                contactEmail: {
                    type: String,
                    required: true,
                    match: /^\S+@\S+\.\S+$/, // email regex validation
                },
                contactPhone: {
                    type: String,
                    required: true,
                    match: /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, // phone regex validation to format (99) 99999-9999
                },
                website: {
                    type: String,
                    match: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,4}(\/[\w-]*)*\/?$/, // basic URL regex validation
                },
                logo: {
                    type: String, // image URL or path
                },
            },
            budgets: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'Budget',
                },
            ],
        },
        {timestamps: true}, // Adds `createdAt` and `updatedAt`
    )
)

module.exports = User