const mongoose = require("mongoose")
const schema = mongoose.Schema({
    "name":String,
    "email":String,
    "password":String
})
let blogmodel = mongoose.model("blogs",schema)
module.exports={blogmodel}
