const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require('../middleware/fetchUser');

const JWT_SECRET = "mynameisshahilsinha";

//this is not login this is only creating a user in mongodb

router.post('/createuser', [
    body('name', "Please enter a valid name").isLength({min: 3}),
    body('email', "Please enter a valid email").isEmail(),
    body('password', "Password should be atleast 8 characters long").isLength({min: 8})
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array()});
    }

    try {
        let user = await User.findOne({email: req.body.email});
        if (user) {
           return res.status(400).json({success, error: "Sorry, a user with this email already exist!"});
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt)


        ////creating an user
        user = await  User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
           });
           const data = {
            user:{
                id: user.id
            }
           }
           const authtoken = jwt.sign(data, JWT_SECRET);
           success = true;
           res.json({success, authtoken});
    } catch (error) {
        console.error(error);
        res.status(500).send("Some error occured");
    }
})

////user authenticaition using jwt
router.post('/login', [
    body('email', "Please enter a valid email").isEmail(),
    body('password', "Password should be atleast 8 characters long").exists(),
], async (req, res) => {
    let success = false;
  ///if there are errors return bad request and the error
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;

    try {
      
       let user = await User.findOne({email});
       if (!user) {
        success = false;
        return res.status(400).json({error: "Please try to login with correct credentials"});
       }
       const comparePassword = await bcrypt.compare(password, user.password);
       if(!comparePassword) {
        success = false;
        return res.status(400).json({error: "Please try to login with correct credentials"});
       }
       const data = {
        user:{
            id: user.id
        }
       }
       const authtoken = jwt.sign(data, JWT_SECRET);
       success = true;
       res.json({success, authtoken});

    } catch(error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }

})

///get logged in user details

router.post("/getuser", fetchuser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})


module.exports = router;