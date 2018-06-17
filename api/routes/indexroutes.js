var express  = require("express");
var router   = express.Router();
var multer	 = require('multer');
var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'docs/'+file.fieldname);
	},
	filename: (req, file, cb) => {
		cb(null, req.params.cpf+'.jpg');
	}
});
var upload   = multer({storage: storage});

const bip39  = require('bip39');
const driver = require('bigchaindb-driver');
var CC 		 = require("../models/CC");
var C2C		 = require("../models/C2C");
var CEV 	 = require("../models/CEV");
var cripto   = require("crypto");
var CUE 	 = require("../models/CUE");
var User     = require("../models/user");
var util     = require('util');
var authy 	 = require('authy')('RZ5xxY6RXXpkZa0PQIFwdG04VUqnXrca');
var fs		 = require('fs');
var CronJob = require('cron').CronJob;

new CronJob('*/10 * * * * *', function(){
	postBigchain('oi');
	CEV.find({$and:[{'buyerOk':true}, {'sellerOk':true}, {'xrpOk':false}]}).populate('buyer').populate('seller').exec((e, c) => {
		c.forEach( cc => {
			checkifTr(cc.seller.wallet, cc.buyer.wallet, cc.value).then(status => {
				if(!status) return;
				cc.set({xrpOk: true});
				cc.set({status: 'celebrated'});
				postBigchain(cc);
				cc.save((err, success) => {
					if(err) {
						console.log('Error while updating contract '+cc._id);
					}
				});
			})
		});
	});
}, null, true);

const conn = new driver.Connection('https://test.bigchaindb.com/api/v1/', {
	    app_id: '20088fc5',
	    app_key: 'c352512f9ce8c7c3d8af841555d1684c'
});

const RippleAPI = require('ripple-lib').RippleAPI;
const api = new RippleAPI({
	server: 'wss://s2.ripple.com'
});


function checkifTr(secondAddrs, firstAddrs, amount){
	return api.connect().then(() => {
		// let firstAddrs = 'rs2qdz5stxyWeMk6sNz5mLY6h5xxPYNJ8u';
		// let secondAddrs = 'r9kiSEUEw6iSCNksDVKf9k3AyxjW3r1qPf';
		return api.getTransactions(firstAddrs, {limit: 10}).then( transactions => {
			for(let i = 0; i < transactions.length; i++){
				let tx = transactions[i];
				if(tx.type == 'payment'){
					console.log(tx);
					if(tx.specification.source.address == firstAddrs && tx.specification.destination.address == secondAddrs
						&& tx.outcome.deliveredAmount.value == amount){
						return true;
					}
				}
			}
			return false;
		});
	});

}

/*
router.get("/", (req, res) => {
	checkifTr('rs2qdz5stxyWeMk6sNz5mLY6h5xxPYNJ8u', 'r9kiSEUEw6iSCNksDVKf9k3AyxjW3r1qPf', '50');
});
*/

function postBigchain(contract) {
	const alice = new driver.Ed25519Keypair()
	const API_PATH = 'https://test.bigchaindb.com/api/v1/';const tx = driver.Transaction.makeCreateTransaction(
    { contract },
    null,
    [ driver.Transaction.makeOutput(
        driver.Transaction.makeEd25519Condition(alice.publicKey))],
    alice.publicKey)
	const txSigned = driver.Transaction.signTransaction(tx, alice.privateKey)
	conn.postTransactionCommit(txSigned)
	return txSigned.id;
}

router.post("/authyRegister", (req, res) => {
	let user = req.body;
	authy.register_user(user.email, user.phone, '55', (err, rs) => {
		if(err) res.send(err);
		else res.send(rs);
	});
});

router.get("/checkToken/:token/:authid", (req, res) => {
	let token = req.params.token;
	let id = req.params.authid;
	authy.verify(id, token, (err, rs) => {
		if(err) res.send(err);
		else res.send(rs);
	});
});

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

router.post("/contracts/cue", (req, res) => {
	if( checkifTr(req.body.buyerAddrs, req.body.sellerAddrs, req.body.XRPPrice) ){
		CUE.create(CUEF2M(req.body), (err, c) => {
			if(err) res.status(500).send();
			else res.status(200).send();
		});
	}
	else
	{
		console.log("O pagamento ainda nao foi realizado e/ou nao consta na rede Ripple\n");
	}
});

