var mongoose = require("mongoose");

var CUESchema = new mongoose.Schema({
	residentOne: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	residentTwo: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	residentOneOk : { type: Boolean },
	residentTwoOk: { type: Boolean },
	address: {
		street: String,
		number: Number,
		neighborhood: String,
		postalCode: String,
		city 	  : String,
		state 	  : String,
		lat 	  : {type: Number, default : 0},
		lng 	  : {type: Number, default : 0} //for geocoder-further-use
	},
	status: { type: String },
	txId: {type: String},
	celebrationDate: { type: String }
});
//Description should be things like date, place, etc
module.exports = mongoose.model("CUE", CUESchema);
