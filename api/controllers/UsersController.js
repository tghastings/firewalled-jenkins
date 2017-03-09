/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */;
// sails.log('Plaintext: ' + params.email);
// sails.log('Encrypted: ' + strEncryptedEmail);
// sails.log('Decrypted: ' + decryptData);
//   var data = CryptoJS.AES.decrypt(strEncryptedEmail, 'secret key 123');
//   var decryptData = data.toString(CryptoJS.enc.Utf8);
var CryptoJS = require("crypto-js")
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}
var UsersController = {
    index: function(req, res){
        User.find({}).exec(function (error, users) {
             return res.json({users});
         });
    },
    create: function(req, res){
        var params = req.params.all()
        // Check to see if user is already registered
        User.find({email: params.email}).exec(function (error, found) {
            if (found.length == 0) {
                var token = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
                // Only create a new user if one doesn't already exist
                User.create({
                    email: params.email,
                    uuid: token,
                }).exec(function (err,created){
                    req.session.authenticated = true
                    res.cookie('token', token);
                    res.cookie('username', params.email);
                    return res.json({
                        notice: 'User created',
                        username: params.email,
                        uuid: token
                    });
                });
            } else {
                req.session.authenticated = true
                res.cookie('token', found[0].uuid);
                res.cookie('username', found[0].email);
                return res.json({
                    notice: 'Welcome back'
                });
            }
        });
    },
    secret: function(req, res){
        var params = req.params.all()
        var cipherText = CryptoJS.AES.encrypt('helloworld', params.secretKey);
        var strCipherText = cipherText.toString();
        var useruuid = req.cookies.token
        User.update({uuid:useruuid},{secretKeyCheck:strCipherText}).exec(function afterwards(err, updated){
            if (err) {
                // handle error here- e.g. `res.serverError(err);`
                return res.serverError(err);
            }
            return res.json({
                notice: 'The key was saved successfully.'
            });
        });
    },
    secret_check: function(req, res){
        var params = req.params.all()
        var cipherText = CryptoJS.AES.encrypt('helloworld', params.secretKey);
        var strCipherText = cipherText.toString();
        var useruuid = req.cookies.token
        User.find({uuid:useruuid}).exec(function afterwards(err, found){
            if (err) {
                // handle error here- e.g. `res.serverError(err);`
                return res.serverError(err);
            } else {
                // DECRYPT
                // sails.log('Encrypted: ' + strEncryptedEmail);
                // sails.log('Decrypted: ' + decryptData);
                var data = CryptoJS.AES.decrypt(found[0].secretKeyCheck, params.secretKey);
                var plainText = data.toString(CryptoJS.enc.Utf8);
                if (plainText == 'helloworld') {
                    res.cookie('stored_key', params.secretKey)
                    return res.json({
                        notice: 'true'
                    });
                } else {
                    return res.json({
                        notice: 'false'
                    });
                }

            }
        });
    }
}
module.exports = UsersController;