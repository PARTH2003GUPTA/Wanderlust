const Listing=require("../models/listing");
const Review=require("../models/review");
module.exports.createReview=async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      throw new ExpressError("Listing not found", 404);
    }
    
    const newReview = new Review(req.body.review); // Ensure req.body.review matches the form fields
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","added review");
    res.redirect(`/listings/${id}`);
  }
  module.exports.destroyReview=async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","deleted review");
    res.redirect(`/listings/${id}`);
  }