const db = require("../models/")
const passport = require('passport');
const LocalStratgey = require("passport-local").Strategy

passport.use(
    new LocalStratgey({ usernameField: "email" }, (email, password, done) => {
        // console.log(email, password)
        db.User.findOne({ email: email })
            .then(user => {
                if (!user) { return cb(null, false); }
                user.comparePassword(password, (x, isMatch) => {
                    if (isMatch) return done(null, user);
                    else return done(null, false)
                })
            })
            .catch(err => {
                return done(null, false, { message: err })
            })
    })
)

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});

module.exports = passport