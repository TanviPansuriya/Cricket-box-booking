const Turf = require("../models/turfModel");
const Booking = require("../models/bookingModel");
const Contact = require("../models/contactModel");

// Get turfs by location
exports.getTurfsByLocation = async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ message: "Location required" });
  }
  try {
    const turfs = await Turf.find({ city: { $regex: city, $options: 'i' } });

    if (turfs.length === 0) {
      return res.status(404).json({ message: "No turfs found in this location" });
    }

    res.status(200).json({ turfs });
  } catch (error) {
    console.error("Error fetching turfs:", error);
    res.status(500).json({ message: error.message });
  }
};

// get turfs by id
exports.getTurfById = async (req, res) => {
  try {
      const  turfId  = req.params.id; 
      const turf = await Turf.findById(turfId);
      if (!turf) {
          return res.status(404).json({ message: "Turf not found" });
      }
      res.status(200).json({ turf });
  } catch (error) {
      console.error("Error fetching turf:", error);
      res.status(500).json({ message: error.message  });
    }
};

// Search turfs based on name and location
exports.searchTurfs = async (req, res) => {
  try {
    const { name } = req.query;

    const turfs = await Turf.find({
      // $or: [
      name: { $regex: name, $options: 'i' }
    },
      // { city: { $regex: city, $options: 'i' } }
      // ]
    );

    if (turfs.length === 0) {
      return res.status(404).json({ message: "No turfs found" });
    }

    res.status(200).json({ turfs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all turfs for users
exports.getAllTurfs = async (req, res) => {
  try {
    const turfs = await Turf.find();
    if (!turfs || turfs.length === 0) {
      return res.status(404).json({ message: "No turfs found" });
    }
    res.status(200).json({ message: "Turfs fetched successfully", turfs });
  } catch (error) {
    res.status(500).json({ message: error.message  });
  }
};

// Contacts
exports.addContact = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(200).json({ message: 'Message sent successfully!', contact });
  } catch (error) {
    res.status(500).json({ message: error.message  });
  }
};

// Booking
exports.createBooking = async (req, res) => {
    try {
        const { turfId, userDetails, bookingDetails } = req.body;

        const turf = await Turf.findById(turfId);
        if (!turf) {
            return res.status(400).json({ message: "Turf not found" });
        }

        let totalPrice = 0;
        let bookedSlots = [];
        let unavailableSlots = [];

        bookingDetails.timeSlots.forEach(selectedSlot => {
            const turfSlot = turf.timeSlots.find(slot =>
                slot.startTime === selectedSlot.startTime && slot.endTime === selectedSlot.endTime
            );

            if (turfSlot) {
                bookedSlots.push({
                    startTime: turfSlot.startTime,
                    endTime: turfSlot.endTime,
                    price: turfSlot.price
                });
                totalPrice += parseFloat(turfSlot.price);
            } else {
                unavailableSlots.push(`${selectedSlot.startTime} - ${selectedSlot.endTime}`);
            }
        });

        if (unavailableSlots.length > 0) {
            return res.status(400).json({
                message: "Some selected slots are unavailable",
                unavailableSlots: unavailableSlots
            });
        }

        const newBooking = new Booking({
            turfId,
            userDetails,
            bookingDetails: {
                date: bookingDetails.date,
                timeSlots: bookedSlots
            },
            status: "Pending"
        });

        await newBooking.save();

        res.status(201).json({
            message: "Booking created successfully",
            totalPrice: totalPrice,
            booking: newBooking
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get available slots 
exports.getAvailableSlots = async (req, res) => {
  try {
      const { turfId } = req.params;
      const { date } = req.query; 
      if (!date) {
          return res.status(400).json({ message: "Date is required" });
      }

      const turf = await Turf.findById(turfId);
      if (!turf) {
          return res.status(404).json({ message: "Turf not found" });
      }

      const bookings = await Booking.find({
          turfId: turfId,
          "bookingDetails.date": date
      });

      const bookedSlots = bookings.flatMap(booking =>
          booking.bookingDetails.timeSlots.map(slot => ({
              startTime: slot.startTime,
              endTime: slot.endTime
          }))
      );

      const availableSlots = turf.timeSlots.filter(turfSlot => {
          return !bookedSlots.some(booked =>
              booked.startTime === turfSlot.startTime && booked.endTime === turfSlot.endTime
          );
      });

      res.status(200).json({
          message: "Available slots fetched successfully",
          availableSlots
      });
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
};