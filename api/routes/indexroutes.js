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

const doll =  new driver.Ed25519Keypair();

function postBigchain(contract) {
	console.log('t');
	const API_PATH = 'https://test.bigchaindb.com/api/v1/'
	const tx = driver.Transaction.makeCreateTransaction(
		contract,
		null,
	    [ driver.Transaction.makeOutput(
	            driver.Transaction.makeEd25519Condition(doll.publicKey))
	    ],
	    doll.publicKey
	)
	const txSigned = driver.Transaction.signTransaction(tx, doll.privateKey)
	conn.postTransactionCommit(txSigned)
	    .then(retrievedTx => console.log('Transaction ', retrievedTx.id, ' successfully posted.'))

}

router.post("/contracts/c2c", (req, res) => {
	C2C.create(C2CF2M(req.body), (err, c) => {
		if(err) res.status(500).send();
		else res.status(200).send();

	});
});

router.post("/contracts/cev", (req, res) => {
	CEV.create(CEVF2M(req.body), (err, c) => {
		if(err) res.status(500).send();
		else res.status(200).send();
	});
});

router.post("/register", (req, res) => {
	const usrK = new driver.Ed25519Keypair();
	User.findOne({'username': req.body.user.username}, (err, user) => {
		if(err) return res.status(500).send();
		if(user) return res.status(403).send('Username already in use');
		delete req.body.user._id;
		User.create(Object.assign(req.body.user, {pubkey: usrK.publicKey}), (err, u) => {
			if(err) return res.status(500).send();
			res.status(201).json(u);
		});
	});
});

router.post("/login", (req, res) => {
	User.findOne({
		'pubkey': req.body.pubkey,
		'password': req.body.password
	}, (err, user) => {
		if(err) return res.status(402).send();
		if(user) return res.json(user);
		res.status(404).send();
	});
});

router.get("/user/:pubkey", (req, res) => {
	User.findOne({
		'pubkey': req.params.pubkey
	}, (err, user) => {
		if(user) return res.json(user);
		res.status(404).send();
	})
})

router.get("/contracts/:status/:userId", (req, res) => {
	let c2c$ = new Promise((resolve, reject) => {
		C2C.find({
			'hirer': req.params.userId,
			'status': req.params.status
		}).populate('hirer').populate('hired').exec((err, docs) => {
			if(err) return reject(err);
			return C2C.find({
				'hired': req.params.userId,
				'status': req.params.status
			}).populate('hirer').populate('hired').exec((err, docs2) => {
				if(err) return reject(err);
				docs2 = docs.concat(docs2).map(x => C2CM2F(x));
				return resolve(docs2);
			});
		});
	});
	let cev$ = new Promise((resolve, reject) => {
		CEV.find({
			'buyer' : req.params.userId,
			'status': req.params.status
		}).populate('buyer').populate('seller').exec((err, docs) => {
			if(err) return reject(err);
			console.log('found: ',JSON.stringify(docs, undefined, 2));
			return CEV.find({
				'seller': req.params.userId,
				'status': req.params.status
			}).populate('buyer').populate('seller').exec((err, docs2) => {
				if(err) return reject(err);
				console.log('and: ', JSON.stringify(docs2, undefined, 2));
				docs2 = docs.concat(docs2).map(x => CEVM2F(x));
				return resolve(docs2);
			});
		});
	});
	Promise.all([c2c$, cev$]).then((docs) => {
		console.log('here:',JSON.stringify(docs[1], undefined, 2));
		res.json(docs[0].concat(docs[1]));
	}, err => res.status(500).send());
});

router.get("/contracts/c2c/:status/:userId", (req, res) => {
	C2C.find({
		'hirer': req.params.userId,
		'status': req.params.status
	}).populate('hirer').populate('hired').exec((err, docs) => {
		if(err) return res.status(500).send();
		return C2C.find({
			'hired': req.params.userId,
			'status': req.params.status
		}).populate('hirer').populate('hired').exec((err, docs2) => {
			if(err) return res.status(500).send();
			docs2 = docs.concat(docs2).map(x => C2CM2F(x));
			return res.json(docs2);
		});
	});
});

