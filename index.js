const express = require("express")
const app = express()

const PORT = process.env.PORT

require('dotenv').config();

require('./db_connections/conn.js')

//schema;
const users = require("./schema/personal_detail.js")

//middlwares
app.use(express.json());

app.get('/',(req,res)=>{
    res.send ("port is running")
})

app.get('/users',(req,res)=>{


})

app.listen(PORT, ()=>{
    console.log('port is running')
})