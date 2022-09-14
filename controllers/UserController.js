const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
module.exports = class UserController{

    static async register(req,res){
        //modelo de desestruturação de dados vindo de req.body
        const {name,email,phone,password, confirmpassword} = req.body
        
        //validações 
        if(!name){
            res.status(400).json({message:"O nome é obrigatório"})
            return
        }
        if(!email){
            res.status(400).json({message:"O email é obrigatório"})
            return
        }
        if(!phone){
            res.status(400).json({message:"O Telefone para contato é obrigatório"})
            return
        }
        if(!password){
            res.status(400).json({message:"A senha é obrigatória"})
            return
        }
        if(!confirmpassword){
            res.status(400).json({message:"A confirmação de senha nome é obrigatória"})
            return
        }
        if(password !== confirmpassword){
            res.status(400).json({message:"A Senha e a confirmação de senha precisam ser iguais"})
            return
        }

        //checar se existe um usuário igual 
        const userExists = await User.findOne({email:email})
        if(userExists){
            res.status(400).json({message:"Este Email já foi cadastrado! ultilize outro Email"})
            return
        }

        //criar uma senha segura
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password,salt)

        //criar um usuário no banco
        const user = new User({
            name,
            email,
            phone,
            password: passwordHash,
        })
        try {
            const newUser = await user.save() //salvando o usuário
            await createUserToken(newUser,req,res)
        } catch (error) {
            res.status(500).json({message:error})
            console.log(error);
        }
        
        
    }

    static async login(req,res){
        const {email,password} = req.body
        

        //validações
        if(!email){
            res.status(400).json({message:"O Email é obrigatório"})
            return
        }
        if(!password){
            res.status(400).json({message:"A senha é obrigatória"})
            return
        }

        //checar se o usuário existe 
        const user = await User.findOne({email:email})
        if(!user){
            res.status(400).json({message:"Não há usuário cadastrado com esse email"})
            return
        }

        // checar se a senha está correta
        const checkPassword = await bcrypt.compare(password,user.password)
        if(!checkPassword){
            res.status(400).json({message:"Senha incorreta"})
            return
        }
        //finalizar ciclo enviando jwt autenticado
        await createUserToken(user,req,res)

    }

    static async checkUser(req,res){

        let currentUser
        if(req.headers.authorization){

            const token = getToken(req)
            const decoded = jwt.verify(token,"jwtsecretedaaplicação")
            currentUser = await User.findById(decoded.id)
            currentUser.password = undefined

        }else{
            currentUser = null
        }

        res.status(200).send(currentUser)

    }

    static async getUserById(req,res){
        const id = req.params.id
        const user = await User.findById(id).select('-password')

        if(!user){
            res.status(400).json({
                message:"Usuário não encontrado"
            })
            return
        }
        res.status(200).json({user})

    }

    static async editUser(req,res){
        const id = req.params.id
        const{name,email,phone,password,confirmpassword} = req.body

        let image = ''

        const user = await User.findById(id)
        
        //checar se o email é diferente e se for checar se ele existe
        const userExists = await User.findOne({email:email})
        if(user.email !== email && userExists){
            es.status(400).json({message:"Esse email ja está em uso"})
            return
        }

        //validações
        if(!name){
            res.status(400).json({message:"O nome é obrigatório"})
            return
        }
        if(!email){
            res.status(400).json({message:"O email é obrigatório"})
            return
        }
        if(!phone){
            res.status(400).json({message:"O Telefone para contato é obrigatório"})
            return
        }
        if(!password){
            res.status(400).json({message:"A senha é obrigatória"})
            return
        }
        if(!confirmpassword){
            res.status(400).json({message:"A confirmação de senha nome é obrigatória"})
            return
        }
        if(password !== confirmpassword){
            res.status(400).json({message:"A Senha e a confirmação de senha precisam ser iguais"})
            return
        }

        if(!user){
            req.status(400).json({
                message:"Usuário não encontrado"
            }
            )
        }
    }
}