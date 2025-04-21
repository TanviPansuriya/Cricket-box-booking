const mongoose = require("mongoose");


// /**
//  * @swagger
//  *  components:
//  *    examples :
//  *      booking :
//  *          value :
//  *            id : turfid
//  *            userdetails :
//  *               name : name,
//  *               email : email,
//  *               phone : phone,
//  *            bookingDetails : 
//  *               date : date,
//  *               timeSlots : 
//  *                   tartTime : startTime,
//  *                   endTime : endTime,
//  *                   price : price,
//  *            status:status
//  *       
//  */


/**
 * @swagger
 * components:
 *   schemas:
 *     TimeSlot:
 *       type: object
 *       properties:
 *         startTime:
 *           type: string
 *         endTime:
 *           type: string
 *         price:
 *           type: string
 *
 *     UserDetails:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         phone:
 *           type: string
 *         email:
 *           type: string
 *
 *     BookingDetails:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *         timeSlots:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TimeSlot'
 *
 *     Booking:
 *       type: object
 *       properties:
 *         turfId:
 *           type: string
 *         userDetails:
 *           $ref: '#/components/schemas/UserDetails'
 *         bookingDetails:
 *           $ref: '#/components/schemas/BookingDetails'
 */


const BookingSchema = new mongoose.Schema(
    {
        turfId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Turf",
            required: true,
        },
        userDetails: {
            name: { type: String, required: [true, "Name is required"] },
            phone: {
                type: String,
                required: true,
                match: [/^\d{10}$/, "Invalid phone number format. Must be exactly 10 digits"]
            },
            email: {
                type: String,
                unique: [true, "email already exists"],
                required: [true, "email is required"],
                match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format"]
            },
        },
        bookingDetails: {
            date: { type: String, required: true },
            timeSlots: [{
                startTime: { type: String, required: [true, "Time is required"] },
                endTime: { type: String, required: [true, "Time is required"] },
                price: { type: String, required: [true, "Price is required"] },
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