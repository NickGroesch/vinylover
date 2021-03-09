const bcrypt = require('bcryptjs');
const db = require("../models/")
const passport = require('passport');
const LocalStratgey = require("passport-local").Strategy

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.User.findById(id, (err, user) => {
        done(err, user)
    })
})

passport.use(
    new LocalStratgey({ usernameField: "email" }, (email, password, done) => {
        db.User.findOne({ email: email })
            .then(user => {
                if (!user) { return cb(null, false); }
                if (user.password != password) { return cb(null, false); }
                return cb(null, user);
            })
            .catch(err => {
                return done(null, false, { message: err })
            })
    })
)

module.exports = passport