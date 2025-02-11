const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    turfId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Turf",
        required: [true, "TurfId is required"]
    },
    userPhone: {
        type: String,
        required: true,
        unique:[true, "Phone number is already in use."],
        match: [/^\d{10}$/, "Invalid phone number format. Must be exactly 10 digits"]
    },
    userEmail: {
        type: String,
        unique: [true, "email already exists"],
        required: [true, "email is required"],
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format"]
    },
    slot: {
        type: String,
        required: [true, "slot is required"]
    },
    date: {
        type: String,
        required:[true, "date is required"]
    },
    status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending"
    },
}, {
    timestamps: true
});

const Booking = mongoose.model('Booking', BookingSchema);
module.exports = Booking;
