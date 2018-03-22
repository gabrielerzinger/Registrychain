var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var User     = require("../models/user");
var multer   = require('multer');
var geocoder   = require('geocoder');
var QRCode = require('qrcode');

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
	gotIt = false;
		geocoder.geocode(rq.body.usr.address, function(err, data) 
	    {
	    	console.log(data);
	        if(!data.results[0] || err){
	        	console.log('fail');
	        } else {
	        	gotIt = true;
	        }
            var lat = data.results[0].geometry.location.lat;
            var lng = data.results[0].geometry.location.lng;
            var location = data.results[0].formatted_address;
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
	            rs.redirect('/');
	        });
	    });
});

router.get("/login", function(rq, rs){
    rs.render("login");
});

router.put("/profile/:id", upload.array(), function(rq, rs) 
{
   geocoder.geocode(rq.body.location, function(err, data)
   {
        if(!data || err){
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
                rq.flash("error", err.message);
                rs.redirect("back");
            }
            else{
                rq.flash("success", "Editado com sucesso!");
                rs.redirect("/profile/"+updatedUsr._id);
            }
        });
    });

});


router.get("/profile/:id", function(rq, rs){
    User.findById(rq.params.id, function(err, foundUser){
        QRCode.toDataURL(foundUser.pubKey, function (err, url) {
            rs.render("profile", {usr: foundUser, imgurl:url});
            console.log(foundUser);
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


router.get("/logout", function(rq, rs){
    rq.logout();
    rq.flash("success", "Até a proxima!");
    rs.redirect("/");
});

module.exports = router;
