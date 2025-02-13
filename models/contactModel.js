const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: [true, "Email already exists"],
        required: [true, "Email is required"],
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format"]
    },
    subject: {
        type: String,
        required: [true, "Subject is required"],
    },
    message: {
        type: String,
        required: [true, "Message is required"],
    },
}, {
    timestamps: true
});

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;   