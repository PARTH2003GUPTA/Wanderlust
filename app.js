if(process.env.NODE_ENV !="production"){
  require('dotenv').config()
}

console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
app.engine("ejs",ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));
const wrapAsync=require("./utils/wrapAsync.js")
const {listingSchema,reviewSchema}=require("./Schema.js");
const ExpressError = require("./utils/ExpressError.js");
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const { preferences } = require('joi');

const dbUrl=process.env.ATLASDB_URL;
const store= MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*60*60
})
store.on("error",(err)=>{
  console.log(err);
})
app.use(session({
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,// session will expire after 7 days in miliseconds
    httpOnly:true,//to avoid xss attack cross scripting attacks
  }
}));


app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
})
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}



app.get("/", (req, res) => {
  res.redirect("/listings")
});

app.get("/demo",async(req,res)=>{
  const fakeuser=new User({
    email:"abc@gmail.com",
    username:"abc"
  })
  let ans=await User.register(fakeuser,"password");
  res.send(ans);
})
app.use("/listings",listingRouter);
//use mergeparams as id is generally not passed
app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter);


// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });
app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500 ,message} = err;
  res.render("error.ejs",{message});
  // if (!err.message) err.message = "Oh No, Something Went Wrong!";
  // res.status(statusCode).send(err.message);
});
app.listen(3000, () => {
  console.log("server is listening to port 8080");
});
