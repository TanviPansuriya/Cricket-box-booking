const express = require('express');
const router = express.Router();
const { register, login, createAdmin, getAllAdmins, deleteAdmin ,searchAdmin,getContact} = require("../controllers/superAdminController");
const auth = require("../middleware/authMiddleware");

router.post('/register', register);
router.post('/login', login);
router.get('/getall-admin', getAllAdmins);

// for admin
router.post('/create-admin', createAdmin);
router.delete('/:id', deleteAdmin);
router.get('/search-admin', searchAdmin);
router.get('/contacts', getContact);

module.exports = router;


// const express = require("express");
// const {
//   getAllBookings,
//   getBookingById,
//   createBooking,
//   updateBookingStatus,
//   deleteBooking,
// } = require("../controllers/bookingController");

// const router = express.Router();

// router.get("/", getAllBookings);            // Get all bookings
// router.get("/:id", getBookingById);         // Get a single booking by ID
// router.post("/", createBooking);            // Create a new booking
// router.put("/:id/status", updateBookingStatus);  // Update booking status
// router.delete("/:id", deleteBooking);       // Delete a booking

// module.exports = router;
