const express = require(`express`);
const jokesRoute = express.Router();

// since we want to use route now, so we will have to import the model we created earlier

const jokesModel = require(`../models/jokes`);

// since we have imported the model , all we have to do now is to create the route (CRUD) functionality

jokesRoute.get(`/`, (req, res) => {
  //since we are accessing the jokes model, this is where we will use it
  jokesModel
    .find({})
    .then((jokes) => {
      res.status(200);
      res.send(jokes);
    })
    .catch((err) => {
      res.status(500).send({
        message: `an error occured`,
        data: err.message,
      });
    });
});


jokesRoute.post(`/`, (req,res)=>{
    const joke = req.body

    jokesModel.create(joke).then(()=>{
        res.status(201).send({
            message:`the joke has been created successfully`,
            data: data
        })
    }).catch((err)=>{
         res.status(401).send({
            message:`an error occured while creating the joke`,
            data:err.message
         })
    })

})

// to export this route function to use, we will export the name of the route file

module.exports = jokesRoute;
