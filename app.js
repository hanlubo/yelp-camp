var express   = require("express"),
    bodyParse = require("body-parser"),
    mongoose  = require("mongoose"),
    flash     = require("connect-flash"),
    passport  = require("passport"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds"),
    app = express();

var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");


// mongoose.connect("mongodb://localhost:27017/yelp_camp_final", {useNewUrlParser: true});
// mongoose.connect("mongodb+srv://lubo:han@yelpcamp-wtgyq.mongodb.net/test?retryWrites=true", {useNewUrlParser: true});
// console.log(process.env.DATABASEURL);
mongoose.connect(process.env.DATABASEURL, {useNewUrlParser: true});


app.use(bodyParse.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDB();  // Seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins",
    resave: false,
    saveUninitialize: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server has started.");
})