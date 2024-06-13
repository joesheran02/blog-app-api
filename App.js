const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const {blogmodel} = require("./Models/blog")

const app = express()
app.use(cors())
app.use(express.json())

const encryptPass = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password,salt)
}

mongoose.connect("mongodb+srv://joesheran:jjs2002j@cluster0.yf75nyn.mongodb.net/blogDB?retryWrites=true&w=majority&appName=Cluster0")

app.post("/signUp", async (request,response) => {
    let input = request.body
    let hashedpass = await encryptPass(input.password)
    console.log(hashedpass)
    input.password = hashedpass
    let blog = new blogmodel(input)
    blog.save()
    response.json({"status":"success"})
})

app.listen(8080,()=>{
    console.log("Server is Running")
})