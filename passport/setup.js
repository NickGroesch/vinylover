const db = require("../models/")
const passport = require('passport');
const LocalStratgey = require("passport-local").Strategy

passport.use(
    new LocalStratgey(
        { usernameField: "email" },
        (email, password, done) => db.User.getAuthed(email, password, done)
    )
)

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});

module.exports = passport