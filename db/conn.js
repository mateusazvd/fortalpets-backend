const mongoose = require('mongoose')

//função async para conexão com o banco de dados 
async function main(){
    await mongoose.connect('mongodb://localhost:27017/fortalPetDev')
    console.log('conectou ao mongoose :)');   
}

main().catch((err)=>{
    console.log(err + 'não foi possivel conectar ao banco :(');
})
module.exports = mongoose