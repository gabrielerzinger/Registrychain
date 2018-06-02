var mongoose = require("mongoose");

var CEVSchema = new mongoose.Schema({
	buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	firstOk : { type: Boolean },
	secondOk: { type: Boolean },
	item   : { type: String },
	value  : { type: Number},
	payMethod : { type: String },
	description: { type: String },
	status: { type: String }
});
//Description should be things like date, place, etc
module.exports = mongoose.model("CEV", CEVSchema);
