var mongoose = require("mongoose");
var passport_local_mongoose = require("passport-local-mongoose");

var usersch = new mongoose.Schema({
    username:String,
    password : String
});
//plugin is necessary to add to the user schema....
usersch.plugin(passport_local_mongoose);
module.exports=mongoose.model("User",usersch);
