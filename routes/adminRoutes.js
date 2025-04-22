const express = require('express');
const router = express.Router();
const { login, addTurf, getAllTurfsByAdmin, getTurfById, searchTurfs, updateTurf,
     deleteTurf, getAllBookings, documents, totalTurfs, totalBookings, getAllTimeSlots } = require("../controllers/adminController");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/multer")


// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *      Admin:
//  *       type: object
//  *       required: true
//  *       properties:
//  *         name:
//  *           type: string
//  *           description: Full name of the user
//  *         email:
//  *           type: string
//  *           description: Email of the user
//  *         password:
//  *           type: string
//  *           description: Password for the account
//  */

/**
 * @swagger
 * /admin/login:
 *   post:
 *     tags: [Admin]
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 *      
 */

router.post('/login', login);

// /**
//  * @swagger
//  * /admin/add-turf:
//  *   post:
//  *     tags: [Turfs]
//  *     summary: Add a new turf
//  *     security:
//  *       - jwt: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             $ref: '#/components/examples/turf'
//  *     responses:
//  *       201:
//  *         description: Turf added successfully
//  *       500:
//  *         description: Server error
//  */


/**
 * @swagger
 * /admin/add-turf:
 *   post:
 *     tags: [Turfs]
 *     summary: "Add a new Turf"
 *     security:
 *       - jwt: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *               - address1
 *               - city
 *               - zipcode
 *               - contactDetails
 *               - timeSlots
 *               - images
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: string
 *                   lng:
 *                     type: string
 *               address1:
 *                 type: string
 *               address2:
 *                 type: string
 *               city:
 *                 type: string
 *               landmark:
 *                 type: string
 *               zipcode:
 *                 type: string
 *               contactDetails:
 *                 type: object
 *                 properties:
 *                   phone:
 *                     type: string
 *                   email:
 *                     type: string
 *               timeSlots:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     startTime:
 *                       type: string
 *                     endTime:
 *                       type: string
 *                     price:
 *                       type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201 :
 *         description: Turf Added Successfully
 *       500 :
 *         description: Internal Server Error
 */

router.post('/add-turf', auth, upload.array('images', 5), addTurf);

/**
 * @swagger
 * /admin/my-turfs:
 *   get:
 *     summary: Get all turfs by admin
 *     tags: [Admin]
 *     security:
 *       - jwt: []
 *     responses:
 *       200 :
 *         description: List of turfs
 *       500 :
 *         description : error with reason
 */

router.get('/my-turfs', auth, getAllTurfsByAdmin);

// /**
//  * @swagger
//  * /admin/turf/{id}:
//  *   get:
//  *     tags: [Turfs]
//  *     summary: Get turf by ID
//  *     security:
//  *       - jwt: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Turf ID
//  *     responses:
//  *       200:
//  *         description: Turf details
//  *       404:
//  *         description: Turf not found
//  */

router.get('/turfs/:id', auth, getTurfById);

// /**
//  * @swagger
//  * /admin/search:
//  *   get:
//  *     tags: [Admin]
//  *     summary: Search turfs by turf name or admin name
//  *     parameters:
//  *       - in: query
//  *         name: turfName
//  *         schema:
//  *           type: string
//  *         description: Turf name
//  *       - in: query
//  *         name: name
//  *         schema:
//  *           type: string
//  *         description: Admin name
//  *     responses:
//  *       200:
//  *         description: List of matched turfs
//  *       404:
//  *         description: No turfs found
//  */

router.get('/searchTurfs', auth, searchTurfs);


// /**
//  * @swagger
//  * /update-turf/{id}:
//  *   put:
//  *     summary: Update turf details
//  *     tags:
//  *       - Turfs
//  *     security:
//  *       - jwt: []
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         required: true
//  *         description: Turf ID to update
//  *         schema:
//  *           type: string
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *               location.lat:
//  *                 type: string
//  *               location.lng:
//  *                 type: string
//  *               address1:
//  *                 type: string
//  *               address2:
//  *                 type: string
//  *               city:
//  *                 type: string
//  *               landmark:
//  *                 type: string
//  *               zipcode:
//  *                 type: string
//  *               contactDetails.phone:
//  *                 type: string
//  *               contactDetails.email:
//  *                 type: string
//  *               timeSlots:
//  *                 type: array
//  *                 items:
//  *                   type: object
//  *                   properties:
//  *                     startTime:
//  *                       type: string
//  *                     endTime:
//  *                       type: string
//  *                     price:
//  *                       type: string
//  *               images:
//  *                 type: array
//  *                 items:
//  *                   type: string
//  *                   format: binary
//  *     responses:
//  *       200:
//  *         description: Turf updated successfully
//  *       400:
//  *         description: Bad Request
//  *       404:
//  *         description: Turf not found
//  */

/**
 * @swagger
 * /admin/update-turf/{id}:
 *   patch:
 *     tags:
 *       - Turfs
 *     summary: update turf 
 *     security:
 *       - jwt: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Turf ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location.lat:
 *                 type: string
 *               location.lng:
 *                 type: string
 *               address1:
 *                 type: string
 *               address2:
 *                 type: string
 *               city:
 *                 type: string
 *               landmark:
 *                 type: string
 *               zipcode:
 *                 type: string
 *               contactDetails.phone:
 *                 type: string
 *               contactDetails.email:
 *                 type: string
 *               timeSlots:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     startTime:
 *                       type: string
 *                     endTime:
 *                       type: string
 *                     price:
 *                       type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Turf updated successfully
 *       404:
 *         description: Turf not found
 *       400:
 *         description: Bad Request
 */


router.patch('/update-turf/:id', auth, upload.array('images', 5), updateTurf);

/**
 * @swagger
 * /admin/{id}:
 *   delete:
 *     tags: [Turfs]
 *     summary: Delete turf
 *     security:
 *       - jwt : []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Turf ID
 *     responses:
 *       200:
 *         description: Turf deleted successfully
 *       404:
 *         description: Turf not found
 */

router.delete('/:id', auth, deleteTurf);

/**
 * @swagger
 * /admin/get-bookings:
 *   get:
 *     summary: Get all bookings for admin turfs
 *     tags: [Admin]
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: List of bookings
 *       404:
 *         description: No bookings found
 */

router.get('/get-bookings', auth, getAllBookings);

// /**
//  * @swagger
//  * /admin/documents:
//  *   get:
//  *     summary: Get paginated turfs
//  *     tags: [Admin]
//  *     parameters:
//  *       - in: query
//  *         name: page
//  *         schema:
//  *           type: integer
//  *       - in: query
//  *         name: limit
//  *         schema:
//  *           type: integer
//  *     responses:
//  *       200:
//  *         description: Paginated turfs
//  */

router.get('/turfs', auth, documents);

router.get('/totalTurfs', auth, totalTurfs);

router.get('/totalBookings', auth, totalBookings);

// /**
//  * @swagger
//  * /admin/turf/{turfId}/timeslots:
//  *   get:
//  *     summary: Get all time slots for a turf
//  *     tags: [Admin]
//  *     parameters:
//  *       - in: path
//  *         name: turfId
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Time slots fetched
//  */

router.get('/getAllTimeSlots/:turfId', auth, getAllTimeSlots);

module.exports = router;