const express = require("express");
const app = express();
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const {isLoggedIn,saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/users.js")

router.route("/signup")
.get(userController.renderSignUp)
.post(wrapAsync(userController.signup))

router.route("/login")
.get(userController.renderLoginForm)
.post( saveRedirectUrl, passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), wrapAsync(userController.login))

//logout
router.get("/logout",userController.logout)
module.exports=router;