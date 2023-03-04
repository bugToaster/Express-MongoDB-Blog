const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const expressSession = require("express-session");


require('dotenv').config()

const cors = require("cors");
const db = require("./models");

const app = express();

app.use(cors());
app.options('*', cors());


db.mongoose
    .connect(process.env.CLOUD_DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Successfully connect to MongoDB.");
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });




//configure express-bodyparser middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(expressSession({
    secret: process.env.COOKIE_SECRET,
    saveUninitialized: true,
    cookie: { secure: false }
}));

require('./routes/index')(app);
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/article.routes')(app);

// view engine setup
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));




app.use(express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.status(404);

    const pageTitle = '404 Page Not Found'; // Set the title for the 404 page

    // Render the 404 page and pass the pageTitle variable
    res.render('404', { title: pageTitle });
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

module.exports = app;
