const User = require("../models/user");

module.exports.renderSignupPage = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signupUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ email, username });
    let registerdUser = await User.register(newUser, password);
    req.login(registerdUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash(
        "success",
        `Welcome 🫡 ${req.user.username} You Are SignedUp and Logged In 😀`
      );
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginPage = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.loginUser = async (req, res) => {
  req.flash("success", `Welcome 🫡 ${req.user.username} You Are Logged In 😀`);
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
  let username = req.user.username;
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash(
      "success",
      `You Logged Out!! Bye 👋👋 ${username} 😊 See You Soon`
    );
    res.redirect("/listings");
  });
};
