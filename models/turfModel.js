const mongoose = require('mongoose');

// const turfSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         trim: true,
//         required: [true, "Name is required"]
//     },
//     location: {
//         type: String,
//         trim: true,
//         required: [true, "Location is required"]
//     },
//     price: {
//         type: String,
//         required: [true, "Price is required"]
//     },
//     time: {
//         type: [String],
//         required: [true, "Time is required"]
//     },
//     admin: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Admin',
//     },
//     image: {
//         type: String,
//         required: [true, "Image is required"]
//     },
// }, {
//     timestamps: true
// });

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
            unique: [true, "email already exists"],
            required: [true, "email is required"],
            match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format"]
        },
    },
    timeSlot: {
        startTime: { type: String, required: [true, "Time is required"] },
        endTime: { type: String, required: [true, "Time is required"] },
        price: { type: String, required: [true, "Price is required"] },
    },
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










// const turfSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     location: {
//       lat: { type: Number, required: true },
//       lng: { type: Number, required: true },
//     },
//     googleMapLink: { type: String, required: true },
//     address1: { type: String, required: true },
//     address2: { type: String, default: "" },
//     city: { type: String, required: true },
//     landmark: { type: String, default: "" },
//     zipcode: { type: String, required: true },
//     images: [{ type: String }], // List of image URLs
//     contact: {
//       phone: { type: String, required: true },
//       email: { type: String, required: true },
//     },
//     timeSlots: [
//       {
//         startTime: { type: String, required: true },
//         endTime: { type: String, required: true },
//         price: { type: Number, required: true },
//       },
//     ],
//   },
//   { timestamps: true }
// );

