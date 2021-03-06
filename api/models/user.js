var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
	name    : String,
	cpf     : String,
	username: String,
	rg      : String,
	email   : String,
	address : String,
	lat     : Number,
	lng     : Number,
	pubkey  : String,
	password: String,
	wallet  : String,
	authid	: String,
	phone	: String,
	verified: String
});

module.exports = mongoose.model("User", userSchema);
