//Requires setup
var bodyParser     = require("body-parser"),
    express        = require("express"),
    flash          = require("connect-flash"),
    LocalStrategy  = require("passport-local"),
    LocalMongoose  = require("passport-local-mongoose"),
    mongoose       = require("mongoose"),
    methodOverride = require("method-override"),
    passport       = require("passport"),
    multer         = require("multer"),
    User           = require("./models/user"),
    indexRoutes    = require("./routes/indexroutes");


//App+express setup
var app = express();
app.use(flash());
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

//Authentication setup
app.use(require("express-session")({
    secret            : "Violent delights have violent endings",
    resave            : false,
    saveUninitialized : false
}))
app.locals.moment = require('moment');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Connect and seed the database
mongoose.connect(process.env.DATABASEURL);
//seedDB();

//Pass currUser to all templates
app.use(function(req, res, next){
    res.locals.currUser = req.user;
    res.locals.error    = req.flash("error");
    res.locals.success  = req.flash("success");
    next();
});

app.use(indexRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Started...");
});


app.listen(3000, function(){
	console.log('Listening..');
});


