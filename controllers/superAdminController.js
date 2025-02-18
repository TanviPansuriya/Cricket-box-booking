const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SuperAdmin = require("../models/superAdminModel");
const Admin = require("../models/adminModel");
const Contact=require("../models/contactModel");

const router = express.Router();

// Super Admin Registration
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingSuperAdmin = await SuperAdmin.findOne({ email });
        if (existingSuperAdmin) return res.status(400).json({ message: "Super Admin already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newSuperAdmin = new SuperAdmin({ name, email, password: hashedPassword });
        await newSuperAdmin.save();

        res.status(201).json({ message: "Admin registered successfully", superAdmin: newSuperAdmin });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const superAdmin = await SuperAdmin.findOne({ email });
        if (!superAdmin) return res.status(400).json({ message: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, superAdmin.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });
        // console.log(process.env.JWT_SECRET);

        // const token = jwt.sign({ superAdmin: superAdmin._id }, process.env.JWT_SECRET, {
        //     expiresIn: "1h",
        // });

        res.json({ message: "Login successful" });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all Admins
exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find().select("-password");
        res.status(200).json({ admins });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create Admin (Super Admin)
exports.createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({ name, email, password: hashedPassword });
        await newAdmin.save();

        res.status(201).json({ message: "Admin created successfully", Admin: newAdmin });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Admin
exports.deleteAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;
        const deletedAdmin = await Admin.findByIdAndDelete(adminId);
        if (!deletedAdmin) return res.status(404).json({ message: 'Admin not found' });

        res.status(200).json({ message: 'Admin removed successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error removing admin',message: error.message });
    }
};

// Search Admin
exports.searchAdmin = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({ message: "Please provide an admin name to search." });
        }
        const admins = await Admin.find({
            name: { $regex: name, $options: "i" }
        });

        if (!admins.length) {
            return res.status(404).json({ message: "No matching admins found." });
        }

        res.status(200).json({ admins });
    } catch (error) {
        res.status(500).json({ error: "Failed to filter admins",message: error.message });
    }
};

// Get all contact details
exports.getContact = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(400).json({ error: 'Failed to fetch messages', message: error.message });
    }
};

