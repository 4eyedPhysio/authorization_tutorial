const mongoose = require(`mongoose`)
const passportLocalMongoose =require(`passport-local-mongoose`)

//create a new schema for the users
const usersModel = new mongoose.Schema({
   username: String,
   password: String
})

usersModel.plugin(passportLocalMongoose)

module.exports= mongoose.model(`users`,usersModel)