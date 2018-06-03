//Requires setup
var bodyParser     = require("body-parser"),
    express        = require("express"),
    mongoose       = require("mongoose"),
    methodOverride = require("method-override"),
    indexRoutes    = require("./routes/indexroutes"),
    cors           = require('cors');
    

const driver = require('bigchaindb-driver');
const bip39 = require('bip39');
//App+express setup
var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.locals.moment = require('moment');
	
	


//Connect and seed the database
mongoose.connect(process.env.DATABASEURL||'mongodb://localhost/RegistryChain');


app.use(indexRoutes);
//TBA: REST routing from diff files

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Started...");
});


app.listen(3000, function(){
	console.log('Listening..');
	postBigchain();
});
