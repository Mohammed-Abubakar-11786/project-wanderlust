const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createNewListing = async (req, res, next) => {
  // let response = await geocodingClient
  //   .forwardGeocode({
  //     query: req.body.listing.location,
  //     limit: 1,
  //   })
  //   .send();

  let url = req.file.path;
  let filename = req.file.filename;

  let list = new Listing(req.body.listing);
  list.owner = req.user._id;
  list.image = {
    url: url,
    filename: filename,
  };
  // list.geometry = response.body.features[0].geometry;
  await list.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(`${id}`)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you are searching do not exist");
    res.redirect("/listings");
  } else res.render("listings/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(`${id}`);
  let originalUrl = listing.image.url;
  let alterdUrl = originalUrl.replace("/upload", "/upload/w_250");
  if (!listing) {
    req.flash("error", "Listing you are searching do not exist");
    res.redirect("/listings");
  } else res.render("listings/update.ejs", { listing, alterdUrl });
};

module.exports.updateListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(`${id}`, req.body.listing);

  if (typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {
      url,
      filename,
    };
  }

  listing.geometry = response.body.features[0].geometry;
  await listing.save();
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(`${id}`);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};

// Import necessary modules and define wrapAsync if needed

module.exports.filterListing = async (req, res) => {
  res.header("Content-Type", "application/json");
  let { iconId } = req.body;
  const allListings = await Listing.find({ category: iconId });
  if (allListings.length > 0) res.render("listings/index.ejs", { allListings });
  else res.send("No Listings !!!");
};

module.exports.findListings = async (req, res) => {
  let { location } = req.body;
  let allListings = await Listing.find({ location: `${location}` });
  res.render("listings/index.ejs", { allListings });
};
