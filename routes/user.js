const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../Controller/user.js");

//to signup
router
  .route("/signup")
  .get(userController.renderSignupPage)
  .post(wrapAsync(userController.signupUser));

//to login
router
  .route("/login")
  .get(userController.renderLoginPage)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.loginUser
  );

//to logout
router.get("/logout", userController.logoutUser);

module.exports = router;
