var express = require("express");
var bodyparser = require("body-parser");
var mongoose = require("mongoose");
var app = express();
//var sanitizer = require("express-sanitizer");
var methodoverride = require("method-override");
app.use(methodoverride("_method"));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended : true}));
//app.use(sanitizer);
mongoose.connect("mongodb://localhost/restful_blog_app");

var blogschema = mongoose.Schema({
    title : String,
    image : String,
    body : String,
    created : {type:Date,default : Date.now}
});

var Blog = mongoose.model("Blog",blogschema);

app.get("/",function (req,res) {
    res.redirect("/blogs");
});

app.get("/blogs/new",function (req,res) {
   res.render("new");
});

app.post("/blogs",function (req,res) {
    //req.body.Blogs.body=req.sanitize(req.body.Blogs.body);
    Blog.create(req.body.Blogs,function (err,blog) {
           if(err){
               res.render("new");
           }else{
               res.redirect("/blogs");
           }
    });
});

app.get("/blogs/:id",function (req,res) {
        Blog.findById(req.params.id,function (err,blog) {
           if(err){
               res.redirect("/blogs");
           } else{
               res.render("show",{blog:blog});
           }
        });
});


app.get("/blogs",function (req,res) {
    Blog.find({},function (err,blog) {
        if(err){
            console.log(err);
        }else{
            console.log(blog);
            res.render("index",{blogs:blog});
        }
    });
});

//Linking of new and show because in edit we need to display the content if we dont do so then we are just adding stuff not editing...
app.get("/blogs/:id/edit",function (req,res) {
    Blog.findById(req.params.id,function (err,foundblog) {
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit",{blog:foundblog});
        }
    });
});

//html does not support put request presently they only support get and post request...
app.put("/blogs/:id",function (req,res) {
   Blog.findByIdAndUpdate(req.params.id,req.body.Blogs,function (err,update_blog) {
       if(err){
           res.redirect("/blogs");
           console.log(err);
       }else{
          res.redirect("/blogs/"+req.params.id);
       }
   });
});

//Delete route..
app.delete("/blogs/:id",function (req,res) {
        Blog.findByIdAndRemove(req.params.id,function(err){
           if(err){
               res.redirect("/blogs");
           } else{
               res.redirect("/blogs");
           }
        });
});


app.listen(3000,function () {
   console.log("Server is responding");
});