var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

// Root Route
router.get("/", function(req, res) {
    res.render("landing");
});

// AUTH ROUTES

// Show register form
router.get("/register", function(req, res) {
    res.render("register");
})

// Handle sign up logic
router.post("/register", function(req, res) {
    // res.send("sign up");
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/register");
        } else {
            req.flash("success", "Welcome to YelpCamp " + user.username);
            passport.authenticate("local")(req, res, function(){
                res.redirect("/campgrounds");
            })
        }
    })
})

// Show login form
router.get("/login", function(req, res) {
    res.render("login");
})

// Hanlding login logic
// app.post("/login", middleware, callback)
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        
    }),
    function(req, res) {
        res.send("LOGIN");
    }
)

// Logout logic
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You Logged Out.")
    res.redirect("/campgrounds");
})

// Is Logged In
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;