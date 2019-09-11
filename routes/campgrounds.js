var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

//INDEX - show all campground
router.get("/",function(req,res){
    //Get all campgrounds from DB
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser : req.user});
        }
    })
    
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req,res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username : req.user.username
    }
    var newCampground = {name:name,price:price,image:image,description:description,author:author};
    //Create a new campground and save to DB
    Campground.create(newCampground,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            //redirect back to campground
            res.redirect("/campground");
        }
    });
  

})

//NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
})

//SHOW - shows more info about one campground
router.get("/:id",function (req,res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show",{campground: foundCampground});
        }
    })

});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req,res) {
        //after running checkCampgroundOwnership, next(); will run below argument
        Campground.findById(req.params.id, function (err,foundCampground) {
        res.render("campgrounds/edit",{campground:  foundCampground});      
        })
})

//UPDATE CAMPGROUND ROUTE
router.put("/:id",function (req,res) {
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err,updatedCampground) {
        if(err){
            res.redirect("/campground");
        }else{
            res.redirect("/campground/"+req.params.id);
        }
    })
    //redirect somewhere (show page)
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function (req,res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {

        if(err){
            res.redirect("/campground");
        }else{
            res.redirect("/campground");
        }

      })
})



module.exports = router;
