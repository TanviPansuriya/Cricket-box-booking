const express = require('express');
const router = express.Router();
const { login, addTurf, getAllTurfsByAdmin, getTurfById, searchTurfs, updateTurf,
     deleteTurf, getAllBookings, documents,totalTurfs,totalBookings } = require("../controllers/adminController");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/multer")

router.post('/login', login);

router.post('/add-turf', auth, upload.single("image"), addTurf);
router.get('/my-turfs', auth, getAllTurfsByAdmin);
router.get('/turfs/:id', auth, getTurfById);
router.get('/searchTurfs', auth, searchTurfs);
router.patch('/:id', auth, updateTurf);
router.delete('/:id', auth, deleteTurf);
router.get('/get-bookings', auth, getAllBookings);
router.get('/turfs', auth, documents);
router.get('/totalTurfs', auth, totalTurfs);
router.get('/totalBookings', auth, totalBookings);

module.exports = router;

