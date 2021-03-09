const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 12 //https://security.stackexchange.com/questions/17207/recommended-of-rounds-for-bcrypt
const UserSchema = new mongoose.Schema({
    name: { type: String },
    email: {
        type: String,
        required: true,
        unique: true
    },
    email_is_verified: { //TODO nodemailer
        type: Boolean,
        default: false,
    },
    password: {
        type: String
    },
},
    { strict: false } //why?
)

UserSchema.pre('save', function (next) {//CANNOT BE AN =>
    const self = this //useful later when I dive into the callbacks
    if (!this.isModified('password')) return next();
    else {
        bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(self.password, salt, function (err, hash) {
                if (err) return next(err);
                self.password = hash;
                next();
            })
        });
    }
})

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    console.log('comp:', candidatePassword, this.password)
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        console.log('match:', isMatch)
        if (err) return cb(err);
        cb(null, isMatch);
    });
}

const User = mongoose.model("User", UserSchema)
module.exports = User