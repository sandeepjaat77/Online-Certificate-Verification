const mongoose = require("mongoose");

const connectDB = () => {
    mongoose
        .connect("mongodb://127.0.0.1:27017/online-certificate-verification-system")
        .then(() => {
            console.log("MongoDB Connected Successfully");
        })
        .catch((error) => {
            console.log("MongoDB Connection Failed");
            console.log(error.message);
        });
};

module.exports = connectDB;