const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

const port = 4000

const app = express();

app.use(express.urlencoded({extended:true}))


//Database
mongoose.connect('mongodb://127.0.0.1:27017/Blood_Donation')
const db = mongoose.connection
db.once('open', ()=>{
    console.log("Mongodb Connectd Successfully")
})

//Schema
//userloginSchema
const loginSchema = mongoose.Schema({
    email: {type:String, required: true},
    password: {type:String, required: true},
    createdAt: { type: Date, default: Date.now() },
})
const auth = mongoose.model("Auth", loginSchema);

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname,'./login.html'))
})

//Post requests
app.post('/post',async(req,res)=>({
    
    const user = new User({

        email,
        password
    })
    await user.save() 
    console.log(user)
    res.send("Form submission successfull")
})



app.listen(port,()=>{
    console.log("Server Started")
})
