const db = require("../models");
const User = db.user;
const Article = db.article;
const Comment = db.comment;

// Create a new article
exports.createArticle = (req, res, next) => {
    const article = new Article({
        title: req.body.title,
        content: req.body.content,
        author: req.userId
    });

    article.save()
        .then(result => {
            if (result) {
                User.findOne({
                    _id: req.userId,
                }).then(authorDataResult => {
                    return res.render('article/detail-article', {
                        title: result.title,
                        article: result,
                        authorData: authorDataResult,
                        comments: {}
                    });

                })
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

// Update an existing article
exports.updateArticle = (req, res, next) => {
    const id = req.params.articleId;

    Article.findById(id)
        .exec()
        .then(article => {
            if (!article) {
                return res.status(404).json({
                    message: 'Article not found'
                });
            }

            // Check if the current user is the author of the article
            if (article.author.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    message: 'You are not authorized to update this article'
                });
            }

            // Update the article with the new data
            article.title = req.body.title;
            article.content = req.body.content;

            return article.save();
        })
        .then(result => {
            res.status(200).json({
                message: 'Article updated successfully',
                article: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });


};


// Update an existing article
exports.getUpdateArticle = (req, res, next) => {
    const articleId = req.params.articleId;

    Article.findById(articleId)
        // .populate('comments')
        .populate('author')
        .exec()
        .then(article => {
            if (!article) {
                return res.status(404).json({
                    message: 'Article not found'
                });
            }

            Comment.find({article: articleId})
                .exec()
                .then(comments => {
                    return res.render('article/article-update-get', {
                        title: article.title,
                        article: article,
                        comments: comments
                    });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};


exports.addVote = (req, res, next) => {
    const articleId = req.params.articleId;
    const userId = req.userId;
    const voteType = req.body.voteType;

    Article.findById(articleId)
        .exec()
        .then(article => {
            if (!article) {
                return res.status(404).json({
                    message: 'Article not found'
                });
            }

            // Check if the user has already voted on this article
            const existingVote = article.votes.find(vote => vote.user.toString() === userId.toString());
            if (existingVote) {
                return res.status(400).json({
                    message: 'You have already voted on this article'
                });
            }

            // Add the new vote to the article's votes array
            article.votes.push({
                user: req.userId,
                voteType: voteType
            });

            return article.save();
        })
        .then(result => {
            res.status(200).json({
                message: 'Vote added successfully',
                article: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

//View article
exports.detailsArticle = (req, res, next) => {
    const articleId = req.params.articleId;
    Article.findById(articleId)
        // .populate('comments')
        .populate('author')
        .exec()
        .then(article => {
            if (!article) {
                return res.status(404).json({
                    message: 'Article not found'
                });
            }

            Comment.find({article: articleId})
                .exec()
                .then(comments => {


                    return res.render('article/detail-article', {
                        title: article.title,
                        article: article,
                        authorData: article.author,
                        loggedInUser: req.userId,
                        comments: comments
                    });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};



//get all article by User

exports.getArticlesByUserId = (req, res, next) => {
    const userId = req.userId;
    if (req.userId) {

    }

};


//get all article by User

exports.getAllArticles = (req, res, next) => {

    Article.find()
        .exec()
        .then(articles => {

            return res.render('article/article-list', {title: 'Article List', articles: articles, userId:req.userId});

        })
        .catch(err => {
            console.log(err);

            return res.render('error')
        });


};