const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const User = require('../model/User');

const authMiddleware = async (req, res, next) => {
    console.log("in the middleware");


    try {
        // Taking the jwt token
        const token = req.cookies.jwt;
        // console.log(token);

        // verifing the token stored on cookie
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Get the root User
        const rootUser = await User.findById(decoded._id);

        // If their is no found one
        if (!rootUser) {
            throw new Error("User not found");
        }

        // If found One
        console.log("valid user");

        // By using it we can get the value in the route in which we are using the middleware
        req.token = token;
        req.rootUser = rootUser;

        // Instruction to perform the next step after the middleware.
        next();

    } catch (error) {
        res.status(401).send({result:"No token provided"});
        console.log(error);
    }
    // jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    //     if (!err) {
    //         User.findById(decoded._id, (error, foundOne) => {
    //             if (!error) {
    //                 if (foundOne) {
    //                     console.log("valid user");

    //                     next()
    //                 } else {
    //                     console.log("Unvalid User");
    //                     res.redirect("/");
    //                 }
    //             } else {
    //                 console.log(error);
    //             }
    //         })
    //     } else {
    //         console.log("User not valid no JWT");
    //         console.log(err);
    //     }
    // });

}

module.exports = authMiddleware;