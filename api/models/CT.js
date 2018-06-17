var mongoose = require("mongoose");

var CTSchema = new mongoose.Schema({
	employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	company:  { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	employeeFunction: { type: String },
	employeeNumber: {type: String},
	employeeSeries: {type: String},
	duration:
	{ 
		unknown: {type: Boolean},
		known  : {type: Boolean},
		start  : {type: Date, required: function() { return this.duration.known == true; }},
		end    : {type: Date, required: function() { return this.duration.known == true; }}
	},
	company:  
	{
		name: {type: String},
		cnpj: {type: String},
		address:
		{
			street: String,
			number: Number,
			neighborhood: String,
			postalCode: String,
			city 	  : String,
			state 	  : String,
			lat 	  : {type: Number, default : 0},
			lng 	  : {type: Number, default : 0} //for geocoder-further-use
		}
	},
	employeeOk : { type: Boolean },
	companyOk: { type: Boolean },
	status: { type: String },
	txId: {type: String},
	celebrationDate: { type: String }
});
//Description should be things like date, place, etc
module.exports = mongoose.model("CT", CTSchema);
