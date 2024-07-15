const Listing=require("../models/listing");
//index route
module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }
  //New Route
  module.exports.renderNewForm=async(req, res) => {
    if(req.isAuthenticated()){
    res.render("listings/new.ejs");
    }
    else{
      req.flash("error","please login to acess this feature");
      res.redirect("/login");
    }
  }

  module.exports.showListing = async (req, res, next) => {
    try {
      let { id } = req.params;
      const listing = await Listing.findById(id)
        .populate({
          path: "reviews",
          populate: { path: "author" } // Corrected nested populate syntax
        })
        .populate("owner");
      
      if (!listing) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
      }
      
      res.render("listings/show.ejs", { listing, currUser: req.user });
      
    } catch (error) {
      next(error);
    }
  };
  
  module.exports.createListing=async (req, res, next) => {
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();
    req.flash("success","added listings");
    res.redirect("/listings");
  }

  module.exports.renderEditForm= async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","listing does not exist");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  }
  module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    // check if new image is added or not
    if(typeof req.file !== 'undefined'){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("success","updated listings");
    res.redirect(`/listings/${id}`);
  }
  module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","deleted listings");
    res.redirect("/listings");
  }