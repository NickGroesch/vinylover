const express = require("express");
const app = express();
const port = 3000;
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

const passport = require("./passport/setup")
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => res.send("Happy noon to you!"));
app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    });

app.listen(port, () => console.log(
    `Example app listening on port ${port}!`
));