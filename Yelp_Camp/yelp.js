var express = require("express");
var app = express();
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var seedDB=require("./seeds");
var flash=require("connect-flash");
var Comment=require("./models/comment");
var passport = require("passport");
var method_override = require("method-override");
var passport_local = require("passport-local");
var passport_local_mongoose = require("passport-local-mongoose");
var User = require("./models/user");
app.use(express.static(__dirname+"/public"));
app.use(method_override("_method"));
app.use(flash());
app.use(require("express-session")({
    secret:"This is a secret page..",
    cookie:{maxAge:60000},
    resave:false,
    saveUninitialized:false
}));

//Here we need to give current user to every route because of the if statement..
//so locals will provide current_user to every template...
//this is a middleware...
app.use(function (req,res,next) {
    res.locals.current_user=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});

seedDB();//seed the database...

//passport configurations...
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passport_local(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.set("view engine","ejs");
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyparser.urlencoded({extended:true}));

var Campground = require("./models/campground");

app.get("/",function (req,res) {
    res.render("landing");
});

app.get("/campground",function (req,res) {
    console.log(req.user);
    Campground.find({},function (err,allcamp) {
        if(err){
            console.log(err);
        }else{
            res.render("index",{camps:allcamp,current_user:req.user});
        }

    });
    // if we have it from the array..
   //res.render("campgrounds",{camps:campgrounds});
});
app.get("/campground/new",isLoggedIn,function (req,res) {
    res.render("new",{current_user:req.user});
});
app.post("/campground",function (req,res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var author={
        id:req.user._id,
        username:req.user.username
    };

    var newcamp = {name:name,image:image,description:desc,author:author,price:price};

    //create a new campground and add to the database
    Campground.create(newcamp,function (err,newaddcamp) {
        if(err){
            console.log(err);
        }else{
            console.log(newaddcamp);
            res.redirect("/campground");
        }
    });
    //We have 2 campgrounds but in redirect it is by-default to the get method...
});

app.get("/campground/:id",function (req,res) {
    //find template of the related id
    // then show the description of that particular id in show page
    Campground.findById(req.params.id).populate("comments").exec(function (err,found){

       if(err){
           console.log(err);
       } else{
           res.render("show",{campground:found,current_user:req.user});
       }

    });

});
app.get("/campground/:id/comments/new",isLoggedIn,function (req,res) {
   Campground.findById(req.params.id,function (err,campground) {
       if(err){
            console.log(err);
       }else{
           res.render("new_comment",{campground:campground,current_user:req.user});
       }
   });
});
app.post("/campground/:id/comments",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function (err,campground) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            console.log(req.body.comment);
            Comment.create(req.body.comment,function (err,comment) {
                if(err){
                    req.flash("error","Something went wrong...");
                    console.log(err);
                }
                else{
                    //add username and id to the campground..
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    //save comment...
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","Successfully Added Comment");
                    res.redirect("/campground/"+campground._id);
                }
            });
        }
    });
});
//show register form..
app.get("/register",function (req,res) {
   res.render("register")
});

app.post("/register",function (req,res) {
    var new_user =new User({username:req.body.username});
    User.register(new_user,req.body.password,function (err,user) {
        if(err){
            req.flash("error",err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function () {
            req.flash("success","Welcome to YelpCamp "+user.username);
            res.redirect("/campground");

        });
    });

});

//Login route..
app.get("/login",function (req,res) {
   res.render("login");
});


app.post("/login",passport.authenticate("local",
    {
            successRedirect:"/campground",
            failureRedirect:"/login"
    }),function (req,res) {

});

app.get("/logout",function (req,res) {
   req.logout();
   req.flash("success","Logged You out !");
   res.redirect("/");
});
//Creating a middleware function....
function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login First !");
    res.redirect("/login");
}
function check_current_user(req,res,next) {

    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundcampground) {
            if (err) {
                res.redirect("/campground");
            } else {
                if (foundcampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error","You need to be logged in first with your account..");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error","You need to be logged in first...");
        res.redirect("back");
    }

}


//editing and deleting.....
app.get("/campground/:id/edit",check_current_user,function (req,res) {
    //check if user is logged in or not
    Campground.findById(req.params.id, function (err, foundcampground) {
        if (err) {
            console.log(err);
        } else {
            res.render("edit", {campground: foundcampground});
        }
    });
});

    app.put("/campground/:id",check_current_user,function (req, res) {
        //find and update the correct campground..
        //redirect to the show page..
        Campground.findByIdAndUpdate(req.params.id, req.body.cc, function (err, updated) {
            if (err) {
                res.redirect("/campground");
            } else {
                res.redirect("/campground/" + req.params.id);
            }
        });
    });


    app.delete("/campground/:id",check_current_user,function (req, res) {
        Campground.findByIdAndRemove(req.params.id, function (err) {
            if (err) {
                res.redirect("/campground");
            }
            else {
                res.redirect("/campground");
            }
        });
    });

    app.get("/campground/:id/comments/:comment_id/edit",my_comment,function (req,res) {
        Comment.findById(req.params.comment_id,function (err,foundcomment) {
            if(err){
                res.redirect("back");
            }else{
                res.render("comment_edit",{campground_id:req.params.id,comment:foundcomment,current_user:req.user});
            }

        });

    });

    app.put("/campground/:id/comments/:comment_id",function (req,res) {
            Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function (err,updatedcomment) {
                if(err){
                    res.redirect("back");
                }else{
                    res.redirect("/campground/"+req.params.id);
                }

            });
    });
    app.delete("/campground/:id/comments/:comment_id",my_comment,function (req,res) {
       Comment.findByIdAndRemove(req.params.comment_id,function (err,removedcomment) {
            if(err){
                res.redirect("back");
            }else{
                req.flash("success","Successfully Deleted...");
                res.redirect("/campground/"+req.params.id);
            }

       });
    });

//Comment authorization......
function my_comment(req,res,next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function (err,foundcomment) {
           if(err){
               res.redirect("back");
           } else{
               if(foundcomment.author.id.equals(req.user._id)){
                   next();
               }else{
                   res.redirect("back");
               }
           }
        });
    }else{
        res.redirect("back");
    }
}

app.listen(3000, function () {
        console.log("Server is responding..");
    });
