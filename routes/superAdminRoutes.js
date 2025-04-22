const express = require('express');
const router = express.Router();
const { register, login, createAdmin, getAllAdmins, deleteAdmin, searchAdmin, getContact } = require("../controllers/superAdminController");
const auth = require("../middleware/authMiddleware");


// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     Super Admin:
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

// /**
//  * @swagger
//  * /superAdmin/register:
//  *   post:
//  *     tags: [Super Admin]
//  *     summary: Create a new user
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/User'
//  *     responses:
//  *       201:
//  *         description: User successfully registered
//  *       409:
//  *         description: User already exists
//  *       500:
//  *         description: Internal server error
//  */

/**
 * @swagger
 * /superAdmin/register:
 *   post:
 *     tags: [Super Admin]
 *     summary: Register a new Super Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SuperAdmin'
 *     responses:
 *       201:
 *         description: Successfully registered
 *       400:
 *         description: Already exists
 *       500:
 *         description: Server error
 */

router.post('/register', register);


/**
 * @swagger
 * /superAdmin/login:
 *   post:
 *     tags: [Super Admin]
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
 *                 description: User's email
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       500 :
 *        description : internal server error with reason
 *      
 */

router.post('/login', login);

/**
 * @swagger
 * /superAdmin/getall-admin:
 *   get:
 *     tags: [Super Admin]
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Error while retrieving users
 *       500:
 *         description: Internal server error
 */


router.get('/getall-admin', getAllAdmins);


/**
 * @swagger
 * /superAdmin/create-admin:
 *   post:
 *     tags: [Super Admin]
 *     summary: Create a new admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Admin'
 *     responses:
 *       201:
 *         description: Admin created and email sent
 *       400:
 *         description: Admin already exists
 *       500:
 *         description: Server error
 */


// for admin
router.post('/create-admin', createAdmin);


/**
 * @swagger
 * /superAdmin/{id}:
 *   delete:
 *     tags: [Super Admin]
 *     summary: Delete admin
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin ID
 *     responses:
 *       200:
 *         description: Admin removed successfully
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Server error
 */

router.delete('/:id', deleteAdmin);

router.get('/search-admin', searchAdmin);

/**
 * @swagger
 * /superAdmin/contacts:
 *   get:
 *     tags: [Super Admin]
 *     summary: Get all contact messages
 *     content:
 *        application/json:
 *            schema:
 *               type: array
 *            items:
 *               $ref: '#/components/schemas/Contact'
 *     responses:
 *       200:
 *         description: List of contact messages
 *       500:
 *         description: Server error
 */

router.get('/contacts', getContact);

module.exports = router;