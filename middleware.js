const Listing = require("./models/listing.js");
const ExpressError = require("./utils/expressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Login First to perform the opration");
    return res.redirect("/login");
  }

  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  const listing = await Listing.findById(`${id}`);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You Are Not The Owner Of this Listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//joi middleware function for Listing
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    return next(new ExpressError(400, error));
  } else {
    next();
  }
};

//joi middleware function for review
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    return next(new ExpressError(400, error));
  } else {
    next();
  }
};

module.exports.isReviewOwner = async (req, res, next) => {
  let { id, reviewId } = req.params;
  const review = await Review.findById(`${reviewId}`);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You Are Not The Owner Of this Review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
