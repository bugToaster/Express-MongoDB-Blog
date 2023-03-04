const {authJwt} = require("../middlewares");
const controller = require("../controllers/article.controller");
const commentController = require("../controllers/comment.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });


    app.get('/article-create', [authJwt.verifyToken], (req, res, next) => {
        res.render('article/create-view', {title: 'Create Article'});
    });

    app.post("/article-create", [authJwt.verifyToken], controller.createArticle);

    app.get("/articles", controller.getAllArticles);

    app.get("/article-details/:articleId", [authJwt.verifyToken], controller.detailsArticle);

    app.post("/article-update/:articleId", [authJwt.verifyToken], controller.updateArticle);

    app.get("/article-update-get/:articleId", [authJwt.verifyToken], controller.getUpdateArticle);

    app.post("/articles/:_id/comment-submit", [authJwt.verifyToken], commentController.submitComment);
};