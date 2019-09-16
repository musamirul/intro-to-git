var express     =   require("express");
var app         =   express();
var bodyParser  =   require("body-parser");
var mongoose    =   require("mongoose");
var flash       =   require("connect-flash");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDb = require("./seeds");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var User = require("./models/user");

//requiring routes
var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

console.log(process.env.DATABASEURL);

//seedDb(); //seed the database
//mongoose.connect("mongodb://localhost/yelp_camp_ver12", { useNewUrlParser: true });
mongoose.connect("mongodb+srv://musamirul:cancer30!@cluster0-yus07.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useCreateIndex: true })


app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());

//Directory
//console.log(__dirname);
//test
// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret : "Once again Ruty wins cutes dogs",
    resave:false,
    saveUninitialized :false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//to show or unshow login register logout link
app.use(function (req,res,next) {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");    
    res.locals.currentUser = req.user;
    next();
})


// Campground.create(
//     {
//         name:"Granite Hill",
//         image:"https://images.unsplash.com/photo-1563985620567-9ad06c0f7308?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//         description:"This a huge granate hill no bathroom no water"
//     },function(err,campground){
//         if(err){
//             console.log(err);
//         }else{
//             console.log("newly created campground")
//             console.log(campground);
//         }
//     });

app.use(indexRoutes);
app.use("/campground/:id/comments",commentRoutes);
app.use("/campground",campgroundRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function(){

    console.log("server is listening...");
  
  });
// app.listen(3000,function(){
//     console.log("server has started");
// });