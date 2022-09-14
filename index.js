const express = require('express')
const cors = require('cors')
const UserRoutes = require('./routes/UserRoutes')
const app = express()

//config de resposta json
app.use(express.json())
//cors
app.use(cors({credentials:true,origin:'http://localhost:3000'}))

//pasta publica para imagens
app.use(express.static('public'))

//Routes
app.use('/users', UserRoutes)



app.listen(5000)
