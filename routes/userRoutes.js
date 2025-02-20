const express = require("express");
const { getTurfsByLocation,getTurfById, getAllTurfs,searchTurfs,createBooking,addContact,availableSlots} = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/turfs", getTurfsByLocation);
router.get("/turfs/:id", getTurfById);
router.get("/getallturfs", getAllTurfs);
router.get("/searchTurfs", searchTurfs);


router.post("/booking", createBooking);
// router.post("/:turfId/available-slots", availableSlots);
router.post("/contact", addContact);
// router.post("/availableTurfs", availableTurfs);

module.exports = router;
