const mongoose = require("mongoose");
const validator = require("validator")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required : true,
        minLength: 4
    },
    lastName : {
        type: String,
        required : true,
        minLength: 4
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid Email")
            }
        }
    },
    password: {
        type: String,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Enter a strong password!")
            }
        }
    },
    gender : {
        type: String,
        validate(value) {
            if(!['Male', 'Female', 'Others'].includes(value)) { // This will only work for POST and not PUT/PATCH
                throw new Error("Gender data is not valid!")
            }
        }
    },
    photoUrl : {
        type: String,
        default: "https://www.pngitem.com/pimgs/m/35-350426_profile-icon-png-default-profile-picture-png-transparent.png",
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error("Invalid URL")
            }
        }
    },
    skills : {
        type: [String],
    },
    about : {
        type: String,
        default: "This is a default info"
    },
}, {
    timestamps: true
})

userSchema.methods.getJWT = async function() {
    const user = this; // this keywords does not work in arrow functions that's why using function
    const token = await jwt.sign({ _id: user._id }, "DEV@Tinder", { expiresIn: '7d' })
    return token;
}

module.exports = mongoose.model("User", userSchema);
