const mongoose = require('mongoose');

const turfSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Name is required"]
    },
    location: {
        lat: { type: String, required: true },
        lng: { type: String, required: [true, "Location is required"] }
    },
    address1: {
        type: String,
        required: [true, "Address is required"]
    },
    address2: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        required: [true, "city is required"]
    },
    landmark: {
        type: String,
        default: ""
    },
    zipcode: {
        type: String,
        required: [true, "zipcode is required"]
    },
    contactDetails: {
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            // required: [true, "email is required"],
            match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format"]
        },
    },
    timeSlots: [{
        startTime: { type: String, required: [true, "Time is required"] },
        endTime: { type: String, required: [true, "Time is required"] },
        price: { type: String, required: [true, "Price is required"] },
    }],
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
    },
    images:{
        type:[String],
        required: [true, "Image is required"]
    },
}, {
    timestamps: true
});

const Turf = mongoose.model('Turf', turfSchema);
module.exports = Turf;