const express = require("express");
const mongoose = require('mongoose');
const assert = require('assert');
var cors = require('cors');
require('dotenv').config();
const morgan = require("morgan");
const db_url = process.env.DB_URL;
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const cookieSession = require("cookie-session");

const authenticateUser = require("./middleWares/authenticateUser");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(morgan("dev"));





mongoose.connect(
    db_url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    },
    function(error, link) {
        //check error
        assert.equal(error, null, 'DB connection fail');
        //ok
        console.log('connection successful');


    }
);

// mongodb cloud connection is here
mongoose
    .connect("mongodb://localhost:27017/databaseName", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => {
        console.log("connected to mongodb cloud! :)");
    })
    .catch((err) => {
        console.log(err);
    });

// middleWares
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// cookie session
app.use(
    cookieSession({
        keys: ["randomStringASy"],
    })
);

// route for serving frontend files
app
    .get("/", (req, res) => {
        res.render("index");
    })
    .get("/login", (req, res) => {
        res.render("login");
    })
    .get("/register", (req, res) => {
        res.render("register");
    })
    .get("/delete", function(req, res) {

        res.render("delete");

    }).get("/edit", function(req, res) {

        res.render("edit", { user: req.session.user });

    })

.get("/home", authenticateUser, (req, res) => {
    res.render("home", { user: req.session.user });
});

app.get("/create", function(req, res) {
    res.render("create");
});
// route for handling post requires
app
    .post("/login", async(req, res) => {
        const { email, password, username } = req.body;

        // check for missing fields
        if (!email || !password) {
            res.send("Please enter all the fields");
            return;
        }

        const doesUserExits = await User.findOne({ email });

        if (!doesUserExits) {
            res.send("invalid username or password");
            return;
        }

        const doesPasswordMatch = await bcrypt.compare(
            password,
            doesUserExits.password
        );

        if (!doesPasswordMatch) {
            res.send("invalid username or password");
            return;
        }

        // else he\s logged in
        req.session.user = {
            email,
            username,
        };

        res.redirect("/home");
    });

app.post("/register", async(req, res) => {
    const { email, username, password } = req.body;

    // check for missing fields
    if (!email || !password) {
        res.send("Please enter all the fields");
        return;
    }

    const doesUserExitsAlready = await User.findOne({ email });

    if (doesUserExitsAlready) {
        res.send("A user with that email already exits please try another one!");
        return;
    }

    // lets hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    const latestUser = new User({ email, username, password: hashedPassword });

    latestUser
        .save()
        .then(() => {
            return res.redirect("/home");

        })
        .catch((err) => console.log(err));
});

//logout
app.get("/logout", authenticateUser, (req, res) => {
    req.session.user = null;
    res.redirect("/login");
});



app.listen(3000);













// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const morgan = require('morgan');

// const app = express();
// const port = process.env.PORT;
// const database = require('./database');
// const userController = require('./controller/user');

// app.use(morgan('dev'));

// app.use(cors());

// app.use('/api/user', userController);


// app.all(
//     '/',
//     function(req, res) {
//         return res.json({
//             status: true,
//             message: 'Index page working....'
//         });
//     }
// );

// app.listen(port,
//     function() {

//         console.log('server running in port:' + port);

//     });







// const express = require("express");
// const mongoose = require("mongoose");
// const cookieSession = require("cookie-session");
// const bcrypt = require("bcrypt");

// const port = process.env.PORT;

// const database = require('./database');

// const userController = require('./controllers/user');

// const User = require("./models/user");

// const authenticateUser = require("./middleWares/authenticateUser");
// const app = express();

// const url = process.env.DB_URL;
// const dotenv = require("dotenv");

// dotenv.config();
// const cors = require('cors');
// const morgan = require('morgan');

// app.use(morgan('dev'));

// app.use(cors());

// app.use('/api/user', userController);


// app.all(
//     '/',
//     function(req, res) {
//         return res.json({
//             status: true,
//             message: 'Index page working....'
//         });
//     }
// );

// app.listen(port,
//     function() {

//         console.log('server running in port:' + port);

//     });
// mongodb cloud connection is here
// mongoose
//     .connect("mongodb://localhost:27017/databaseName", {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useCreateIndex: true,
//         useFindAndModify: false,
//     })
//     .then(() => {
//         console.log("connected to mongodb cloud! :)");
//     })
//     .catch((err) => {
//         console.log(err);
//     });

// // middleWares
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static("public"));
// app.set("view engine", "ejs");

// // cookie session
// app.use(
//     cookieSession({
//         keys: ["randomStringASy"],
//     })
// );

// route for serving frontend files
// app
//     .get("/", (req, res) => {
//         res.render("index");
//     })
//     .get("/login", (req, res) => {
//         res.render("login");
//     })
//     .get("/register", (req, res) => {
//         res.render("register");
//     })
//     .get("/delete", function(req, res) {

//         res.render("delete");

//     }).get("/edit", function(req, res) {

//         res.render("edit", { user: req.session.user });

//     })

// .get("/home", authenticateUser, (req, res) => {
//     res.render("home", { user: req.session.user });
// });

// app.get("/create", function(req, res) {
//     res.render("create");
// });
// // route for handling post requires
// app
//     .post("/login", async(req, res) => {
//         const { email, password } = req.body;

//         // check for missing fields
//         if (!email || !password) {
//             res.send("Please enter all the fields");
//             return;
//         }

//         const doesUserExits = await User.findOne({ email });

//         if (!doesUserExits) {
//             res.send("invalid username or password");
//             return;
//         }

//         const doesPasswordMatch = await bcrypt.compare(
//             password,
//             doesUserExits.password
//         );

//         if (!doesPasswordMatch) {
//             res.send("invalid username or password");
//             return;
//         }

//         // else he\s logged in
//         req.session.user = {
//             email,
//         };

//         res.redirect("/home");
//     });

// app.post("/register", async(req, res) => {
//     const { email, username, password } = req.body;

//     // check for missing fields
//     if (!email || !password) {
//         res.send("Please enter all the fields");
//         return;
//     }

//     const doesUserExitsAlready = await User.findOne({ email });

//     if (doesUserExitsAlready) {
//         res.send("A user with that email already exits please try another one!");
//         return;
//     }

//     // lets hash the password
//     const hashedPassword = await bcrypt.hash(password, 12);
//     const latestUser = new User({ email, username, password: hashedPassword });

//     latestUser
//         .save()
//         .then(() => {
//             return res.redirect("/home");

//         })
//         .catch((err) => console.log(err));
// });

// //logout
// app.get("/logout", authenticateUser, (req, res) => {
//     req.session.user = null;
//     res.redirect("/login");
// });


// const PORT = 3000;
// server config
// app.listen(PORT, () => {
//     console.log(`Server started listening on port: ${PORT}`);
// });

// app.listen(port,
//     function() {

//         console.log('server running in port:' + port);

//     });

// const http = require('http');


// const server = http.createServer((req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-type', 'text/plain');
//     res.end('Hello world');
// });

// server.listen(port, (err) => {
//     // err handling
//     console.log('server started on port: ' + port);
// });

// app.listen(port, (err) => {
//     console.log('server started on port: ' + port);
// });