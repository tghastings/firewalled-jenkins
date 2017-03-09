/**
 * JenkinsapisController
 *
 * @description :: Server-side logic for managing jenkinsapis
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var CryptoJS = require("crypto-js")
var JenkinsapisController = {
    index: function(req, res){
        User.find({uuid: req.cookies.token})
        .populate('apis')
        .exec(function (error, user) {
            return res.json({
                user
            });
        });
    },
    create: function(req, res){
        var params = req.params.all();
        var key = req.cookies.stored_key
        var token = req.cookies.token;
        var cipherText = CryptoJS.AES.encrypt(params.apiKey, key);
        var strCipherText = cipherText.toString();
        User.find({uuid: token}).exec(function (error, found) {
            var current_user = found[0].id;
            Jenkinsapi.create({
                apiKey: strCipherText,
                url: params.url,
                owner: current_user
            }).exec(function (err,created){
                return res.json({
                    notice: 'API record created',
                });
            });
        });
    }
}
module.exports = JenkinsapisController;