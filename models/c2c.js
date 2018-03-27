var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var C2CSchema = new mongoose.Schema({
	contratante: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	contratando: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	descricao: { type: String }
});

module.exports = mongoose.model("C2C", C2CSchema);
