const jwt = require('jsonwebtoken')
const getToken = require('./get-token')

//middleware para validar o token 
const checkToken = (req,res,next)=>{
    //caso nao venha nada no authorization
    if(!req.headers.authorization){
        return res.status(401).json({message:'Acesso Negado'})
    }
    //caso o token não seja enviado ou seja invalido
    const token = getToken(req)
    if(!token){
        return res.status(401).json({message:'Acesso Negado'})
    }

    try {
        const verified = jwt.verify(token,"jwtsecretedaaplicação")
        req.user = verified
        next()
    } catch (error) {
        return res.status(400).json({message:'Token inválido'})

    }
}


module.exports = checkToken