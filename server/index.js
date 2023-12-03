require("dotenv").config()
require("./db.js")
const express=require('express')
const app=express()
const helmet=require("helmet")
const cors=require("cors")
const authRouter = require("./routes/auth.routes.js")
const userRouter = require("./routes/user.router.js")
const adminRouter = require("./routes/admin-routes.js")

app.use(cors())
app.use(express.json())
app.use(helmet())
app.use('/',authRouter)
app.use('/',userRouter)
app.use('/',adminRouter)


app.get('/',(req,res)=>{
    res.send("hello express")
})
app.listen(5000, () => {
    console.log('server started');
  }); 
