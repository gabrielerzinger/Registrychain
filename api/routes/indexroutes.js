var express  = require("express");
var router   = express.Router();
var User     = require("../models/user");
var C2C		 = require("../models/C2C");
var util = require('util');

const BigchainDB = require('bigchaindb-driver');
const bip39 = require('bip39');


router.post("/c2c", (req, res) => {
	User.findOne({ cpf: req.body.counterpart }, (err, doc) => {
		if(err) return res.status(500).send();
		if(!doc) return res.status(404).send();
		C2C.create({
			hirer: req.body.userRole == 'hirer' ? req.body.userId : doc._id,
			hired: req.body.userRole == 'hired' ? req.body.userId : doc._id,
			hirerOk: req.body.hirerOk,
			hiredOk: req.body.hiredOk,
			description: req.body.description,
			status: req.body.status
		}, (err, c) => {
			if(err) {
				console.log('error:', err);
				return;
			}
			res.send(c);
		});
	});
});

router.post("/register", (req, res) => {
	const usrK = new BigchainDB.Ed25519Keypair(bip39.mnemonicToSeed('seedPhrase').slice(0,32));
	User.findOne({'username': req.body.user.username}, (err, user) => {
		if(err) return res.status(500).send();
		if(user) return res.status(403).send('Username already in use');
		User.create(Object.assign(req.body.user, {pubkey: usrK.publicKey}), (err, u) => {
			if(err) return res.status(500).send();
			res.status(201).json(u);
		});
	});
});

//TBA
router.post("/login", (req, res) => {
	User.findOne({
		'username': req.body.username,
		'password': req.body.password
	}, (err, user) => {
		if(err) return res.status(402).send();
		if(user) return res.json(user);
		res.status(404).send();
	});
});

router.get("/user/:username", (req, res) => {
	User.findOne({
		'username': req.params.username
	}, (err, user) => {
		if(user) return res.json(user);
		res.status(404).send();
	})
})

router.get("/contracts/:status/:userId", (req, res) => {
	C2C.find({
		'hirer': req.params.userId,
		'status': req.params.status
	}, (err, docs) => {
		if(docs) {
			return C2C.find({
				'hired': req.params.userId,
				'status': req.params.status
			}, (err, docs2) => {
				if(docs2) return res.json([...docs, ...docs2]);
				res.status(500).send();
			});
		}
		res.status(500).send();
	});
});

router.put("/c2c", (req, res) => {
	C2C.findByIdAndUpdate(req.body._id, {
		'hirer': req.body.hirer,
		'hired': req.body.hired,
		'hirerOk': req.body.hirerOk,
		'hiredOk': req.body.hiredOk,
		'status': req.body.status,
		'description': req.body.description
	});
	res.status(200).send();
});

router.delete("/c2c/:id", (req, res) => {
	C2C.findOneAndRemove({_id: req.params.id}, (err) => {
		if(!err) console.log('done');
	});
	res.status(200).send();
})
module.exports = router;
