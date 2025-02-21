const express = require("express");
const { getTurfsByLocation, getTurfById, getAllTurfs, searchTurfs,
    createBooking, addContact, getAvailableSlots} = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/turfs", getTurfsByLocation);
router.get("/turfs/:id", getTurfById);
router.get("/getallturfs", getAllTurfs);
router.get("/searchTurfs", searchTurfs);
router.post("/booking", createBooking);
router.post("/contact", addContact);
router.get('/availableSlots/:turfId', auth, getAvailableSlots);

module.exports = router;
