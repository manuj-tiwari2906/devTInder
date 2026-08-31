const validator = require("validator") 

const validateSignupData = (req) => {
    const { firstName, lastName, email, password } = req.body;

    if(!firstName || !lastName) {
        throw new Error ('Name is not valid!')
    } else if(firstName.length < 5 || firstName.length > 50) {
        throw new Error("First name should be 4-50 characters")
    } else if (!validator.isEmail(email)) {
        throw new Error("Email is not valid")
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong!")
    }

}
module.exports = { validateSignupData };