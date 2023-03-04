const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Article = db.article;


exports.userBoard = (req, res) => {

    User.findById(req.userId, (err, user) => {
        if (err) {
            return res.status(500).send({message: 'Internal Server Error'});
        }
        if (!user) {
            return res.status(404).send({message: 'User not found'});
        }

        Article.find({author: req.userId})
            .exec()
            .then(articles => {
                return res.render('user/dashboard', {title: 'Dashboard', user, articles: articles})
            })
            .catch(err => {
                console.log(err);
                return res.render('error')
            });


    })

};
