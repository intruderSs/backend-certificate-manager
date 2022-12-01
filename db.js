const mongoose = require("mongoose");

const mongoURI = "mongodb://0.0.0.0:27017/certificateDB";

const connectToMongo = () => {
    mongoose.connect(mongoURI, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Successfully connected to Mongo");
        }
    })
}

module.exports = connectToMongo;