router.post("/contracts/cc", (req, res) => {
	CC.create(CCF2M(req.body), (err, c) => {
		if(err) res.status(500).send();
		else res.status(200).send();
	});
});

router.get("/checkUser/:cpf", (req, res) => {
	User.findOne({'cpf': req.params.cpf}, (err, user) => {
		if(err) return res.status(500).send({message: 'Internal Error'});
		if(user) return res.send({message: 'User already exists', available: false});
		else return res.send({message: 'User available', available: true});
	});
})

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

router.post("/docs/:cpf", upload.fields([{ name: 'photo', maxCount: 1}, {name: 'rg_front', maxCount: 1}, {name: 'rg_back', maxCount: 1}]), (req, res) => {
	console.log(req.params.cpf);
	User.findOne({'cpf': req.params.cpf}, (err, user) => {
		if(err) return res.status(500).send();
		if(user) {
			user.set({verified: 'pending'});
			user.save((err, upd) => {
				if(!err) return res.status(200).send();
				else return res.status(400).send();
			});
		}
		else return res.status(400).send();
	})
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
			return CEV.find({
				'seller': req.params.userId,
				'status': req.params.status
			}).populate('buyer').populate('seller').exec((err, docs2) => {
				if(err) return reject(err);
				docs2 = docs.concat(docs2).map(x => CEVM2F(x));
				return resolve(docs2);
			});
		});
	});
	let cue$ = new Promise((resolve, reject) => {
		CUE.find({
			'residentOne' : req.params.userId,
			'status': req.params.status
		}).populate('residentOne').populate('residentTwo').exec((err, docs) => {
			if(err) return reject(err);
			return CUE.find({
				'residentTwo': req.params.userId,
				'status': req.params.status
			}).populate('residentOne').populate('residentTwo').exec((err, docs2) => {
				if(err) return reject(err);
				docs2 = docs.concat(docs2).map(x => CUEM2F(x));
				return resolve(docs2);
			});
		});
	});
	let cc$ = new Promise((resolve, reject) => {
		CC.find({
			'consortOne' : req.params.userId,
			'status': req.params.status
		}).populate('consortOne').populate('consortTwo').exec((err, docs) => {
			if(err) return reject(err);
			return CC.find({
				'consortTwo': req.params.userId,
				'status': req.params.status
			}).populate('consortOne').populate('consortTwo').exec((err, docs2) => {
				if(err) return reject(err);
				docs2 = docs.concat(docs2).map(x => CCM2F(x));
				return resolve(docs2);
			});
		});
	});
	Promise.all([c2c$, cev$, cue$, cc$]).then((docs) => {
		res.json(docs[0].concat(docs[1], docs[2], docs[3]));
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
			docs2 = docs.concat(docs2).map(x => CEVM2F(x));
			return res.json(docs2);
		});
	});
});

router.get("/contracts/cue/:status/:userId", (req, res) => {
	CUE.find({
		'residentOne' : req.params.userId,
		'status': req.params.status
	}).populate('residentOne').populate('residentTwo').exec((err, docs) => {
		if(err) return res.status(500).send();
		return CUE.find({
			'residentTwo': req.params.userId,
			'status': req.params.status
		}).populate('residentOne').populate('residentTWo').exec((err, docs2) => {
			if(err) return res.status(500).send();
			docs2 = docs.concat(docs2).map(x => CUEM2F(x));
			return res.json(docs2);
		});
	});
});

router.get("/contracts/cc/:status/:userId", (req, res) => {
	CC.find({
		'consortOne' : req.params.userId,
		'status' 	 : req.params.status
	}).populate('consortOne').populate('consortTwo').exec((err, docs) => {
		if(err) return res.status(500).send();
		return CC.find({
			'consortTwo' : req.params.userId,
			'status' : req.params.status
		}).populate('consortOne').populate('consortTwo').exec((err, docs2) => {
			if(err) return res.status(500).send();
			docs2 = docs.concat(docs2).map(x => CCM2F(x));
			return res.json(docs2);
		})
	})
})

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
	else if(req.params.type == 'cue'){
		CUE.findById(req.params.id).populate('residentOne').populate('residentTwo').exec((err, c) => {
			if(err) return res.status(500).send();
			if(!c) return res.status(404).send();
			return res.json(CUEM2F(c));
		});
	}
	else if(req.params.type == 'cc'){
		CC.findById(req.params.id).populate('consortOne').populate('consortTwo').exec((err, c) => {
			if(err) return res.status(500).send();
			if(!c) return res.status(404).send();
			return res.json(CCM2F(c));
		})
	}
});

