var mongoose = require("mongoose");
var Campground =require("./models/campground");
var Comment = require("./models/comment");
var data = [
        {
            name :"Cloud's Rest",
            image :"https://www.backpacker.com/.image/c_fit%2Ccs_srgb%2Ch_406%2Cq_50%2Cw_620/MTQ0OTE0MjA0MTk5MTY3NTUz/half-dome-and-the-valley.jpg",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        },
        {
            name :"Desert's Best",
            image :"http://sahara-desert-dream.com/wp-content/uploads/2015/04/desert-dream-4.jpg",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        },
        {
            name :"Ocean view",
            image :"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Clouds_over_the_Atlantic_Ocean.jpg/1200px-Clouds_over_the_Atlantic_Ocean.jpg",
            description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
        }

    ];

function seedDB() {
    //Remove all campgrounds...
      Campground.remove({},function (err) {
        // if(err){
        //     console.log(err);
        // }else {
        //     console.log("removed Campgrounds");
        //     data.forEach(function (seed) {
        //         Campground.create(seed,function (err,data) {
        //             if(err){
        //                 console.log(err);
        //             }else{
        //                 console.log("Added campgrounds");
        //                 //create a comment on each campground.....
        //                 Comment.create({
        //                     text:"",
        //                     author : ""
        //                 },function (err,comment) {
        //                     if(err){
        //                         console.log(err);
        //                     }else{
        //                         data.comments.push(comment);
        //                         data.save();
        //                         console.log("Created new comment....");
        //                     }
        //                 });
        //             }
        //
        //         });
        //     });
        // }
    });
}
module.exports=seedDB;
