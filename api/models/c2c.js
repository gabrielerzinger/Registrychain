var mongoose = require("mongoose");

var C2CSchema = new mongoose.Schema({
	hirer: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	hired: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	description: { type: String }
});

module.exports = mongoose.model("C2C", C2CSchema);
