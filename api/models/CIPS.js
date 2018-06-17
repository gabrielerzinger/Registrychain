var mongoose = require("mongoose");

var CIPSSchema = new mongoose.Schema({
	songOwner       : { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	song 		   : {
		name: { type: String, required : true},
		date: { type: Date, required : true},
		link: { type: String, required : true}
	},
	ownerOk        : { type: Boolean },
	status         : { type: String },
	txId: {type: String},
	celebrationDate: { type: String }
});
//Description should be things like date, place, etc
module.exports = mongoose.model("CIPS", CIPSSchema);
