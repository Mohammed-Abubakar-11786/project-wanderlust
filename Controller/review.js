const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.addReviews = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = res.locals.currUser;
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  req.flash("success", "Review Saved");
  res.redirect(`/listings/${listing.id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.updateOne({ _id: id }, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${id}`);
};
