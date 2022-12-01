const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const Data = require("../models/Data");
const { body, validationResult } = require('express-validator');


///get all the certification data
router.get('/fetchdata', fetchUser, async (req, res) => {
    
    try {
        const data = await Data.find({user: req.user.id});
    res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }

    
})

////add a new certificate data
router.post('/adddata', fetchUser, [
    body('CSP', "Please select atleast one from the dropdown").not(),
    body('certification_name', "Enter a valid name").isLength({min: 3}),
    body('certification_level', 'Please enter a valid input').isLength({min: 3}),
    body('certification_id', "Please enter a valid id").isLength({min: 3}),
    body('validity', "Please enter a valid number").isNumeric()
], async (req, res) => {

    try {
        const {CSP, 
            certification_name, 
            certification_level, 
            certification_id, 
            date_of_certification,
            date_of_expiry,
            validity
        } = req.body;
    
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        let findData = await  Data.findOne({certification_id});
        if (findData) {
            return res.status(400).json({error: "This certificate is already registered here"});
           }
           const newData = {CSP,
            certification_name, 
            certification_level, 
            certification_id, 
            date_of_certification: new Date(date_of_certification), 
            date_of_expiry: new Date(date_of_expiry),
            validity,
            user: req.user.id}
            console.log("checkiung", typeof newData.date_of_certification);
        const data = new Data(newData);
        
        const savedData = await data.save();
        res.json(savedData);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }

})


////////update route
router.put('/updatenote/:id', fetchUser, async (req, res) => {
    const {CSP, 
        certification_name, 
        certification_level, 
        certification_id, 
        date_of_certification,
        date_of_expiry,
        validity
    } = req.body;

    try {
        const newData = {};
    if(CSP){newData.CSP = CSP};
    if(certification_name){newData.certification_name = certification_name};
    if(certification_level){newData.certification_level = certification_level};
    if(certification_id){newData.certification_id = certification_id};
    if(date_of_certification){newData.date_of_certification = date_of_certification};
    if(date_of_expiry){newData.date_of_expiry = date_of_expiry};
    if(validity){newData.validity = validity};

    let data = await Data.findById(req.params.id);
    if(!data) {
        return res.status(404).send("Not Found");
    }
    if(data.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }

    data = await Data.findByIdAndUpdate(req.params.id, {$set: newData}, {new:true});
    res.json(data); 
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
    ///create a new data object
})


////////delete route
router.delete('/deletedata/:id', fetchUser, async (req, res) => {

    try {
        let data = await Data.findById(req.params.id);
        if(!data) {
            return res.status(404).send("Not Found");
        }
        if(data.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
        }
    
        data = await Data.findByIdAndDelete(req.params.id);
        res.json({"Success": "Certificate has been deleted", data: data});  
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
    
})

module.exports = router;