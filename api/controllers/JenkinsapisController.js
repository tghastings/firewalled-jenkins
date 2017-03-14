/**
 * JenkinsapisController
 *
 * @description :: Server-side logic for managing jenkinsapis
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var CryptoJS = require("crypto-js")
var jenkinsapi = require('jenkins-api');
var JenkinsapisController = {
    index: function (req, res) {
        User.find({ uuid: req.cookies.token })
            .populate('apis')
            .exec(function (error, user) {
                return res.json({
                    user
                });
            });
    },
    create: function (req, res) {
        var params = req.params.all();
        var key = req.cookies.stored_key
        var token = req.cookies.token;
        var cipherText = CryptoJS.AES.encrypt(params.apiKey, key);
        var strCipherText = cipherText.toString();
        User.find({ uuid: token }).exec(function (error, found) {
            var current_user = found[0].id;
            Jenkinsapi.create({
                apiKey: strCipherText,
                url: params.url,
                user_id: params.user_id,
                owner: current_user
            }).exec(function (err, created) {
                return res.json({
                    notice: 'API record created',
                });
            });
        });
    },
    connect: function (req, res) {
        var params = req.params.all();
        var key = req.cookies.stored_key
        var token = req.cookies.token;
        User.find({ uuid: token }).exec(function (error, userFound) {
            var current_user = userFound[0].id;
            var current_user_email = userFound[0].email;
            Jenkinsapi.find({ id: params.apiID }).exec(function (err, JenkinsFound) {
                if (JenkinsFound[0].owner == current_user) {
                    // User owns the jenkins api
                    var data = CryptoJS.AES.decrypt(JenkinsFound[0].apiKey, key);
                    var plainText = data.toString(CryptoJS.enc.Utf8);
                    return res.json({
                        notice: 'Authorized',
                        user_email: JenkinsFound[0].user_id,
                        url: JenkinsFound[0].url,
                        plainTextAPIKey: plainText,
                    });
                } else {
                    // User does not own the jenkins api
                    return res.json({
                        notice: 'Not authorized'
                    });
                }
            });
        });
    },
    destroy: function (req, res) {
        var params = req.params.all();
        var token = req.cookies.token;
        User.find({ uuid: token }).exec(function (error, userFound) {
            var current_user = userFound[0].id;
            var current_user_email = userFound[0].email;
            Jenkinsapi.find({ id: params.apiID }).exec(function (err, JenkinsFound) {
                if (JenkinsFound[0].owner == current_user) {
                    // User owns the jenkins api
                    Jenkinsapi.destroy({ id: params.apiID }).exec(function (err) {
                        if (err) {
                            return res.negotiate(err);
                        }
                        return res.json({
                            notice: 'API Removed',
                        });
                    });
                } else {
                    // User does not own the jenkins api
                    return res.json({
                        notice: 'Not authorized'
                    });
                }
            });
        });
    },
    forgot: function (req, res) {
        var token = req.cookies.token;
        User.find({ uuid: token }).exec(function (error, userFound) {
            var current_user = userFound[0].id;
            Jenkinsapi.destroy({ owner: current_user }).exec(function (err) {
                if (err) {
                    return res.negotiate(err);
                }
                return res.json({
                    notice: 'Success',
                });
            });
        });
    },
    allJobs: function (req, res) {
        // API Token
        var params = req.params.all();
        var url = params.url;
        var jenkins = jenkinsapi.init(url);
        jenkins.all_jobs(function (err, data) {
            if (err) {
                return res.badRequest();
             }
            return res.json({
                notice: 'Success',
                apiData: data
            });
        });
    },
    jobInfo: function (req, res) {
        // API Token
        var params = req.params.all();
        var url = params.url;
        var job = params.job_name;
        var jenkins = jenkinsapi.init(url);
        var promises = [];
        jenkins.job_info(job, function (err, data) {
            if (err) { return console.log(err); }
            return res.json({
                notice: 'Success',
                apiData: data
            });
        });
    },
    buildInfo: function (req, res) {
        // API Token
        var params = req.params.all();
        var url = params.url;
        var job = params.job_name;
        var build = params.build_number
        var jenkins = jenkinsapi.init(url);
        jenkins.build_info(job, build, function (err, data) {
            if (err) { return console.log(err); }
            return res.json({
                notice: 'Success',
                apiData: data
            });
        });
    },
    buildOutput: function (req, res) {
        var params = req.params.all();
        var url = params.url;
        var job = params.job_name;
        var build = params.build_number
        var jenkins = jenkinsapi.init(url);
        jenkins.job_output(job, build, function (err, data) {
            if (err) { return console.log(err); }
            return res.json({
                notice: 'Success',
                apiData: data
            });
        });
    },
    startBuild: function (req, res) {
        var params = req.params.all();
        var url = params.url;
        var job = params.job_name;
        var build = params.build_number
        var jenkins = jenkinsapi.init(url);
        jenkins.build(job, function (err, data) {
            if (err) { return console.log(err); }
            return res.json({
                notice: 'Job Started',
                apiData: data
            });
        });
    }
}
module.exports = JenkinsapisController;