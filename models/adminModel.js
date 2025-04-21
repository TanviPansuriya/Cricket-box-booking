const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       required: true
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *        
 */

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});
const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;
