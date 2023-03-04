const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
    });

    user.save((err, user) => {
        if (err) {
            res.status(500).send({message: err});
            res.redirect('error');
        }
        res.redirect('/signin');
    });
};



exports.signin = (req, res) => {
    User.findOne({
        email: req.body.email,
    }).exec((err, user) => {
        if (err) {
            return res.render('../error', {title:'500!', message:'', error:{status:'500'}})

        }

        if (!user) {
            return res.render('../error', {title:'404!', message:'User Not found.', error:{status:''}})

            // return res.status(404).send({message: "User Not found."});
        }

        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.render('error', {title:'Invalid Password!', message:'Invalid Password!', error:{status:''}})
            // return res.status(401).send({message: "Invalid Password!"});
        }

        req.session.token = jwt.sign({id: user.id}, config.secret, {
            expiresIn: 86400, // 24 hours
        });


        return res.redirect('/dashboard')
    });

};




exports.signout = async (req, res) => {
    try {
        req.session = null;
        return res.redirect('signin');
    } catch (err) {
        this.next(err);
    }
};