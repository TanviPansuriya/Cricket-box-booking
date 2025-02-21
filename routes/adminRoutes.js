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





// const express = require("express");
// const {
//   getAllTurfs,
//   getTurfById,
//   createTurf,
//   updateTurf,
//   deleteTurf,
// } = require("../controllers/turfController");

// const router = express.Router();

// router.get("/", getAllTurfs);        // Get all turfs
// router.get("/:id", getTurfById);      // Get a single turf by ID
// router.post("/", createTurf);         // Create a new turf
// router.put("/:id", updateTurf);       // Update a turf
// router.delete("/:id", deleteTurf);    // Delete a turf

// // module.exports = router;


// {
//      "name": "Green Field Turf",
//      "location": { "lat": 19.076, "lng": 72.8777 },
//      "googleMapLink": "https://goo.gl/maps/example",
//      "address1": "123 Sports Complex",
//      "address2": "Near City Park",
//      "city": "Mumbai",
//      "landmark": "Opposite Metro Station",
//      "zipcode": "400001",
//      "images": ["https://example.com/turf1.jpg", "https://example.com/turf2.jpg"],
//      "contact": { "phone": "+91 9876543210", "email": "contact@turf.com" },
//      "timeSlots": [
//        { "startTime": "06:00", "endTime": "08:00", "price": 500 },
//        { "startTime": "08:00", "endTime": "10:00", "price": 700 }
//      ]
//    }
   