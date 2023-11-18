const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../Controller/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//index route // insert route
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createNewListing)
  );

//create route -> should be written Compulsory before show route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//show route // update in db //delete route
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

//edit route
router.get(
  "/:id/Edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

//filter route
router.post("/filter", wrapAsync(listingController.filterListing));

router.post("/find", wrapAsync(listingController.findListings));
module.exports = router;
