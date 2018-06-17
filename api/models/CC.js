var mongoose = require("mongoose");

var CCSchema = new mongoose.Schema({
	consortOne: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	consortTwo: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	consortOneParents: {
		fatherName: String,
		motherName: String
	},
	consortTwoParents: {
		fatherName: String,
		motherName: String,
	},
	consortOneOk : { type: Boolean },
	consortTwoOk: { type: Boolean },
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
module.exports = mongoose.model("CC", CCSchema);
