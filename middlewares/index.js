var middlewareObj = {};
var User = require("../models/user");
var	swal = require('sweetalert2');


middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.render("login.ejs", {Swalflag:true, message:'Você precisa estar logado para isso!'});
    
}




module.exports = middlewareObj;