const express = require("express");
const { getTurfsByLocation, getAllTurfs,searchTurfs,createBooking} = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/turfs", getTurfsByLocation);
router.get("/getallturfs", getAllTurfs);
router.get("/searchTurfs", searchTurfs);
router.post("/booking", createBooking);

module.exports = router;
