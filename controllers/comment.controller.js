const db = require("../models");
const User = db.user;
const Article = db.article;
const Comment = db.comment;

// Create a new comment for a article

exports.submitComment = function(req, res, next) {
    const articleId = req.params._id;


    Article.findById(articleId, function(err, article) {
        if (err) { return next(err); }

        // Create a new comment using the submitted form data
        const newComment = new Comment({
            text: req.body.comment_text,
            author: req.userId,
            article: articleId
        });

        // Save the comment to the database
        newComment.save(function(err, comment) {
            if (err) { return next(err); }
                console.log(articleId,"=====ART++++")
                // Redirect the user back to the article page
                res.redirect(`/article-details/${articleId}`);
        });
    });
};