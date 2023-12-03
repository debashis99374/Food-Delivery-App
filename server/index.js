require("dotenv").config()
require("./db.js")
const express=require('express')
const app=express()
const helmet=require("helmet")
const cors=require("cors")

app.use(cors())
app.use(express.json())
app.use(helmet())


app.get('/',(req,res)=>{
    res.send("hello express")
})
app.listen(5000, () => {
    console.log('server started');
  }); 
