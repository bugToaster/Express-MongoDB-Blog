checkSession = (req, res, next) => {
    if (req.session.token) {
        // if session exists, redirect to the dashboard route
        return res.redirect('/dashboard');
    } else {
        // if session does not exist, continue to the next middleware
        next();
    }
};



module.exports = checkSession;