router.get("/contracts/cev/:status/:userId", (req, res) => {
	CEV.find({
		'buyer' : req.params.userId,
		'status': req.params.status
	}).populate('buyer').populate('seller').exec((err, docs) => {
		if(err) return res.status(500).send();
		return CEV.find({
			'seller': req.params.userId,
			'status': req.params.status
		}).populate('buyer').populate('seller').exec((err, docs2) => {
			if(err) return res.status(500).send();
			docs2 = docs.concat(docs).map(x => CEVM2F(x));
			return res.json(docs2);
		});
	});
});

//Render a contract that is on the bigchain
router.get("/contracs/show/:type/:id", (req, res) => {
	if(req.params.type == 'cev'){
		CEV.findById(req.params.id).populate('buyer').populate('seller').exec((err, x) => {
			if(err) return res.status(500).send();
			if(!x) return res.status(404).send();
			return res.json(CEVM2F(x));
		});
	}
	else if(req.params.type == 'c2c'){
		C2C.findById(req.params.id).populate('hirer').populate('hired').exec((err, c) => {
			if(err) return res.status(500).send();
			if(!c) return res.status(404).send();
			return res.json(C2CM2F(c));
		});
	}
});

router.put("/contracts/c2c", (req, res) => {
	C2C.findByIdAndUpdate(req.body._id, C2CF2M(req.body), (err, c) => {
		postBigchain(JSON.stringify(c, undefined, 2));
		if(!err) res.status(200).send();
		else res.status(500).send();
	});
});


//Using put to update status'es
router.put("/contracts/cev", (req, res) => {
	CEV.findByIdAndUpdate(req.body._id, CEVF2M(req.body), (err, c) => {
		postBigchain(JSON.stringify(c, undefined, 2));
		if(!err) res.status(200).send();
		else res.status(500).send();

	});
})

router.delete("/contracts/c2c/:id", (req, res) => {
	C2C.findOneAndRemove({_id: req.params.id}, (err) => {
		if(!err) res.status(200).send();
		else res.status(500).send();
	});
});

router.delete("/contracts/cev/:id", (req, res) => {
	CEV.findOneAndRemove({_id:req.params.id}, (err) => {
		if(!err) res.status(200).send();
		else res.status(500).send();
	});
})

//CEV Front to Mongo
CEVF2M = (x) => {
	let buyer = x['parties'].find(y => y.role == 'buyer');
	let seller = x['parties'].find(y => y.role == 'seller');
	return {
		buyer: buyer['user']['_id'],
		seller: seller['user']['_id'],
		buyerOk: buyer['accepted'],
		sellerOk: seller['accepted'],
		item: x['item']['name'],
		value: x['item']['value'],
		paymentMethod: x['paymentMethod'],
		description: x['description'],
		status: x['status'],
		celebrationDate: x['celebrationDate']
   };
}

//CEV Mongo to Front
CEVM2F = (x) => {
	return {
		_id: x._id,
		parties: [{
			user: x.buyer,
			accepted: x.buyerOk,
			role: 'buyer'
		}, {
			user: x.seller,
			accepted: x.sellerOk,
			role: 'seller'
		}],
		item: {
			name: x.item,
			value: x.value
		},
		paymentMethod: x.paymentMethod,
		description: x.description,
		status: x.status,
		type: 'cev',
		celebrationDate: x.celebrationDate
	};
}

// C2C Front to Mongo
C2CF2M = (x) => {
	let hirer = x.parties.find(y => y.role == 'hirer');
	let hired = x.parties.find(y => y.role == 'hired');
	return {
		hirer: hirer.user._id,
		hired: hired.user._id,
		hirerOk: hirer.accepted,
		hiredOk: hired.accepted,
		status: x.status,
		description: x.description,
		celebrationDate: x.celebrationDate
	}
}

// C2C Mongo to Front
C2CM2F = (x) => {
	return {
		_id: x._id,
		parties: [{
			user: x.hired,
			accepted: x.hiredOk,
			role: 'hired'
		}, {
			user: x.hirer,
			accepted: x.hirerOk,
			role: 'hirer'
		}],
		description: x.description,
		status: x.status,
		type: 'c2c',
		celebrationDate: x.celebrationDate
	};
}

module.exports = router;
