const express = require("express");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { reviewSchema } = require("../Schema.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn, isAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");
const router = express.Router({ mergeParams: true }); // Ensure params are merged from the parent router

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    return next(new ExpressError(msg, 400));
  } else {
    next();
  }
};

// Post review
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete review
router.delete("/:reviewId",isLoggedIn,isAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
