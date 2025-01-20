const express=require("express")
const {config}=require("dotenv")
config({path:"./config.env"})
require('./connection')
const userRouter=require('./routers/user')
const bodyParser=require("body-parser")
const passport=require('./controllers/auth')
const app=express()
const cors=require('cors')
app.use(
    cors({
      origin: "http://localhost:5173", // Allow requests from this origin
      methods: "GET,POST,PUT,DELETE", // Specify allowed methods
      allowedHeaders: "Content-Type,Authorization", // Specify allowed headers
      credentials: true, // Enable cookies and credentials if needed
    }))


app.use(bodyParser.json())
app.get('/',(req,res)=>{
    res.send("Hello From Server...!")
})
app.use(passport.initialize())
app.use('/',userRouter)

app.listen(process.env.PORT,(req,res)=>{
    console.log(`The Server is Started at http://localhost:${process.env.PORT}`)
})