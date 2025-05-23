const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require("../models/adminModel");
const Turf = require("../models/turfModel");
const Booking = require("../models/bookingModel");
const cloudinary = require("../middleware/cloudinary");

// Login 
exports.login = async (req, res) => {
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
exports.addTurf = async (req, res) => {
    const { name, location, address1, address2,
        city, landmark, zipcode, contactDetails, timeSlots } = req.body;

    const images = req.files ? req.files.map(file => file.path.replace(/\\/g, "/")) : [];
    try {
        const newTurf = new Turf({
            name, location, address1, address2,
            city, landmark, zipcode, contactDetails, timeSlots,
            admin: req.admin.admin,
            images
        });
        await newTurf.save();

        res.status(201).json({ message: 'Turf Added Successfully', turf: newTurf });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// exports.addTurf = async (req, res) => {
//     try {
//       const {
//         name,
//         address1,
//         address2,
//         city,
//         landmark,
//         zipcode,
//       } = req.body;
  
//       let contactDetails, location, timeSlots;
  
//       try {
//         contactDetails = JSON.parse(req.body.contactDetails);
//         location = JSON.parse(req.body.location);
//         timeSlots = JSON.parse(req.body.timeSlots);
//       } catch (parseErr) {
//         return res.status(400).json({ message: "Invalid JSON format in one of the fields (location, contactDetails, timeSlots)" });
//       }
  
//       const images = req.files ? req.files.map(file => file.path.replace(/\\/g, "/")) : [];
  
//       const newTurf = new Turf({
//         name,
//         address1,
//         address2,
//         city,
//         landmark,
//         zipcode,
//         contactDetails,
//         location,
//         timeSlots,
//         admin: req.admin.admin, // depends on your auth middleware
//         images,
//       });
  
//       await newTurf.save();
  
//       res.status(201).json({ message: 'Turf Added Successfully', turf: newTurf });
  
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: error.message });
//     }
//   };
  


// Image upload on cloudinary
// exports.addTurf = async (req, res) => {
//     try {
//         const images = [];

//         if (req.files) {
//             for (const file of req.files) {
//                 const result = await cloudinary.uploader.upload(file.path);
//                 images.push(result.secure_url);
//             }
//         }

//         const newTurf = new Turf({
//             ...req.body,
//             admin: req.admin.admin,
//             images
//         });

//         await newTurf.save();

//         res.status(201).json({ message: 'Turf Added Successfully', turf: newTurf });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: error.message });
//     }
// };

// get turf

exports.getAllTurfsByAdmin = async (req, res) => {
    try {
        // console.log('Admin ID:', req.admin   );
        const turfs = await Turf.find({ admin: req.admin.admin })
        if (turfs.length === 0) {
            return res.status(404).json({ message: 'No turfs found for this admin.' });
        }
        res.status(200).json({ turfs: turfs });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
};

// get turf by id
exports.getTurfById = async (req, res) => {

    try {
        const _id = req.params.id;
        const turf = await Turf.findById(_id);
        if (!turf) {
            return res.status(404).json({ message: "Turf not found" });
        }

        res.status(200).json({ turf });
    } catch (error) {
        console.error("Error fetching turf:", error);
        res.status(500).json({ message: error.message });
    }
};

// Search turf
exports.searchTurfs = async (req, res) => {
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
            return res.status(404).json({ message: "No turfs found for this admin." });
        }

        res.status(200).json({ turfs });
    } catch (error) {
        console.error("Error searching turfs:", error);
        res.status(500).json({ message: error.message });
    }
};

