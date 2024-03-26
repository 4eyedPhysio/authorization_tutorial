const mongoose = require(`mongoose`)
require(`dotenv`).config();

const URL = process.env.mongodb_URL


function connectToMongo (){

    mongoose.connect(URL)
    .then(()=>{
        console.log(`connected to the database successfully`)
    }).catch((err)=>{
       console.error(`error connecting to the database,`,err);
    })

// mongoose.connection.on(`connected`,()=>{
//     console.log(`connected to the database successfully`)
// })

mongoose.connection.on(`error`,(err)=>{
    console.log(err)
    console.log(`there was an error connecting to the database`)
})

}

module.exports = {connectToMongo}