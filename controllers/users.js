const User=require("../models/user")
module.exports.renderSignUp=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const user1=new User({
            email:email,
            username:username,
        });
        const registereduser=await User.register(user1,password);
        console.log(registereduser);
        req.login(registereduser,(err)=>{
            if(err){
                return next(err);
            }
            else{
                req.flash("success","welcome to wanderlust");
                res.redirect("/listings");
            }
        })

    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
}
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}
module.exports.login=async (req, res) => {
    req.flash("success", "Welcome to Wanderlust");
    console.log(res.locals.redirectUrl);
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
    delete req.session.redirectUrl;  // Cleanup after redirection
}
module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        else{
            req.flash("success","logged out successfully");
            res.redirect("/listings");
        }
    })
}