router.put("/contracts/c2c", (req, res) => {
	C2C.findByIdAndUpdate(req.body._id, C2CF2M(req.body), (err, c) => {
		let s = postBigchain(JSON.stringify(c, undefined, 2));
		c.set({txId: s});
		c.save();
		if(!err) res.status(200).send();
		else res.status(500).send();
	});
});


//Using put to update status'es
router.put("/contracts/cev", (req, res) => {
	CEV.findByIdAndUpdate(req.body._id, CEVF2M(req.body), (err, c) => {
		let s = postBigchain(JSON.stringify(c, undefined, 2));
		c.set({txId: s});
		c.save();
		if(!err) res.status(200).send();
		else res.status(500).send();

	});
});

router.put("/contracts/cue", (req, res) => {
	CUE.findByIdAndUpdate(req.body._id, CUEF2M(req.body), (err,c) => {

		let s = postBigchain(JSON.stringify(c, undefined, 2));
		c.set({txId: s});
		c.save();
		if(!err)	res.status(200).send();
		else res.status(500).send();
	});
});

router.put("/contracts/cc", (req, res) => {
	CC.findByIdAndUpdate(req.body._id, CCF2M(req.body), (err, c) => {
		let s = postBigchain(JSON.stringify(c, undefined, 2));
		c.set({txId: s});
		c.save();
		if(!err) 	res.status(200).send();
		else res.status(500).send();
	})
});

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

router.delete("/contracts/cue/:id", (req, res) => {
	CUE.findOneAndRemove({_id:req.params.id}, (err) => {
		if(!err) res.status(200).send();
		else res.status(500).send();
	});
});

router.delete("/contracts/cc/:id", (req, res) => {
	CC.findOneAndRemove({_id:req.params.id}, (err, doc) => {
		if(!err) res.status(200).send();
		else res.status(500).send();
	});
});



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
		celebrationDate: x['celebrationDate'],
		txId: x['txId'],
		xrpOk: x['xrpOk']
   };
}

CUEF2M = (x) => {
	let residentOne = x['parties'].find(y => y.role == 'residentOne');
	let residentTwo = x['parties'].find(y => y.role == 'residentTwo');
	return {
		residentOne: residentOne['user']['_id'],
		residentTwo: residentTwo['user']['_id'],
		residentOneOk: residentOne['accepted'],
		residentTwoOk: residentTwo['accepted'],
		address: x['address'], //not sure.
		status: x['status'],
		celebrationDate: x['celebrationDate'],
		txId: x['txId']
   };
}

CCF2M = (x) => {
	let consortOne = x['parties'].find(y => y.role == 'consortOne');
	let consortTwo = x['parties'].find(y => y.role == 'consortTwo');
	return {
		consortOne: consortOne['user']['_id'],
		consortTwo: consortTwo['user']['_id'],
		consortOneOk: consortOne['accepted'],
		consortTwoOk: consortTwo['accepted'],
		consortOneParents: consortOne['parents'],
		consortTwoParents: consortTwo['parents'],
		address: x['address'], //not sure.
		status: x['status'],
		celebrationDate: x['celebrationDate'],
		txId: x['txId']
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
		celebrationDate: x.celebrationDate,
		xrpOk: x.xrpOk,
		txId: x.txId
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
		celebrationDate: x.celebrationDate,
		txId: x.txId
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
		celebrationDate: x.celebrationDate,
		txId: x.txId
	};
}

CUEM2F = (x) => {
	return {
		_id: x._id,
		parties: [{
			user: x.residentOne,
			accepted: x.residentOneOk,
			role: 'residentOne'
		}, {
			user: x.residentTwo,
			accepted: x.residentTwoOk,
			role: 'residentTwo'
		}],
		address : x.address,
		status: x.status,
		type: 'cue',
		celebrationDate: x.celebrationDate,
		txId: x.txId
	};
}

CCM2F = (x) => {
	return {
		_id: x._id,
		parties: [{
			user: x.consortOne,
			accepted: x.consortOneOk,
			parents: x.consortOneParents,
			role: 'consortOne'
		}, {
			user: x.consortTwo,
			accepted: x.consortTwoOk,
			parents: x.consortTwoParents,
			role: 'consortTwo'
		}],
		address : x.address,
		status: x.status,
		type: 'cc',
		celebrationDate: x.celebrationDate,
		txId: x.txId
	};
}


module.exports = router;
