const mongoose = require('mongoose');

// /**
//  * @swagger
//  *  components:
//  *    examples :
//  *      turf :
//  *          value :
//  *            name : name
//  *            location :
//  *               lat : lat,
//  *               lng : lng,
//  *            address1 : address1
//  *            address2 : address2
//  *            city : city
//  *            landmark : landmark
//  *            zipcode :  zipcode
//  *            contactDetails :
//  *               phone : phone,
//  *               email : email,
//  *            timeSlots :
//  *               startTime : startTime,
//  *               endTime : endTime,
//  *            admin :  admin id
//  *            images :  [images]
//  *       
//  */

/**
 * @swagger
 * components:
 *   schemas:
 *     Turf:
 *       type: object
 *       required: true
 *       properties:
 *         name:
 *           type: string
 *         location:
 *           type: object
 *           properties:
 *             lat:
 *               type: string
 *             lng:
 *               type: string
 *         address1:
 *           type: string
 *         address2:
 *           type: string
 *         city:
 *           type: string
 *         landmark:
 *           type: string
 *         zipcode:
 *           type: string
 *         contactDetails:
 *           type: object
 *           properties:
 *             phone:
 *               type: string
 *             email:
 *               type: string
 *         timeSlots:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               price:
 *                 type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 *         admin:
 *           type: string
 */

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
            required: true,
            unique: false,
            match: [/^\d{10}$/, "Phone number must be 10 digits"]
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: false,
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
    images: {
        type: [String],
        required: [true, "Image is required"]
    },
}, {
    timestamps: true
});

const Turf = mongoose.model('Turf', turfSchema);
module.exports = Turf;
