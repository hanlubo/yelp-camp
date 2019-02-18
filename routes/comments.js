var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware")

// Comments New
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
       if (err) {
           console.log(err);
       } else {
           res.render("comments/new", {campground: campground});
       }
    });
})

// Comments Create
router.post("/", middleware.isLoggedIn, function(req, res) {
    // lookup campground using ID
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            console.log(req.body.comment);
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    req.flash("error", "Something went wrong!");
                    console.log(err);
                } else {
                    // add req.user.username and id to comment
                    // save comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    // add new comment to campground
                    // save campground
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
    // create new comment
    // connect new commnet to campground
    // redirect campground show page
})

// Comment Edit Route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    // res.send("comment/edit")
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id : req.params.id, comment: foundComment});
        }
    })
});

// Comment Update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    // res.send("comment update");
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
       if (err) {
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
       }
   })
});

// Comment Destroy
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment removed.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
})


module.exports = router;