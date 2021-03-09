const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 12 //https://security.stackexchange.com/questions/17207/recommended-of-rounds-for-bcrypt
const MAX_LOGIN_ATTEMPTS = 5 //https://security.stackexchange.com/questions/17207/recommended-of-rounds-for-bcrypt
const LOCK_TIME = 2 * 60 * 60 * 1000 //https://security.stackexchange.com/questions/17207/recommended-of-rounds-for-bcrypt
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
    loginAttempts: { type: Number, required: true, default: 0 },
    lockUntil: { type: Number }

},
    { strict: false } //why?
)

UserSchema.virtual("isLocked").get(function () {
    return !!(this.lockUntil && this.lockUntil > Date.now())
})
UserSchema.methods.incLoginAttempts = function (cb) { // if we have a previous lock that has expired, restart at 1 
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.update({ $set: { loginAttempts: 1 }, $unset: { lockUntil: 1 } }, cb);
    } // otherwise we're incrementing 
    var updates = { $inc: { loginAttempts: 1 } }; // lock the account if we've reached max attempts and it's not locked already 
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + LOCK_TIME };
    }
    return this.update(updates, cb)
};


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
        // console.log('match:', isMatch)
        if (err) return cb(err);
        cb(null, isMatch);
    });
}

UserSchema.statics.getAuthed = async function (email, password, done) {
    console.log('here', email, password, this)
    try {
        const user = await this.findOne({ email: email })
        console.log(user)
        if (!user) {
            console.log('no such user')
            return done(null, false);
        } // no User fond
        if (user.isLocked) {
            console.log('user is locked')
            // just increment login attempts if account is already locked
            return user.incLoginAttempts(function (err) {
                if (err) console.log(err);
                return done(null, null);
            });
        }

        user.comparePassword(password, (x, isMatch) => {
            if (isMatch) {
                if (!user.loginAttempts && !user.lockUntil) done(null, user);
                var updates = {
                    $set: { loginAttempts: 0 },
                    $unset: { lockUntil: 1 }
                };
                return user.update(updates, function (err) {
                    if (err) return done(err);
                    return done(null, user);
                });
            }
            else {
                user.incLoginAttempts(function (err) {
                    if (err) console.log(err);
                    return done(null, false)
                })
            }
        })

    } catch (err) {
        console.log(err)
    }


}

const User = mongoose.model("User", UserSchema)
module.exports = User