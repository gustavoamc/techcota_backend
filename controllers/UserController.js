const User = require('../models/User');
const createUserToken = require('../helpers/create-user-token');
const getToken = require('../helpers/get-token');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const getUserByToken = require('../helpers/get-user-by-token');

module.exports = class UserController {
    static async register(req, res) {
        const { name, email, password, confirmpassword, companyName, cnpj, serviceRates, address, contactEmail, contactPhone, website } = req.body;
        //recieving all user data (except logo) from the form, in individual inputs, and storing them in variables according to their respective models.

        let logo = ''

        if(req.file){
            logo = req.file.filename //here we are receiving the image file from the form and storing it
        }

        // validations
        if (!name) {
            res.status(422).json({ message: "O nome é obrigatório!" })
            return
        }
        if (!email) {
            res.status(422).json({ message: "O e-mail do usuário é obrigatório!" })
            return
        }
        if (!password) {
            res.status(422).json({ message: "A senha é obrigatória!" })
            return
        }
        if (!confirmpassword) {
            res.status(422).json({ message: "A confirmação de senha é obrigatória!" })
            return
        }
        if (password !== confirmpassword) {
            res.status(422).json({ message: "As senhas precisam ser iguais!" })
            return
        }
        if (!companyName) {
            res.status(422).json({ message: "O nome da empresa é obrigatório!" })
            return
        }
        if (!cnpj) {
            res.status(422).json({ message: "O CNPJ é obrigatório!" })
            return
        }
        if (!serviceRates.maintenance || !serviceRates.creation || !serviceRates.development || !serviceRates.integration || !serviceRates.extra){
            res.status(422).json({ message: "Nenhum valor por hora pode ficar vazio!" })
            return
        }
        if (!address) {
            res.status(422).json({ message: "O endereço é obrigatório!" })
            return
        }
        if (!contactEmail) {
            res.status(422).json({ message: "O e-mail da empresa é obrigatório!" })
            return
        }
        if (!contactPhone) {
            res.status(422).json({ message: "O telefone é obrigatório!" })
            return
        }
        if (!website) {
            res.status(422).json({ message: "O site é obrigatório!" })
            return
        }
        if (!logo) {
            res.status(422).json({ message: "A logo é obrigatória!" })
            return
        }

        // check if user exists
        const userExists = await User.findOne({ email: email })
        if (userExists) {
            res.status(422).json({ message: "Por favor, utilize outro e-mail!" })
            return
        }
        
        // check if cnpj exists
        const cnpjExists = await User.findOne({ cnpj: cnpj })
        if (cnpjExists) {
            res.status(422).json({ message: "Já existe um cadastro com esse CNPJ!" })
            return
        }

        // check if password is strong enough
        const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_@$!%*?&])[A-Za-z\d_@$!%*?&]{8,}$/;
        if (!strongPassword.test(password)) {
            res.status(422).json({ message: "A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial." })
            return
        }

        //TODO: check if email is valid

        //TODO: check if website is valid

        // create a password
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        // create user
        const newUser = new User({
            name,
            email,
            password: passwordHash,
            settings: {
                companyName: companyName,
                cnpj: cnpj,
                serviceRates: {
                    maintenance: serviceRates.maintenance,
                    creation: serviceRates.creation,
                    development: serviceRates.development,
                    integration: serviceRates.integration,
                    extra: serviceRates.extra,
                },
                address: address,
                contactEmail: contactEmail,
                contactPhone: contactPhone,
                website: website,
                logo: logo,
            }
        })

        try {
            await newUser.save()

            await createUserToken(newUser, req, res)
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Erro ao cadastrar usuário!" })
            return
        }
    }

    static async login(req, res) {
        const { email, password } = req.body

        // validations
        if (!email) {
            res.status(422).json({ message: "O e-mail é obrigatório!" })
            return
        }
        if (!password) {
            res.status(422).json({ message: "A senha é obrigatória!" })
            return
        }

        // check if user exists
        const user = await User.findOne({ email: email })
        if (!user) {
            res.status(404).json({ message: "Usuário não encontrado!" })
            return
        }

        // check if password matches
        const checkPassword = await bcrypt.compare(password, user.password)

        if (!checkPassword) {
            res.status(422).json({
                message: "Senha inválida!",
            })
            return
        }

        // create token
        await createUserToken(user, req, res)
    }

    static async getUserSettings(req, res) {
        let currentUser = {}
        let userSettings = {}

        if (req.headers.authorization) {
            const token = getToken(req)
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            currentUser = await User.findById(decoded.id)

            currentUser.password = undefined
            userSettings = currentUser.settings
        } else {
            currentUser = null
            userSettings = null
            res.status(401).json({ message: "Acesso negado!" })
            return
        }
        
        res.status(200).send(userSettings)
        return
    }

    static async updateUserSettings(req, res) {
        const { companyName, cnpj, serviceRates, address, contactEmail, contactPhone, website } = req.body
        const id = req.params.id
        
        let logo = ''
        
        if(req.file){
            logo = req.file.filename //here we are receiving the image file from the form and storing it
        }
        
        const token = getToken(req)

        const user = await getUserByToken(token)

        // check if user exists
        if (!user) {
            res.status(422).json({
                message: "Usuário não encontrado!",
            })
            return
        }

        if (!companyName) {
            res.status(422).json({ message: "O nome da empresa é obrigatório!" })
            return
        }
        if (!cnpj) {
            res.status(422).json({ message: "O CNPJ é obrigatório!" })
            return
        }
        if (!serviceRates.maintenance || !serviceRates.creation || !serviceRates.development || !serviceRates.integration || !serviceRates.extra){
            res.status(422).json({ message: "Nenhum valor por hora pode ficar vazio!" })
            return
        }
        if (!address) {
            res.status(422).json({ message: "O endereço é obrigatório!" })
            return
        }
        if (!contactEmail) {
            res.status(422).json({ message: "O e-mail da empresa é obrigatório!" })
            return
        }
        if (!contactPhone) {
            res.status(422).json({ message: "O telefone é obrigatório!" })
            return
        }
        if (!website) {
            res.status(422).json({ message: "O site é obrigatório!" })
            return
        }
        if (!logo) {
            res.status(422).json({ message: "A logo é obrigatória!" })
            return
        }
        
        const newSettings = {
            companyName: companyName,
            cnpj: cnpj,
            serviceRates: serviceRates,
            address: address,
            contactEmail: contactEmail,
            contactPhone: contactPhone,
            website: website,
            logo: logo,
        }

        user.settings = newSettings

        try {
            const updatedUser = await User.findByIdAndUpdate(
                { _id: user._id },
                { $set: user },
                { new: true }
            )

            res.status(200).json({message: "Dados atualizados com sucesso!", settings: updatedUser.settings})
            return
        } catch (error) {
            res.status(500).json({message: error})
            return
        }
    }
}