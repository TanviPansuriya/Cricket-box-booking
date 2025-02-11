const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require("../models/adminModel");
const Turf = require("../models/turfModel");
const Booking = require("../models/bookingModel");

// Login 
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(400).json({ message: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });
        // console.log(process.env.JWT_SECRET);

        const token = jwt.sign({ admin: admin._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.json({ message: "Login successful", token });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Add turfs
const addTurf = async (req, res) => {
    const { name, location, price, time } = req.body;
    const image = req.file ? req.file.path.replace(/\\/g, "/") : "";

    try {
        const newTurf = new Turf({
            name,
            location,
            price,
            time,
            admin: req.admin.admin,
            image
        });
        await newTurf.save();

        res.status(201).json({ message: 'Turf Added Successfully', turf: newTurf });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to add turf' });
    }
};

// get turf
const getAllTurfsByAdmin = async (req, res) => {
    try {
        // console.log('Admin ID:', req.admin   );
        const turfs = await Turf.find({ admin: req.admin.admin })
        if (turfs.length === 0) {
            return res.status(404).json({ message: 'No turfs found for this admin.' });
        }
        res.status(200).json({ turfs: turfs });
    } catch (error) {
        res.status(500).json({ error });
        console.log(error);
    }
};

// get turf by id
const getTurfById = async (req, res) => {

    try {
        const _id = req.params.id;
        const turf = await Turf.findById(_id);
        if (!turf) {
            return res.status(404).json({ message: "Turf not found" });
        }

        res.status(200).json({ turf });
    } catch (error) {
        console.error("Error fetching turf:", error);
        res.status(500).json({ error: "Failed to fetch turf" });
    }
};

const searchTurfs = async (req, res) => {
    try {
        const { turfName, name } = req.query; 
        let query = {};

        if (turfName) {
            query.name = { $regex: turfName, $options: "i" };
        }

        if (name) {
            const admin = await Admin.findOne({ name: { $regex: name, $options: "i" } });
            if (!admin) {
                return res.status(404).json({ message: "Admin not found" });
            }
            query.admin = admin._id; 
        }

        const turfs = await Turf.find(query).populate("admin", "name email");

        if (!turfs.length) {
            return res.status(404).json({ message: "No turfs found matching the criteria." });
        }

        res.status(200).json({ turfs });
    } catch (error) {
        console.error("Error searching turfs:", error);
        res.status(500).json({ error: "Failed to search turfs" });
    }
};

// Update a turf
const updateTurf = async (req, res) => {
    const _id = req.params.id;
    try {
        const turf = await Turf.findByIdAndUpdate(_id, req.body, { new: true });
        if (!turf) {
            return res.status(404).json({ error: 'Turf not found' });
        }
        console.log(turf)
        res.status(200).json({ message: 'Turf updated successfully', turf });
    } catch (error) {
        // console.log(error)
        res.status(400).json({ error: 'Error updating turf', details: error.message });
    }
};

// Remove a turf
const deleteTurf = async (req, res) => {
    const { id } = req.params;
    try {
        const turf = await Turf.findByIdAndDelete(id);
        if (!turf) {
            return res.status(404).json({ error: 'Turf not found' });
        }
        res.status(200).json({ message: 'Turf removed successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error removing turf', details: error.message });
    }
};

// Get all Bookings
const getAllBookings = async (req, res) => {
    try {
        const turfs = await Turf.find({ admin: req.admin.admin });
        if (!turfs.length) {
            return res.status(404).json({ message: 'No turfs found for this admin' });
        }
        const turfId = turfs.map(turf => turf._id);
        const bookings = await Booking.find({ turfId }).populate('turfId', 'name location');

        if (!bookings.length) {
            return res.status(404).json({ message: 'No bookings found for your turfs' });
        }

        res.status(200).json({ bookings });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Pagination for turf
const documents = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try {
        const skip = (page - 1) * limit;

        const turfs = await Turf.find().skip(skip).limit(limit);
        const totalTurfs = await Turf.countDocuments();

        res.status(200).json({
            totalTurfs,
            currentPage: page,
            totalPages: Math.ceil(totalTurfs / limit),
            turfs
        });
        
    } catch (err) {
        console.log(err)
      res.status(500).send('Error fetching documents');
    }
  };

module.exports = { login, addTurf, searchTurfs, getAllTurfsByAdmin, getTurfById, updateTurf, deleteTurf, getAllBookings,documents};
