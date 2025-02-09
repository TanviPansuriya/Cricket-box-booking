const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/Cricket_Box_Booking").then(() =>
    console.log("Connection successfully...")
).catch((err) =>
    console.log("Eroor..." + err)
);

module.exports = mongoose;