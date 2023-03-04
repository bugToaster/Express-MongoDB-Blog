const { duplicateUserVerify, checkSession } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get('/signin',[checkSession], (req, res, next)=> {
    res.render('user/login', { title: 'Login page' });
  });


  app.get('/signup',[checkSession] , (req, res, next)=> {
    res.render('user/signup', { title: 'Signup page' });
  });

  app.post(
      "/signup",
      [
        duplicateUserVerify.checkDuplicateEmail
      ],
      controller.signup
  );

  app.post("/signin", controller.signin);

  app.post("/signout", controller.signout);
};