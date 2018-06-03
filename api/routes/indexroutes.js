var express  = require("express");
var router   = express.Router();
var User     = require("../models/user");
var C2C		 = require("../models/C2C");
var CEV 	 = require("../models/CEV");
var util = require('util');
var cripto = require("crypto");
const driver = require('bigchaindb-driver');
const bip39 = require('bip39');


const conn = new driver.Connection('https://test.bigchaindb.com/api/v1/', { 
	    app_id: '20088fc5',
	    app_key: 'c352512f9ce8c7c3d8af841555d1684c'
});

function postBigchain(userpub, userpriv, contract) {
	const API_PATH = 'https://test.bigchaindb.com/api/v1/'
	const tx = driver.Transaction.makeCreateTransaction(
		contract,
		null,
	    [ driver.Transaction.makeOutput(
	            driver.Transaction.makeEd25519Condition(userpub))
	    ],
	    userpub
	)
	const txSigned = driver.Transaction.signTransaction(tx, userpriv)
	conn.postTransactionCommit(txSigned)
	    .then(retrievedTx => console.log('Transaction ', retrievedTx.id, ' successfully posted.'))

}



router.post("/contracts/c2c", (req, res) => {
	// counterpart identifier should actually be the pubkey, not cpf
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
			postBigchain();
			res.send(c);
		});
	});
});

router.post("/contracts/cev", (rq, rs) => {
	User.finOne({ pubkey : req.body.counterpart }, (err, usr) => {
		if(err) return res.status(500).send();
		if(!usr) return res.status(404).send();
		CEV.create({
			buyer      : req.body.userRole == 'buyer' ? req.body.userId : usr._id,
			seller     : req.body.userRole == 'seller' ? req.body.userId : usr._id,
			firstOk    : req.body.firstOk,
			secondOk   : req.body.secondOk,
			item       : req.body.item,
			value      : req.body.value,
			payMethod  : req.body.payMethod,
			description: req.body.description,
			status     : req.body.status
		}, (err, c) => {
			if(err) return;
			res.send(c);
		});
	});
});

router.post("/register", (req, res) => {
	const usrK = new driver.Ed25519Keypair();
	User.findOne({'username': req.body.user.username}, (err, user) => {
		if(err) return res.status(500).send();
		if(user) return res.status(403).send('Username already in use');
		User.create(Object.assign(req.body.user, {pubkey: usrK.publicKey}), (err, u) => {
			if(err) return res.status(500).send();
			res.status(201).json(u);
		});
	});
});

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

router.get("/contracts/c2c/:status/:userId", (req, res) => {
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

router.get("/contracts/cev/:status/:userId", (req, res) => {
	CEV.find({
		'buyer' : req.params.userId,
		'status': req.params.status
	}, (err, docs) => {
		if(docs){
			return CEV.find({
				'seller': req.params.userId,
				'status': req.params.status
			}, (err, docs2) => {
				if(docs2) return res.json([...docs, ...docs2]);
				res.status(500).send();
			});
		}
		res.status(500).send();
	});
});

//Render a contract that is on the bigchain
router.get("/contracs/show/:type/:id", (req, res) => {
	if(req.params.type == 'cev'){
		CEV.findById(req.params.id, function(err, c){
			if(err) res.status(500).send();
			if(!c) res.status(404).send();
			res.send(c);
		});
	}
	else if(req.params.type == 'c2c'){
		C2C.findById(req.params.id, function(err, c){
			if(err) res.status(500).send();
			if(!c) res.status(404).send();
			res.send(c);
		});	
	}
});

router.put("/contracts/c2c", (req, res) => {
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


//Using put to update status'es
router.put("/contracts/cev", (req, res) => {
	CEV.findByIdAndUpdate(req.body._id, {
			'buyer'      : req.body.userRole == 'buyer' ? req.body.userId : usr._id,
			'seller'     : req.body.userRole == 'seller' ? req.body.userId : usr._id,
			'firstOk'    : req.body.firstOk,
			'secondOk'   : req.body.secondOk,
			'item'       : req.body.item,
			'value'      : req.body.value,
			'payMethod'  : req.body.payMethod,
			'description': req.body.description,
			'status'     : req.body.status
	});
	res.status(200).send()
})

router.delete("/contracts/c2c/:id", (req, res) => {
	C2C.findOneAndRemove({_id: req.params.id}, (err) => {
		if(!err) console.log('done');
	});
	res.status(200).send();
});

router.delete("/contracts/cev/:id", (req, res) => {
	CEV.findOneAndRemove({_id:req.params.id}, (err) => {
		if(!err) console.log('removed');
	});
	res.status(200).send();
})


module.exports = router;
