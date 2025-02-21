const express = require('express');
const router = express.Router();
const { login, addTurf, getAllTurfsByAdmin, getTurfById, searchTurfs, updateTurf,
     deleteTurf, getAllBookings, documents,totalTurfs,totalBookings ,getAllTimeSlots} = require("../controllers/adminController");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/multer")

router.post('/login', login);

router.post('/add-turf', auth, upload.array("images",5), addTurf);
router.get('/my-turfs', auth, getAllTurfsByAdmin);
router.get('/turfs/:id', auth, getTurfById);
router.get('/searchTurfs', auth, searchTurfs);
router.put('/update-turf/:id',auth, upload.single('image'), updateTurf);

router.delete('/:id', auth, deleteTurf);
router.get('/get-bookings', auth, getAllBookings);
router.get('/turfs', auth, documents);
router.get('/totalTurfs', auth, totalTurfs);
router.get('/totalBookings', auth, totalBookings);
router.get('/getAllTimeSlots/:turfId', auth, getAllTimeSlots);

module.exports = router;