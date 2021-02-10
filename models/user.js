//init
const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    token: {
        type: String,
        require: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdOn: {
        type: Date,
        default: Date.now()
    }
});
//user model
mongoose.model('users', userSchema);
//Export module
module.exports = mongoose.model('users');











// const mongoose = require('mongoose');
// const userSchema = mongoose.Schema({
//     username: {
//         type: String,
//         require: true
//     },
//     email: {
//         type: String,
//         require: true
//     },
//     password: {
//         type: String,
//         require: true
//     },
//     isActive: {
//         type: Boolean,
//         require: true
//     },
//     createdON: {
//         type: Date,
//         require: Date.now()
//     },
// });


// mongoose.model('users', userSchema);

// module.exports = mongoose.model('users');



// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({
//     email: {
//         type: String,
//         required: true,
//     },
//     username: {
//         type: String,
//         required: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     }

// });

// module.exports = new mongoose.model("User", UserSchema);
// module.exports = mongoose.model('User');