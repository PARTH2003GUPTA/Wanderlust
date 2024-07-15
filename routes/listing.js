const express = require("express");
const Listing = require("../models/listing.js");
const wrapAsync=require("../utils/wrapAsync.js")
const {listingSchema,reviewSchema}=require("../Schema.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn}=require("../middleware.js");
const listingController=require("../controllers/listings.js")
const router=express.Router();
const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const { comments } = require("moongose/models/index.js");
const upload = multer({ storage})

const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
      throw new ExpressError(400,error);
    }
    else{
      next();
    }
  }

router.route("/")
 .get( wrapAsync(listingController.index))//Index Route
 .post(isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing));//create route


  //New Route
router.get("/new",isLoggedIn, wrapAsync(listingController.renderNewForm));
router.route("/:id")
  //Show Route
  .get(wrapAsync( listingController.showListing))
   //Update Route
   .put(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync( listingController.updateListing))
    //delete route
   .delete( isLoggedIn,wrapAsync(listingController.destroyListing));
 
  //Edit Route
  router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.renderEditForm));

  module.exports=router;