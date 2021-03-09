const express = require("express");
const path = require('path')
const app = express();
const port = 5000;

app.use(require('morgan')('dev'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(express.static("public"))
app.use(require('express-session')({ secret: 'superDuperSecret', resave: false, saveUninitialized: false }));


const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/viny", {
    useNewUrlParser: true,
    useFindAndModify: false
});
const db = require("./models")

const passport = require("./passport/setup")
app.use(passport.initialize());
app.use(passport.session());
const isAuth = require("./passport/isAuth")

app.get("/", function (req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
        res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "./public/signup.html"));
});
app.get("/login", function (req, res) {
    if (req.user) {
        res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "./public/login.html"));
});
app.post('/api/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    (req, res) => {
        res.json({ ok: true })
    });

app.post("/api/signup", async (req, res) => {
    console.log("signing up the body", req.body)
    try {
        const newUser = await db.User.create({
            email: req.body.email,
            password: req.body.password
        })
        res.redirect(307, "/api/login");
    } catch (err) {
        res.status(500).json({ oops: true })
    }
});

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

app.get("/api/user_data", function (req, res) {
    if (!req.user) {
        res.json({});
    } else {
        res.json({
            email: req.user.email,
            id: req.user.id
        });
    }
});
app.get("/members", isAuth, function (req, res) {
    res.sendFile(path.join(__dirname, "./public/members.html"));
});

app.listen(port, () => console.log(
    `Example app listening on port ${port}!`
));