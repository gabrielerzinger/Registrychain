var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var User     = require("../models/user");
var multer   = require('multer');
var geocoder   = require('geocoder');

const BigchainDB = require('bigchaindb-driver')
const bip39 = require('bip39')


var upload = multer()


router.get("/", function(rq, rs){
	rs.render("landing");
});


router.get("/proposta", function(rq, rs){
	rs.render("proposal");
});


router.get("/register", function(rq, rs){
    rs.render("signup");
});


router.post("/register",upload.array(), function(rq, rs){

	geocoder.geocode(rq.body.usr.address, function(err, data) 
    {
        if(!data.results[0] || err){
        	console.log('fail');
            return rs.redirect("back");
        }
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
	    const usrK = new BigchainDB.Ed25519Keypair(bip39.mnemonicToSeed('seedPhrase').slice(0,32))

        rq.body.usr.lat = lat;
        rq.body.usr.lng = lng;
        rq.body.usr.address = location;
        rq.body.usr.pubKey  = usrK.publicKey;


        User.register(rq.body.usr, rq.body.usr.pwd, function(err, usr) 
        {
            if (err) {
              rq.flash('error', err.message);
              return rs.redirect('back');
            }
            rs.redirect('/');
        });
    });
});

router.get("/login", function(rq, rs){
    rs.render("login");
})

//TBA
router.post("/login", passport.authenticate("local", {
    successRedirect : "/",
    failureRedirect: "/login"
}) ,function(rq, rs){});

module.exports = router;
