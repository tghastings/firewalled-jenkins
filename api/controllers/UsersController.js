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
var LdapAuth = require('ldapauth-fork');
var config = {
  ldap: {
    url: process.env.ldap_url, // ldaps://ldap.example.com:636
    adminDn: process.env.ldap_adminDn, // uid=myadminusername,ou=users,o=example.com
    adminPassword: process.env.ldap_password, //password
    searchBase: process.env.ldap_searchBase, //ou=users,o=example.com
    searchFilter: "(samaccountname={{username}})" // (uid={{username}})
  }
}
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
        var ldap = new LdapAuth({
            url: config.ldap.url,
            adminDn: config.ldap.adminDn,
            adminPassword: config.ldap.adminPassword,
            searchBase: config.ldap.searchBase,
            searchFilter: config.ldap.searchFilter,
            reconnect: true
        });
        var params = req.params.all();
        var username = params.username;
        var password = params.password;
        ldap.on('error', err => {
            sails.log(err.message)
        });
        ldap.authenticate(username, password, function (err, user) {
            if (err) {
                return res.badRequest();
            }
            // Check to see if user is already registered
            User.find({email: user.mail}).exec(function (error, found) {
                if (found.length == 0) {
                    res.cookie('username', user.mail);
                    var token = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
                    // Only create a new user if one doesn't already exist
                    User.create({
                        email: user.mail,
                        uuid: token,
                    }).exec(function (err,created){
                        req.session.authenticated = true
                        res.cookie('token', token);
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
        });
        ldap.close();
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