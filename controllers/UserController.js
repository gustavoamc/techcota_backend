const User = require('../models/User');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = class UserController {
    static async register(req, res) {
        const { name, email, password, confirmpassword, cnpj, serviceRates, address, contactEmail, contactPhone, website, logo } = req.body;
        //recieving all user data from the form, in individual inputs, and storing them in variables according to their respective models.

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

        // create a password
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        // create user
        const user = new User({
            name,
            email,
            password: passwordHash,
            settings: {
                companyName: name,
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
            await user.save()

            res.status(201).json({ message: "Usuário cadastrado com sucesso!" }) //FIXME: remove this line after createUserToken is implemented
            //await createUserToken(newUser, req, res) //TODO: create user token
        } catch (error) {
            res.status(500).json({ message: "Erro ao cadastrar usuário!" })
        }
    }
}