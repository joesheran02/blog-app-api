const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const { blogmodel } = require("./Models/blog")
const jwt = require("jsonwebtoken")

const app = express()
app.use(cors())
app.use(express.json())

const encryptPass = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

mongoose.connect("mongodb+srv://joesheran:jjs2002j@cluster0.yf75nyn.mongodb.net/blogDB?retryWrites=true&w=majority&appName=Cluster0")

app.post("/signIn", (request, response) => {
    let input = request.body
    blogmodel.find({ "email": request.body.email }).then(
        (data) => {
            if (data.length > 0) {
                let dbPassword = data[0].password
                // console.log(dbPassword)
                bcrypt.compare(input.password, dbPassword, (error, isMatch) => {
                    if (isMatch) {
                        jwt.sign({ email: input.email }, "blog-app", { expiresIn: "1d" }, (error, token) => {
                            if (error) {
                                response.json({ "status": "Unable to create Token" })
                            } else {
                                response.json({ "status": "Success", "user ID": data[0]._id, "token": token })
                            }
                        })
                    } else {
                        response.json({ "status": "incorrect password" })
                    }
                })
            } else {
                response.json({ "status": "User Not Found !!!" })
            }
        }
    ).catch()
})


app.post("/signUp", async (request, response) => {
    let input = request.body
    let hashedpass = await encryptPass(input.password)
    console.log(hashedpass)
    input.password = hashedpass
    let blog = new blogmodel(input)
    blog.save()
    response.json({ "status": "success" })
})

app.listen(8080, () => {
    console.log("Server is Running")
})