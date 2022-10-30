const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken'); // Included the JWT
const router = express.Router();
const User = require("../model/User");
const authMiddleware = require("../middleware/authMiddleware");

const saltRounds = 10;

// Using async await
router.post("/register", async (req, res) => {
    // Getting the data from frontend and assigning it to local const.
    const { name, email, phone, work, password, cpassword } = req.body;

    try {
        // Finding if it is already present or not
        const findone = await User.findOne({ email: email });
        if (findone) {
            // If it is already present
            res.send({ result: "User Already Exists" });
        } else {
            // If it is already not present
            // check that p and cp is equal
            if (password == cpassword) {
                // Then hash the password and store it to database
                bcrypt.hash(password, saltRounds, function (err, hash) {
                    if (!err) {
                        const newUser = new User({ name: name, email: email, phone: phone, work: work, password: hash, cpassword: hash });
                        newUser.save();
                        res.send({ result: "Registered succesfully", regStatus: 201 });
                    }
                    else {
                        console.log(err);
                    }

                });
            }
        }

    } catch (error) {
        console.log("I am in catch");
        console.log(error)
        res.send(error.message);
    }
})



router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
        const found = await User.findOne({ email: email });
        if (found) {

            bcrypt.compare(password, found.password, (err, result) => {
                if (result) {
                    // After verified I created a token and stored it in database.
                    const token = jwt.sign({ _id: found._id }, process.env.SECRET_KEY);
                    // Storing token to the browser and after that we use cookie-parser to get the token data. Keep in mind if we use postman and try to see cookie on google then we do not find it because here postman act as a browser and send a request so it is not saved on google. Whoever made the request it will be saved on it.
                    res.cookie("jwt", token); // This is inbuilt meathod. .cookie("cookie name","data to store")

                    User.findOneAndUpdate({ email: found.email }, { token: token }, (err) => {
                        if (!err) {
                            console.log("Applied the token succesfully");
                        }
                    });
                    res.send({ result: "User found!!. You are signed in successfully.", lStatus: 200 });
                } else {
                    res.send({ result: "Incorrect Password, Try again" });
                }
            });
        } else {
            res.send({ result: "User does'nt exist, go and register first" });
        }

    } catch (error) {
        res.send(err)
    }
})

router.get("/about", authMiddleware, (req, res) => {
    res.send(req.rootUser);
    // res.send(`This is about page and value is ${req.cookies.sample} and ${req.cookies.jwt}`);
})

router.post("/contact", async (req, res) => {
    try {
        // res.send({message:"request is handled"})
        const { name, email, phone, work, password, cpassword, message } = req.body;

        const user = await User.findOne({email:email});

        if(user){
            const userMessage = await user.addMessage(name,email,phone,message);
            await user.save();
            res.send({message:"sent succesfully"})
        }

        

    } catch (error) {
        console.log(error);
    }

})

router.get("/logout", authMiddleware, (req,res)=>{
    res.clearCookie('jwt');
    res.send({message : 'Succesfully logged out.'});
})

module.exports = router;















// Using promises
// User.findOne({ email: email }).then((findone) => {
//     if (!findone) {
//         const newUser = new User({ name, email, phone, work, password, cpassword });
//         newUser.save();
//         res.send("added succesfully");
//     } else{
//         res.send("User Already Exists")
//     }

// }).catch((err) => {
//     res.send(err);
// })



// Using CallBack Function (Without using promise property of the findOne and newUser.save())

// User.findOne({email:email},(err,findone)=>{
//     if(!err){
//         if(!findone){
//             const newUser = new User({name,email,phone,work,password,cpassword});
//             newUser.save();
//             res.send("added succesfully");
//         }
//     }
// })