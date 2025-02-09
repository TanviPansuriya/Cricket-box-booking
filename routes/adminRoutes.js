const express = require('express');
const router = express.Router();
const { login, addTurf,getAllTurfsByAdmin,getAdminTurfs,getTurfById ,updateTurf, deleteTurf,getAllBookings,getBookingsForAdminTurf} = require("../controllers/adminController");
const auth = require("../middleware/authMiddleware");
const upload=require("../middleware/multer")

router.post('/login', login);

router.post('/add-turf', auth,upload.single("image"), addTurf);
router.get('/my-turfs',auth, getAllTurfsByAdmin);
router.patch('/:id', auth, updateTurf);
router.delete('/:id', auth, deleteTurf);
router.get('/get-bookings', auth, getAllBookings);

module.exports = router;

