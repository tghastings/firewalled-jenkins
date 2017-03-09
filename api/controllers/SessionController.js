/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var SessionController = {
    validate: function (req, res) {
        if (req.cookies.token) {
            User.find({uuid: req.cookies.token}).exec(function (err, found){
                if (found.length != 0) {
                    req.session.authenticated = true
                    res.cookie('username', found[0].email)
                    var hasSecretKey = 'false'
                    if (!!found[0].secretKeyCheck) {
                        hasSecretKey = 'true'
                    }
                    return res.json({
                        notice: 'Authorized',
                        hasKey: hasSecretKey,
                        auth: 'true'
                    });
                } else {
                    req.session.authenticated = false
                    return res.json({
                        notice: 'Not Authorized',
                        auth: 'false',
                    });;
                }
            });
        }
    },
    destroy: function (req, res) {
        req.session.authenticated = false
        res.clearCookie('username');
        res.clearCookie('token');
        res.clearCookie('uuid');
        res.clearCookie('stored_key');
        return res.redirect('/login');
    }
}
module.exports = SessionController