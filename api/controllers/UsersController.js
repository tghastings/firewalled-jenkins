/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */;
// var CryptoJS = require("crypto-js")
// var encryptedEmail = CryptoJS.AES.encrypt(params.email, 'secret key 123');
// var strEncryptedEmail = encryptedEmail.toString();
// var data = CryptoJS.AES.decrypt(strEncryptedEmail, 'secret key 123');
// var decryptData = data.toString(CryptoJS.enc.Utf8);
// sails.log('Plaintext: ' + params.email);
// sails.log('Encrypted: ' + strEncryptedEmail);
// sails.log('Decrypted: ' + decryptData);

var UsersController = {
    create: function(req, res){
        var params = req.params.all()
        // Check to see if user is already registered
        Users.count({email: params.email}).exec(function countCB(error, found) {
            if (found == 0) {
                // Only create a new user if one doesn't already exist
                Users.create({email: params.email}).exec(function (err,created){
                    return res.json({
                        notice: 'First time here? Welcome'
                    });
                });
            } else {
                return res.json({
                    notice: 'Welcome back'
                });
            }
        });
    },

    index: function(req, res){
        Users.find({}).exec(function (error, users) {
             return res.json({users});
         });
    }
}
module.exports = UsersController;