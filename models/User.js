const mongoose = require("mongoose");

const UseSchema = new mongoose.Schema({
    name: { type: String },
    email: {
        type: String,
        required: true,
        unique: true
    },
    email_is_verified: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String
    },

},
    { strict: false } //why?
)

module.exports = User = mongoose.model("User", UserSchema)