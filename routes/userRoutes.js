const express = require("express");
const { getTurfsByLocation, getTurfById, getAllTurfs, searchTurfs,
    createBooking, addContact, getAvailableSlots } = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/turfs", getTurfsByLocation);
router.get("/turfs/:id", getTurfById);

/**
 * @swagger
 * /user/getallturfs:
 *   get:
 *     summary: Get all turfs by user
 *     tags: [Users]
 *     responses:
 *       200 :
 *         description: List of turfs
 *       500 :
 *         description : error with reason
 */

router.get("/getallturfs", getAllTurfs);

router.get("/searchTurfs", searchTurfs);

// /**
//  * @swagger
//  * /user/booking:
//  *   post:
//  *     tags: [Users]
//  *     summary: Turf booking
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             - $ref: '#/components/schemas/Booking'
//  *     responses:
//  *       201:
//  *         description: book successfully
//  *       500:
//  *         description: Server error
//  */

/**
 * @swagger
 * /user/booking:
 *   post:
 *     tags: [Users]
 *     summary: Create a new booking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               turfId:
 *                 type: string
 *               userDetails:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   email:
 *                     type: string
 *               bookingDetails:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                   timeSlots:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         startTime:
 *                           type: string
 *                         endTime:
 *                           type: string
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       500:
 *         description: Internal server error
 */


router.post("/booking", createBooking);

/**
 * @swagger
 * /user/contact:
 *   post:
 *     tags: [Users]
 *     summary: send message to admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       201:
 *         description: Message send successfully
 *       500:
 *         description: Server error
 */

router.post("/contact", addContact);

router.get('/availableSlots/:turfId', auth, getAvailableSlots);

module.exports = router;
