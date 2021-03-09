const mongoose = require("mongoose");

// const ThirdPartyProviderSchema = new mongoose.Schema({ // MIGHT not be using this at all
//     provider_name: {
//         type: String,
//         default: null
//     },
//     provider_id: {
//         type: String,
//         default: null
//     },
//     provider_data: {
//         type: {},
//         default: null
//     }
// });

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