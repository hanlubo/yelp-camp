var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware")

// "/campgrounds" prefix is auto appened to these routes.

// Index Route
router.get("/", function(req, res) {
    console.log(req.user);
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {"campgrounds": allCampgrounds});
        }
    })
    // res.render("campgrounds", {"campgrounds": campgrounds})
});

// RESTful convention
// Create New Campground
router.post("/", middleware.isLoggedIn, function(req, res) {
    // Get data from from and add to campgrounds array
    // console.log("user: " + req.user);
    var newCamground = req.body.campground
    newCamground.author = {
        id: req.user._id,
        username: req.user.username
    };
    
    Campground.create(newCamground, function(err, newlyCreated){
        if (err) {
            console.log(err);
        } else {
            // Redirect back to /campgrounds
            // console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
    // campgrounds.push(newCamground)
    // // Redirect back to /campgrounds
    // res.redirect("/campgrounds");
});

// NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// SHOW
router.get("/:id", function(req, res) {
    // console.log("This will be the same page one day!");
    // Campground.findById(req.params.id, function(err, foundCampground) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
       if(err) {
           console.log(err);
       } else {
        //   console.log("Campground by id: " + foundCampground);
           res.render("campgrounds/show", {campground: foundCampground});
       }
    });
    // console.log("This will be the same page one day!");
    // res.render("show");
})

// EDIT Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    // Is user logged in
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err) {
            res.redirect("back");
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
    // Does user own the campground
})

// Update Campground Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + updatedCampground._id);
        }
    });
})

// Destroy Camground Routere
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    // res.send("DELETE Route");
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    })
})

module.exports = router;
