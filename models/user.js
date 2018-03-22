var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	name    : String,
	cpf     : String,
	username: String,
	rg      : String,
	email   : String,
	address : String,
	lat     : Number,
	lng     : Number,
	pubKey  : String,
	pwd     : String
});

userSchema.plugin(passportLocalMongoose);


module.exports = mongoose.model("User", userSchema);