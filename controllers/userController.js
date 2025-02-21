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
      res.status(500).json({ error: "Failed to fetch turf" });
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
    console.error("Error fetching turfs:", error);
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
    console.error(error);
    res.status(500).json({ error: "Failed to fetch turfs" });
  }
};

// old Booking
// const createBooking = async (req, res) => {
//   const { turfId, userPhone, userEmail, slot, date } = req.body;

//   try {
//     const turf = await Turf.findById(turfId);
//     if (!turf) return res.status(404).json({ message: "Turf not found" });

//     const existingUserBooking = await Booking.findOne({
//       turfId,
//       userPhone,
//       userEmail,
//       slot,
//       date
//     });

//     if (!turf.time.includes(slot)) {
//       return res.status(400).json({ message: "Selected slot is not available." });
//     }

//     const existingBooking = await Booking.findOne({ turfId, slot, date });
//     if (existingBooking) {

//       const bookedBookings = await Booking.find({ turfId, date });
//       const bookedSlots = bookedBookings.map(booking => booking.slot);
//       const availableSlots = turf.time.filter(slot => !bookedSlots.includes(slot));

//       if (existingUserBooking) {
//         return res.status(400).json({
//           message: "You have already booked this turf for the selected date and time.",
//           availableSlots
//         });
//       }
//       if (availableSlots.length === 0) {
//         return res.status(400).json({
//           message: "No available turfs for this day.",
//         });
//       }

//       return res.status(400).json({
//         message: "Selected slot is already booked.",
//         availableSlots,

//       });
//     }
//     const allBookingsForDate = await Booking.find({ date });
//     const allBookedSlots = allBookingsForDate.map(booking => booking.slot);

//     const availableTurfSlots = turf.time.filter(slot => !allBookedSlots.includes(slot));

//     if (availableTurfSlots.length === 0) {
//       return res.status(400).json({
//         message: "No available turfs for this day.",
//       });
//     }

//     const newBooking = new Booking({
//       turfId,
//       userPhone,
//       userEmail,
//       slot,
//       date
//     });
//     await newBooking.save();

//     res.status(201).json({
//       message: "Booking successful. We will contact you soon.",
//       booking: newBooking
//     });
//   } catch (error) {
//     // console.error("Error in booking:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// Contact form


exports.addContact = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(200).json({ message: 'Message sent successfully!', contact });
  } catch (error) {
    res.status(400).json({ error: 'Failed to send message', message: error.message });
  }
};

// ==========================

// const calculateDuration = (startTime, endTime) => {
//   const convertToMinutes = (time) => {
//       const [hour, minute, period] = time.match(/(\d+):(\d+) (AM|PM)/).slice(1);
//       let hours = parseInt(hour);
//       const minutes = parseInt(minute);

//       // Convert 12-hour format to 24-hour format
//       if (period === "PM" && hours !== 12) hours += 12;
//       if (period === "AM" && hours === 12) hours = 0; 

//       return hours * 60 + minutes;
//   };

//   const startMinutes = convertToMinutes(startTime);
//   const endMinutes = convertToMinutes(endTime);

//   // Handle cases where booking spans over midnight
//   const durationInMinutes = endMinutes >= startMinutes
//       ? endMinutes - startMinutes
//       : (1440 - startMinutes) + endMinutes;

//   return durationInMinutes / 60; // Convert to hours
// };


// exports.createBooking = async (req, res) => {
//   try {
//       const { turfId, userDetails, bookingDetails } = req.body;

//       if (!turfId || !userDetails || !bookingDetails) {
//           return res.status(400).json({ message: "All fields are required" });
//       }

//       const { date, timeSlots } = bookingDetails;
//       const { startTime, endTime } = timeSlots;

//       // Check if turf exists
//       const turf = await Turf.findById(turfId);
//       if (!turf) {
//           return res.status(404).json({ message: "Turf not found" });
//       }

//       // 🔹 Find closest matching time slot from `turf.timeSlots`
//       const matchingSlot = turf.timeSlots.find(slot => {
//           return slot.startTime === startTime && slot.endTime === endTime;
//       });

//       if (!matchingSlot) {
//           return res.status(400).json({ message: "Invalid time slot selection" });
//       }

//       // 🔹 Calculate total price based on per-hour rate
//       const durationInHours = calculateDuration(startTime, endTime);
//       if (durationInHours <= 0) {
//           return res.status(400).json({ message: "Invalid time slot selection" });
//       }
//       const totalPrice = durationInHours * parseFloat(matchingSlot.price);

//       // 🔹 Check if the slot is already booked
//       const existingBookings = await Booking.find({ turfId, "bookingDetails.date": date });

//       const isSlotAvailable = !existingBookings.some(booking => {
//           const bookedStart = booking.bookingDetails.timeSlots.startTime;
//           const bookedEnd = booking.bookingDetails.timeSlots.endTime;

//           return (
//               (startTime >= bookedStart && startTime < bookedEnd) ||
//               (endTime > bookedStart && endTime <= bookedEnd)
//           );
//       });

//       if (!isSlotAvailable) {
//           return res.status(400).json({ message: "Turf not available for the selected time slot" });
//       }

//       // 🔹 Save the booking with dynamically calculated price
//       const newBooking = new Booking({
//           turfId,
//           userDetails,
//           bookingDetails: {
//               date,
//               timeSlots: { startTime, endTime, price: totalPrice }
//           },
//           status: "Pending"
//       });

//       await newBooking.save();
//       res.status(201).json({ message: "Booking successful", booking: newBooking });

//   } catch (error) {
//       res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// ==========================================

// exports.createBooking = async (req, res) => {
//   try {
//     const { turfId, userDetails, bookingDetails } = req.body;

//     // Fetch the turf data to check availability
//     const turf = await Turf.findById(turfId);
//     if (!turf) {
//         return res.status(400).json({ message: "Turf not found" });
//     }

//     // Validate if the time slots are available
//     const availableSlots = turf.timeSlots.filter(slot => {
//         return bookingDetails.timeSlots.some(reqSlot => {
//             return reqSlot.startTime === slot.startTime && reqSlot.endTime === slot.endTime;
//         });
//     });

//     if (availableSlots.length !== bookingDetails.timeSlots.length) {
//         return res.status(400).json({ message: "One or more slots are unavailable" });
//     }

//     // Create the booking
//     const newBooking = new Booking({
//         turfId,
//         userDetails,
//         bookingDetails,
//         status: "Pending"
//     });

//     await newBooking.save();

//     // Return the booking confirmation
//     res.status(201).json({ message: "Booking created successfully", booking: newBooking });
// } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
// }
// };

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

        // Validate & Calculate Price for Each Selected Time Slot
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
        console.error(error);
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
      console.error(error);
      res.status(500).json({ message: "Server error" });
  }
};