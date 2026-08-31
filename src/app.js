require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const { userAuth } = require("./middlewares/authHandler")
const bcrypt = require("bcrypt");
const User = require("./models/user")
const { errorHandler } = require("./middlewares/errorHandler")
const { validateSignupData } = require("./utils/validation")
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
    const body = req.body
    // Validation of data (Never trust req.body)
    // Encrypt the password then only save the user in DB
    try {
        validateSignupData(req)
        if(body.skills.length > 5) {
            throw new Error("Skills can't be more than 5")
        }
        const password = await bcrypt.hash(body.password, 10)
        const user = new User({
            firstName: body.firstName,
            lastName: body.lastName,
            password: password,
            email: body.email,
        }) // Creating a new instance of the user model
        await user.save(); // Will be saved into a database
        res.status(201).json({ message: "User added Successfully" })
    }
    catch(err) {
        res.status(400).send("Error:" + err)
    }
})

app.post("/login", async (req, res) => {
    try {
        const body = req.body;
        const user = await User.findOne({ email: body.email });
        if(!user) {
        throw new Error("User does not exist!")
        }
        const validPassword = await bcrypt.compare(body.password, user.password)
        
        if(validPassword) {
            const token = await user.getJWT();

            res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) })
            res.status(200).send("Login Successful")
        } else {
            throw new Error("Invalid Password")
    }
    }
    catch(err) {
        res.status(400).send("Error:"+ err)
    }
})

app.get("/user", async (req, res) => {
    const userMail = req.body.email
    try {
    const user = await User.findOne({ email: userMail })

    if(!user) {
        res.status(404).send("User Not Found")
    } else {
        res.send(user)
    }
    } 
    catch (err) {
        res.status(400).send("Something went wrong")
    }
})

app.get("/userById/:id", async (req, res) => {
    const userId = req.params.id
    console.log(req, 'console')
    try {
    const userById = await User.findById(userId)

    if(!userById) {
        res.status(404).send("User Not Found")
    } else {
        res.send(userById)
    }
    } 
    catch (err) {
        res.status(400).send("Something went wrong")
    }
})

app.get("/deleteUser/:id", async(req, res) => {
    const userId = req.params.id;

    try {
        const userById = await User.findByIdAndDelete(userId)

        if(!userById) {
        res.status(404).send("User Not Found to delete")
    } else {
        res.send('Deleted Successfully')
    }
    } 
    catch (err) {
        res.status(400).send("Something went wrong")
    }
})

app.get("/profile", userAuth, async (req,res) => {
    try {
        const user = req.user;
        res.send(user)
    }
    catch(err) {
        res.status(400).send("Error:" + err)
    }
})

app.delete("/user", async(req, res) => {
    const userId = req.params.id;

    try {
        const userById = await User.findByIdAndDelete(userId)

        if(!userById) {
        res.status(404).send("User Not Found to delete")
    } else {
        res.send('Deleted Successfully')
    }
    } 
    catch (err) {
        res.status(400).send("Something went wrong")
    }
})

app.patch("/user/:userId", async(req, res) => {
    const userId = req.params?.userId;
    const body = req.body

    try {
        const ALLOWED_UPDATES = ["gender", "password", "skills"]
        const allowedUpdates = Object.keys(body).every(k => ALLOWED_UPDATES.includes(k));

        if(!allowedUpdates) {
            throw new Error("Fields not alliowrd")
        }
        if(body.skills.length > 5) {
            throw new Error("Skills can't be more than 5")
        }
        await User.findByIdAndUpdate(userId, body, {
            returnDocument: 'after',
            runValidators: true
        })
        res.send('Updated Success')                                                                                                                                                                                                                                                                                                                                                                                          
    } 
    catch (err) {
        res.status(400).send("Something went wrong" + err)
    }
})

app.get("/feed", userAuth, async (req, res) => {
    try {
    const user = await User.find({})

    if(!user) {
        res.status(404).send("Users Not Found")
    } else {
        res.send(user)
    }
    } 
    catch (err) {
        res.status(400).send("Something went wrong")
    }
})

// Must be registered last, after every route.
app.use(errorHandler)

const PORT = process.env.PORT || 7777;

connectDB().then(() => {
    console.log("Connection Established")
    app.listen(PORT, () => {
    console.log("Server is listening at port " + PORT)
})
}).catch((err) => {
    console.log("Database cannot be connected", err)
})