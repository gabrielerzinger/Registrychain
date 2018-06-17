var mongoose = require("mongoose");

var CEVSchema = new mongoose.Schema({
	buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	buyerOk : { type: Boolean },
	sellerOk: { type: Boolean },
	xrpOk   : { type: Boolean, default : false},
	item   : { type: String },
	value  : { type: Number},
	paymentMethod : { type: String },
	description: { type: String },
	status: { type: String },
	celebrationDate: { type: String }
});
//Description should be things like date, place, etc
module.exports = mongoose.model("CEV", CEVSchema);
