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
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

var UsersController = {
    index: function(req, res){
        Users.find({}).exec(function (error, users) {
             return res.json({users});
         });
    },

    create: function(req, res){
        var params = req.params.all()
        // Check to see if user is already registered
        Users.find({email: params.email}).exec(function (error, found) {
            if (found.length == 0) {
                var token = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
                // Only create a new user if one doesn't already exist
                Users.create({
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
}
module.exports = UsersController;