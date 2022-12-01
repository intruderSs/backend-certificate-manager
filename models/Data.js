const mongoose = require("mongoose");

const date = new Date();
let day = date.getDate();
let month = date.getMonth();
let year = date.getFullYear();
let currentDate = `${year}-${month}-${day}`;
console.log(currentDate);

const DataSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    name: {
        type: String,
    },
    email: {
        type: String
    },
    CSP: {
        type: String
    },
    certification_name: {
        type: String
    },
    certification_level: {
        type: String
    },
    certification_id: {
        type: String,
        unique: true
    },
    date_of_certification: {
        type: Date,
        default: Date.now
    },
    date_of_expiry: {
        type: Date,
        default: Date.now
    },
    validity: {
        type: Number
    }
})

const Data = mongoose.model('user-data', DataSchema);

module.exports = Data;