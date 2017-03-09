/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var SessionController = {
    validate: function (req, res) {
        if (req.cookies.token) {
            Users.find({uuid: req.cookies.token}).exec(function (err, found){
                if (found.length != 0) {
                    req.session.authenticated = true
                    res.cookie('username', found[0].email)
                    return res.json({
                        notice: 'Authorized',
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
        return res.redirect('/login');
    }
}
module.exports = SessionController