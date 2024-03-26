// we have to write out all we require, first we need to create a mongoose middleware to link us to the mongodb and then we also need the URl from mongodb to pass to mongoose. remember we saved it at our env file. then after that, we save the mongoose as a function and export it to our express app to require it

const express = require(`express`);
const {connectToMongo} = require(`./mongoose`)
require(`dotenv`).config()

const passport = require(`passport`) // it is used for authentication

const connectEnsureLogin = require(`connect-ensure-login`)
const bodyParser = require(`body-parser`)

//we will also learn to import the usermodel we recently created
const usersModel = require(`./models/users`);
const session= require(`express-session`) //this loads the session for the middleware 

//since we will want to implement the route , so we call the exported module
const jokesRoute = require(`./Routes/jokes`)


const PORT = process.env.PORT

//here, we call the express app
const app = express()
// remember, we also have to call the mongoose function we created
connectToMongo()

//then we have to create the middleware of our express app
app.use(express.json())
//now we want to use session, it helps to store data on the server between requests,so we can access it on subsequent request , now we are storing the authenticated user id for the duration of the sesion

app.use(session({
  secret: process.env.SESSION_SECRETS,
  resave:false,
  saveUninitialized: true,
  cookie:{maxAge: 60 * 60 * 1000}
}))

app.use(bodyParser.urlencoded({
  extended:false
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(`/jokes`,jokesRoute)
//the line below helps us to create a user model using the strategy we created initially

passport.use(usersModel.createStrategy());
//the above helps us to parse our body argument so it is readable
//now we have to serialize and deserialize the user object to and from the session so as when they log in , we can get the object of the log in and out

passport.serializeUser(usersModel.serializeUser());
passport.deserializeUser(usersModel.deserializeUser());


app.set(`views`, `views`);
app.set(`view engine`, `ejs`)


//now we want to secure our login session with connect ensure login...by checking if the user is logged in..protecting the jokes route

app.use(`/jokes`, connectEnsureLogin.ensureLoggedIn(),jokesRoute);


//then we proceed to render our home, log in, and signup page ...here, anyone can access this page

app.get(`/`,(req,res)=>{
  res.render(`index`)
})

app.get(`/login`, (req,res)=>{
  res.render(`login`)
})

app.get(`/signup`, (req,res)=>{
  res.render(`signup`);
})

app.post(`/signup`,(req,res)=>{
  const user =req.body;
  usersModel.register(new usersModel({username: user.username}), user.password, (err,user)=>{
    if(err){
      console.log(err);
      res.render(`signup`,{error:err})
    }
    else{
      passport.authenticate(`local`)(req,res,()=>{
        res.redirect(`/jokes`)
      })
    }
  })
})

//passport mongoose model helps us salt and hash our password and also serialize and deserialize

// this next line should handle request for already existing users

app.post(`/login`, passport.authenticate(`local`,{failureRedirect:`/login`}), (req,res)=>{
  res.redirect(`/jokes`);
})


// this line should handle logout request and it also clears the session like cookies

app.post(`/logout`, (req,res)=>{
  req.logout();
  res.redirect(`/`);
});

// this next line is to catch the errors in the middleware

app.use((err,req,res,next)=>{
  console.log(err);
  res.status(500).send(`something broke`)
})

app.get(`/`, (req,res)=>{
  res.send(`hello michael`)
})








//now we create a listener for our port so we can access the server
app.listen(PORT,()=>{
    console.log(`server is listening on port:${PORT}`)
})


