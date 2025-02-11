const mongoose = require('mongoose');

const turfSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Name is required"]
    },
    location: {
        type: String,
        trim: true,
        required: [true, "Location is required"]
    },
    price: {
        type: String,
        required: [true, "Price is required"]
    },
    time: {
        type: [String],
        required: [true, "Time is required"]
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
    },
    image: {
        type: String,
        required: [true, "Image is required"]
    },
}, {
    timestamps: true
});

const Turf = mongoose.model('Turf', turfSchema);
module.exports = Turf;
