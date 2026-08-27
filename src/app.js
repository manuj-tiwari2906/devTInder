require("dotenv").config();
const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const User = require("./models/user")

app.use(express.json())

app.post("/signup", async (req, res) => {

    const user = new User(req.body) // Creating a new instance of the user model
    try {
        await user.save(); // Will be saved into a database
        res.send("User added Successfully")
    } 
    catch (err) {
        res.status(400).send("Error adding the User")
    }
       
})

app.get("/user", async (req, res) => {
    const userMail = req.body.email
    try {
    const user = await User.findOne({ email: userMail })

    if(user.length === 0) {
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

app.get("/user", async(req, res) => {
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

app.patch("/user", async(req, res) => {
    const userId = req.body.userId;
    const body = req.body

    try {
        await User.findByIdAndUpdate(userId, body)
        res.send('Updated Success')                                                                                                                                                                                                                                                                                                                                                                                          
    } 
    catch (err) {
        res.status(400).send("Something went wrong")
    }
})

app.get("/feed", async (req, res) => {
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

const PORT = process.env.PORT || 7777;

connectDB().then(() => {
    console.log("Connection Established")
    app.listen(PORT, () => {
    console.log("Server is listening at port " + PORT)
})
}).catch((err) => {
    console.log("Database cannot be connected", err)
})