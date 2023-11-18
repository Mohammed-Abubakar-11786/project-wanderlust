const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const reviewController = require("../Controller/review.js");

const {
  validateReview,
  isLoggedIn,
  isReviewOwner,
} = require("../middleware.js");

//add reviews in db
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.addReviews)
);

//delete review -> route
router
  .route("/:reviewId")
  .delete(isLoggedIn, isReviewOwner, wrapAsync(reviewController.destroyReview));

module.exports = router;