function cleanEmptyFields(obj) {
    Object.keys(obj).forEach(key => {
      if (obj[key] && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        cleanEmptyFields(obj[key]);
        if (Object.keys(obj[key]).length === 0) delete obj[key];
      } else if (
        obj[key] === "" || 
        obj[key] === null || 
        obj[key] === undefined
      ) {
        delete obj[key];
      }
    });
  }
  
  exports.updateTurf = async (req, res) => {
    const _id = req.params.id;
    try {
      let turf = await Turf.findById(_id);
      if (!turf) {
        return res.status(404).json({ error: 'Turf not found' });
      }
  
      const images = req.files ? req.files.map(file => file.path.replace(/\\/g, "/")) : undefined;
  
      if (images) req.body.images = images;
  
      cleanEmptyFields(req.body);
  
      turf = await Turf.findByIdAndUpdate(_id, req.body, { new: true });
      res.status(200).json({ message: 'Turf updated successfully', turf });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  

// Update a turf
// exports.updateTurf = async (req, res) => {
//     const _id = req.params.id;
//     try {
//         let turf = await Turf.findById(_id);
//         if (!turf) {
//             return res.status(404).json({ error: 'Turf not found' });
//         }

//         const images = req.files ? req.files.map(file => file.path.replace(/\\/g, "/")) : turf.images;

//         req.body.images = images; 

//         // if (req.file) {
//         //     req.body.image = req.file.path.replace(/\\/g, "/");
//         // }

//         turf = await Turf.findByIdAndUpdate(_id, req.body, { new: true });
//         res.status(200).json({ message: 'Turf updated successfully', turf });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// Update cloudinary images
// exports.updateTurf = async (req, res) => {
//     const _id = req.params.id;
//     try {
//         let turf = await Turf.findById(_id);
//         if (!turf) {
//             return res.status(404).json({ error: 'Turf not found' });
//         }

//         let images = turf.images;
//         if (req.files) {
//             images = [];
//             for (const file of req.files) {
//                 const result = await cloudinary.uploader.upload(file.path);
//                 images.push(result.secure_url);
//             }
//         }

//         const updatedTurf = await Turf.findByIdAndUpdate(
//             _id,
//             { images },
//             { new: true }
//         );

//         res.status(200).json({ message: "Turf images updated successfully", images: updatedTurf.images });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: error.message });
//     }
// };

// Remove a turf
exports.deleteTurf = async (req, res) => {
    const { id } = req.params;
    try {
        const turf = await Turf.findByIdAndDelete(id);
        if (!turf) {
            return res.status(404).json({ error: 'Turf not found' });
        }
        res.status(200).json({ message: 'Turf removed successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// delete images on cloudinary
// exports.deleteTurf = async (req, res) => {
//     const _id = req.params.id;
//     try {
//         let turf = await Turf.findById(_id);
//         if (!turf) {
//             return res.status(404).json({ error: 'Turf not found' });
//         }

//         for (const imgUrl of turf.images) {
//             const publicId = imgUrl.split("/").pop().split(".")[0];
//             await cloudinary.uploader.destroy(publicId);
//         }
//         await Turf.findByIdAndDelete(_id);

//         res.status(200).json({ message: "Turf and its images deleted successfully" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: error.message });
//     }
// };

// Get all Bookings
exports.getAllBookings = async (req, res) => {
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
        res.status(500).json({ message: error.message });
    }
};

// Pagination for display turfs
exports.documents = async (req, res) => {
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

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// count total turfs
exports.totalTurfs = async (req, res) => {
    try {
        const adminId = req.admin.admin;
        const totalTurfs = await Turf.countDocuments({ admin: adminId });
        res.status(200).json({ totalTurfs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// count total bookings
exports.totalBookings = async (req, res) => {
    try {
        const adminId = req.admin.admin;
        const totalBookings = await Booking.countDocuments({ turfId: { $in: await Turf.find({ admin: adminId }) } });

        res.status(200).json({ totalBookings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get all timeslots
exports.getAllTimeSlots = async (req, res) => {

    try {
        const { turfId } = req.params;
        const turf = await Turf.findById(turfId);

        if (!turf) {
            return res.status(404).json({ message: "Turf not found" });
        }

        res.status(200).json({
            message: "Time slots fetched successfully",
            timeSlots: turf.timeSlots,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};