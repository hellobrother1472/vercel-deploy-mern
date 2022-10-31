const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
require('dotenv').config();
const connectDB = require("./db/connectDB"); // Requiring the connect Db which is exported.
const bodyParser = require("body-parser"); // Don't include it in router files as it is a middleware and it will apply to all the calls here in app.js.
// const User = require("./model/User");
const authMiddleware = require("./middleware/authMiddleware");


const app = express();
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(require("./router/auth"));  // we link the router files to make our route easy
// app.use(require("./middleware/authMiddleware")); // This will apply middleware to every route

// Connection to DB
connectDB();

// app.use(function(req, res, next) {   // middleware used to remove the cors
//     res.header('Access-Control-Allow-Origin', '*'); 
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
//   });

// app.get("/",authMiddleware, (req, res) => {
//     // res.cookie("sample","sample text");
//     // console.log(req.token);
//     res.send(`This is Home page`);
// })

// app.get("/about", (req, res) => {
//     res.send(`This is about page`);
//     // res.send(`This is about page and value is ${req.cookies.sample} and ${req.cookies.jwt}`);
// })

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'), function (err) {
        if (err) {
            res.status(500).send(err)
        }
    })
})

// app.get("/register", (req, res) => {
//     res.send("This is register page");
// })

// app.get("/signin", (req, res) => {
//     res.send("This is signin page");
// })

// app.get("/signup", (req, res) => {
//     res.send("This is signup page");
// })

if (process.env.NODE_ENV === "production") {
    const path = require("path");
    app.get("/", (req, res) => {
        app.use(express.static(path.resolve(__dirname, 'client', 'build')));
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
    app.get("/contact", (req, res) => {
        app.use(express.static(path.resolve(__dirname, 'client', 'build')));
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}


let port = process.env.PORT;
if (port == null || port == "") {
    port = 5000;
}
app.listen(port, function () {
    console.log(`Server started successfully at ${port}`);
});

// app.listen(3000, () => {
//     console.log("Server is up and running on port 3000");
// })


// MiddleWare (It executes in the middle before taking the request or before everything on that route or the whole website depending on how you want to use it)
// middleware = (req, res, next) => {
//     console.log("I am under middleware");
//     if(a == 1){
//         next();
//     }else{
//         res.redirect("/about");
//     }
// }
// app.get("/", middleware, (req, res) => {
//     console.log("I am under request handler");
//     res.send("This is Home page");
// })