const router = require('express').Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const user = require('../controller/user');
require('dotenv').config();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
const mailgun = require("mailgun-js");
const randomstring = require('randomstring');
const DOMAIN = 'sandbox3d2875b59cb54405990427ce10fdc2de.mailgun.org';
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });


router.post(
    '/createNew', [
        //check not empty fields
        check('username').not().isEmpty().trim().escape(),
        check('password').not().isEmpty().trim().escape(),
        check('email').isEmail().normalizeEmail()
    ],
    function(req, res) {
        //console.log(req.body);
        //const { name, email, password, repwd, singup } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                status: false,
                message: 'Form validation error.',
                errors: errors.array()
            });
        }
        // user.findOne({ email }).exec((err, User) => {
        //     if (user) {
        //         return res.json({error:'user already exits'});
        //     }
        // });
        //const token = jwt.sign({ name, email, password }, process.env.JwT_ACTIVATION, { expiresIn: '20m' });

        const secretToken = randomstring.generate();
        console.log('secretToken', secretToken);
        const msg = {
            to: req.body.email,
            from: 'bpavan0123@help.com',
            subject: 'signup Verification',
            html: `<h1>Thankyou for  using</h1>
                   <h5>enter thekey:<strong> ${secretToken}  </strong</h5><br/>
                   <a href="http://localhost:3000/auth">Click here to verify</a>`

        };
        mg.messages()
            .send(msg, function(error, body) {
                if (error) {
                    return res.json({
                        message: error.message
                    });
                }
                // console.log(body);
                console.log('Email sent');
                //const { username,email,password } = decodedToken;
                const hashedPassword = bcrypt.hashSync(req.body.password, 10);
                var temp = new user({
                    username: req.body.username,
                    email: req.body.email,
                    password: hashedPassword,
                    token: secretToken
                });
                temp.save(function(error, result) {
                    if (error) {
                        return res.json({
                            status: false,
                            message: 'DB connection fail',
                            error: error
                        });
                    }
                    return res.status(400).json({ message: 'email has been sent to u r account kindly activate it' });

                });
                //return res.status(400).json({ message: 'email has been sent to u r account kindly activate it' });
            });
    }
);
module.exports = router;