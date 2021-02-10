const router = require('express').Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const user = require('../controller/user');
//middleware setup
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
//router goes here
router.all(
    '/',
    function(req, res) {
        return res.json({
            status: true,
            message: 'User controller working..'
        });
    }
);
//create new user

//find the documents from database
router.get(
    '/allData',
    function(req, res) {
        user.find(function(error, result) {
            if (error) {
                return res.json({
                    status: false,
                    message: 'Data is not found',
                    error: error
                });
            }
            //ok
            return res.json({
                status: true,
                message: 'Success..',
                result: result
            });
        });
    }
);
router.put(
    '/update/:email',
    function(req, res) {
        if (req.params.email) {
            user.updateOne({ email: req.params.email }, { $set: { username: req.body.username, password: req.body.password } }, function(error, result) {
                if (error) {
                    return res.json({
                        status: false,
                        message: 'Data is not found',
                        error: error
                    });
                }
                //ok
                return res.json({
                    status: true,
                    message: 'Success..',
                    result: result
                });
            });
        } else {
            //ok
            return res.json({
                status: false,
                message: 'Email is not found...'
            });
        }
    }
);

module.exports = router;