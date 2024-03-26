const mongoose = require(`mongoose`)

const jokes_schema = mongoose.Schema

// since we have set up the schema, now we proceed to define the schema of the mongodb database by creating a new instance of the schema
const jokesModel = new jokes_schema({
    Comedian:{
        type: String,
        require: true
    },
    Age:{
        type:Number,
        require: true
    },
    Industry_Name:{
        type: String,
        require:true
    },
    Years_in_Industry:{
        type: Number,
        require:true,
        min:[10 ,`years must not be less than 10years`]
    },
    Created_at:{
        type: Date,
        default: Date.now()
    },
    Updated_at:{
        type: Date,
        default: Date.now()
    }
})

module.exports= mongoose.model(`jokes`,jokesModel);