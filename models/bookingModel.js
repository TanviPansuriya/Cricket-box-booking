const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
    {
        turfId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Turf",
            required: true,
        },
        userDetails: {
            name: { type: String, required:[true,"Name is required"] },
            phone: {
                type: String,
                required: true,
                match: [/^\d{10}$/, "Invalid phone number format. Must be exactly 10 digits"]
            },
            email: {
                type:String,
                unique: [true, "email already exists"],
                required: [true, "email is required"],
                match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format"]
            },
        },
        bookingDetails: {
            date: { type: String, required: true },
            timeSlots: [{
                startTime: { type: String, required: [true, "Time is required"] },
                endTime: { type: String, required: [true, "Time is required"]},
                price: { type: String,required: [true, "Price is required"] },
            }],
        },
        status: {
            type: String,
            enum: ["Pending", "Confirmed", "Cancelled"],
            default: "Pending",
        },
    }, {
    timestamps: true
});

const Booking = mongoose.model('Booking', BookingSchema);
module.exports = Booking;