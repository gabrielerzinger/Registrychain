var mongoose = require("mongoose");

var CIPBSchema = new mongoose.Schema({
	bookOwner     : { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	book 		  : 
	{
		name      : { type: String, required : true},
		date      : { type: Date, required : true},
		genre     : { type: String, required : true},
		pageNumber: { type: Number, required : true},
		pdfLink   : { type: String}
	},
	ownerOk        : { type: Boolean },
	txId: {type: String},
	status         : { type: String },
	celebrationDate: { type: String }
});
//Description should be things like date, place, etc
module.exports = mongoose.model("CIPB", CIPBSchema);
