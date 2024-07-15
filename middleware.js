const Listing=require("./models/listing")
const Review=require("./models/review")
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Please log in to access this feature");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        console.log(res.locals.redirectUrl);
    }
    next();
};
module.exports.isOwner=(req,res,next)=>{
    let {id}=req.params;
    let listing=Listing.findById(id);
    if(!listing.owner._id.equals(res.locals._id)){
        req.flash("you are not the owner");
        res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
  
    try {
      const review = await Review.findById(reviewId);
      
      if (!review || !review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author");
        return res.redirect(`/listings/${id}`);
      }
      
      next();
    } catch (error) {
      req.flash("error", "Something went wrong");
      return res.redirect(`/listings/${id}`);
    }
  };
  