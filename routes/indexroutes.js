var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var User     = require("../models/user");
var C2C		 = require("../models/C2C");
var multer   = require('multer');
var geocoder   = require('geocoder');
var QRCode = require('qrcode'),
swal = require('sweetalert2');
var middleware = require("../middlewares");
var util = require('util');
var googleMapsClient = require('@google/maps')
	.createClient({key: 'AIzaSyBN-coUgBVefAdZ3-sZTES0x31JuQVsIkM'});

const BigchainDB = require('bigchaindb-driver');
const bip39 = require('bip39');

var upload = multer()


router.get("/", function(rq, rs){
	rs.render("landing");


});

router.get("/c2c", (req, res) => {
	res.render("c2c");
});

router.post("/c2c", (req, res) => {
	User.find({ cpf: req.body.contraparte }, (err, doc) => {
		if(err) {
			console.log('error:',err);
			res.send('error');
			return;
		}
		C2C.create({
			contratante: req.body.check == 'contratante' ? req.user._id : doc[0]._id,
			contratando: req.body.check == 'contratando' ? req.user._id : doc[0]._id,
			descricao: req.body.descricao,
		}, (err, c) => {
			if(err) {
				console.log('error:', err);
				return;
			}
			console.log(c);
			res.send(c);
		});
	});
});

router.get("/proposta", function(rq, rs){
	rs.render("proposal");
});


router.get("/register", function(rq, rs){
	rs.render("signup");
});


router.post("/register",upload.array(), function(rq, rs){
	gotIt = false;
	googleMapsClient.geocode({address: rq.body.usr.address}, function(err, data){
		let results = data.json.results;
		if(!results[0] || err){
			console.log('fail');
		} else {
			gotIt = true;
		}
		console.log(results[0]);
		let lat = results[0].geometry.location.lat;
		let lng = results[0].geometry.location.lng;
		let location = results[0].formatted_address;
		rq.body.usr.lat = lat;
		rq.body.usr.lng = lng;
		rq.body.usr.address = location;

		const usrK = new BigchainDB.Ed25519Keypair(bip39.mnemonicToSeed('seedPhrase').slice(0,32))
		rq.body.usr.pubKey  = usrK.publicKey;
		rq.body.usr.username = rq.body.usr.cpf;

		User.register(rq.body.usr, rq.body.pwd, function(err, usr)
		{
			if (err) {
				console.log('error', err.message);
				return rs.redirect('back');
			}
			rs.redirect('/profile/'+usr._id);
		});
	});
});

router.get("/login", function(rq, rs){
	rs.render("login");
});

router.put("/profile/:id", upload.array(), function(rq, rs){
	googleMapsClient.geocode(rq.body.usr.address, function(err, data){
		if(!data.results[0] || err){
			return rs.redirect("back");
		}
		var lat = data.results[0].geometry.location.lat;
		var lng = data.results[0].geometry.location.lng;
		var location = data.results[0].formatted_address;
		rq.body.usr.lat = lat;
		rq.body.usr.lng = lng;
		rq.body.usr.address = location;

		User.findByIdAndUpdate(rq.params.id, rq.body.usr, function(err, updatedUsr) {
			if(err){
				console.log("errow")
				rs.redirect("back");
			}
			else{
				console.log('editei')
				rs.redirect("/profile/"+updatedUsr._id);
			}
		});
	});

});


router.get("/profile/:id", function(rq, rs){
	User.findById(rq.params.id, function(err, foundUser){
		QRCode.toDataURL(foundUser.pubKey, function (err, url) {
			rs.render("profile", {usr: foundUser, imgurl:url});
		})
	})
})


//TBA
router.post("/login",function(req, res, next) {
	passport.authenticate('local', function(err, user) {
		if (err) { return next(err) }
		// make passportjs setup the user object, serialize the user, ...
		req.login(user, {}, function(err) {
			if (err) { return next(err) };
			return res.redirect("/profile/" + user._id);
		});
	})(req, res, next);
	return;
}
);


router.get("/logout", middleware.isLoggedIn ,function(rq, rs){
	rq.logout();
	rs.render('landing', {Swalflag:true, message:'Até a próxima!'});
});

module.exports = router;
