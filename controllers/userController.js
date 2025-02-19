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

// ----------------------------------
// const BASE_PRICE = 500;
// const DISCOUNT_PER_HOUR = 50;

// Check if time slots overlap
// const isTimeSlotAvailable = (existingBookings, startTime, endTime) => {
//   return !existingBookings.some(booking => {
//     const existingStart = booking.bookingDetails.timeSlot.startTime;
//     const existingEnd = booking.bookingDetails.timeSlot.endTime;
//     return (
//       (startTime >= existingStart && startTime < existingEnd) ||
//       (endTime > existingStart && endTime <= existingEnd)
//     );
//   });
// };

// Calculate price dynamically based on duration
// const calculatePrice = (duration) => {
//   let totalPrice = BASE_PRICE;
//   for (let i = 1; i < duration; i++) {
//     totalPrice += BASE_PRICE - (i * DISCOUNT_PER_HOUR);
//   }
//   return totalPrice;
// };

// // POST - Create Booking
// exports.createBooking = async (req, res) => {
//   try {
//     const { turfId, userDetails, bookingDetails } = req.body;

//     if (!turfId || !userDetails || !bookingDetails) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const { date, timeSlot } = bookingDetails;
//     const { startTime, endTime } = timeSlot;

//     const timeFormat = /^([01]\d|2[0-3]):([0-5]\d)$/;
//     if (!timeFormat.test(startTime) || !timeFormat.test(endTime)) {
//       return res.status(400).json({ message: "Invalid time format (HH:MM required)" });
//     }

//     const start = parseInt(startTime.split(":")[0]);
//     const end = parseInt(endTime.split(":")[0]);
//     const duration = end - start;

//     if (duration <= 0) {
//       return res.status(400).json({ message: "Invalid time slot duration" });
//     }

//     // Fetch existing bookings for the turf on that date
//     const existingBookings = await Booking.find({
//       turfId,
//       "bookingDetails.date": date,
//     });

//     // Check availability
//     if (!isTimeSlotAvailable(existingBookings, startTime, endTime)) {
//       return res.status(400).json({ message: "Selected time slot is not available" });
//     }

//     // Calculate dynamic price
//     const price = calculatePrice(duration);

//     // Save booking
//     const newBooking = new Booking({
//       turfId,
//       userDetails,
//       bookingDetails,
//       price,
//     });

//     await newBooking.save();

//     res.status(201).json({ message: "Booking confirmed", price, booking: newBooking });
//   } catch (error) {
//     console.error(error);
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

// ---------------------------------

// Helper function to convert time from AM/PM to 24-hour format
// const convertTo24HourFormat = (time) => {
//   const [timeString, period] = time.split(" ");
//   const [hours, minutes] = timeString.split(":");

//   let hour = parseInt(hours);

//   if (period.toUpperCase() === "PM" && hour !== 12) hour += 12;
//   if (period.toUpperCase() === "AM" && hour === 12) hour = 0;

//   return hour;
// };

// // Function to calculate the total price based on the time slot selected
// const calculatePrice = (startTime, endTime, selectedTimeSlot) => {
//   const start = convertTo24HourFormat(startTime);
//   const end = convertTo24HourFormat(endTime);

//   const duration = end - start;

//   if (duration <= 0) {
//     throw new Error("Invalid time slot duration");
//   }

//   const price = parseFloat(selectedTimeSlot.price);
//   const totalPrice = price * duration;

//   return totalPrice;
// };

// // POST - Create Booking
// exports.createBooking = async (req, res) => {
//   try {
//     const { turfId, userDetails, bookingDetails } = req.body;

//     if (!turfId || !userDetails || !bookingDetails) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const { date, timeSlot } = bookingDetails;
//     const { startTime, endTime } = timeSlot;

//     try {
//       convertTo24HourFormat(startTime);
//       convertTo24HourFormat(endTime);
//     } catch (error) {
//       return res.status(400).json({ message: `Invalid time format: ${error.message}` });
//     }

//     const turf = await Turf.findById(turfId);

//     const selectedTimeSlot = turf.timeSlots.find(
//       slot => slot.startTime === startTime && slot.endTime === endTime
//     );

//     if (!selectedTimeSlot) {
//       return res.status(400).json({ message: "Selected time slot is not available" });
//     }

//     const existingBookings = await Booking.find({
//       turfId,
//       "bookingDetails.date": date,
//     });

//     const isSlotAvailable = !existingBookings.some(booking => {
//       const existingStartTime = booking.bookingDetails.timeSlot.startTime;
//       const existingEndTime = booking.bookingDetails.timeSlot.endTime;
//       return (
//         (startTime >= existingStartTime && startTime < existingEndTime) ||
//         (endTime > existingStartTime && endTime <= existingEndTime)
//       );
//     });

//     if (!isSlotAvailable) {
//       return res.status(400).json({ message: "Selected time slot is not available" });
//     }

//     const totalPrice = calculatePrice(startTime, endTime, selectedTimeSlot);

//     const newBooking = new Booking({
//       turfId,
//       userDetails,
//       bookingDetails,
//       price: totalPrice, 
//     });

//     await newBooking.save();

//     res.status(201).json({ message: "We will contact you soon", price: totalPrice, booking: newBooking });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: error.message });
//   }
// };

// =============================================================================

// Function to check if two time slots overlap
// const isTimeSlotAvailable = (existingBookings, newStartTime, newEndTime) => {
//     return !existingBookings.some(booking => {
//         const existingStartTime = booking.bookingDetails.timeSlot.startTime;
//         const existingEndTime = booking.bookingDetails.timeSlot.endTime;

//         return (
//             (newStartTime >= existingStartTime && newStartTime < existingEndTime) ||
//             (newEndTime > existingStartTime && newEndTime <= existingEndTime)
//         );
//     });
// };

// // Turf Booking API
// exports.createBooking = async (req, res) => {
//     try {
//         const { turfId, userDetails, bookingDetails } = req.body;

//         if (!turfId || !userDetails || !bookingDetails) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         const { date, timeSlot } = bookingDetails;
//         const { startTime, endTime } = timeSlot;

//         // Check if turf exists
//         const turf = await Turf.findById(turfId);
//         if (!turf) {
//             return res.status(404).json({ message: "Turf not found" });
//         }

//         // Check if the turf has the requested time slot
//         const isSlotExists = turf.timeSlots.some(slot =>
//             slot.startTime === startTime && slot.endTime === endTime
//         );

//         if (!isSlotExists) {
//             return res.status(400).json({ message: "Turf not available at this time slot" });
//         }

//         // Check if the slot is already booked
//         const existingBookings = await Booking.find({ 
//             turfId, 
//             "bookingDetails.date": date 
//         });

//         if (!isTimeSlotAvailable(existingBookings, startTime, endTime)) {
//             return res.status(400).json({ message: "Turf not available for the selected time slot" });
//         }

//         // Create a new booking
//         const newBooking = new Booking({
//             turfId,
//             userDetails,
//             bookingDetails,
//             status: "Pending"
//         });

//         await newBooking.save();
//         res.status(201).json({ message: "Booking successful", booking: newBooking });

//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };


// *=========================true=================================

// price calculated
// const calculateDuration = (startTime, endTime) => {
//     const [startHour, startMin, startPeriod] = startTime.match(/(\d+):(\d+) (AM|PM)/).slice(1);
//     const [endHour, endMin, endPeriod] = endTime.match(/(\d+):(\d+) (AM|PM)/).slice(1);

//     const start24Hour = parseInt(startHour) % 12 + (startPeriod === "PM" ? 12 : 0);
//     const end24Hour = parseInt(endHour) % 12 + (endPeriod === "PM" ? 12 : 0);

//     const duration = (end24Hour + parseInt(endMin) / 60) - (start24Hour + parseInt(startMin) / 60);
//     return Math.max(duration, 0);  // Ensure non-negative duration
// };

// // Turf Booking API
// exports.createBooking = async (req, res) =>{
//     try {
//         const { turfId, userDetails, bookingDetails } = req.body;

//         if (!turfId || !userDetails || !bookingDetails) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         const { date, timeSlot } = bookingDetails;
//         const { startTime, endTime } = timeSlot;

//         // Check if turf exists
//         const turf = await Turf.findById(turfId);
//         if (!turf) {
//             return res.status(404).json({ message: "Turf not found" });
//         }

//         // Find matching time slot in the turf's schedule
//         const matchingSlot = turf.timeSlots.find(slot =>
//             slot.startTime === startTime && slot.endTime === endTime
//         );

//         if (!matchingSlot) {
//             return res.status(400).json({ message: "Turf not available at this time slot" });
//         }

//         // Calculate total price based on hours
//         const durationInHours = calculateDuration(startTime, endTime);
//         if (durationInHours <= 0) {
//             return res.status(400).json({ message: "Invalid time slot selection" });
//         }
//         const totalPrice = durationInHours * matchingSlot.price;

//         // Check if the slot is already booked
//         const existingBookings = await Booking.find({ 
//             turfId, 
//             "bookingDetails.date": date 
//         });

//         const isSlotAvailable = !existingBookings.some(booking => {
//             const bookedStart = booking.bookingDetails.timeSlot.startTime;
//             const bookedEnd = booking.bookingDetails.timeSlot.endTime;

//             return (
//                 (startTime >= bookedStart && startTime < bookedEnd) ||
//                 (endTime > bookedStart && endTime <= bookedEnd)
//             );
//         });

//         if (!isSlotAvailable) {
//             return res.status(400).json({ message: "Turf not available for the selected time slot" });
//         }

//         // Create a new booking with calculated price
//         const newBooking = new Booking({
//             turfId,
//             userDetails,
//             bookingDetails: {
//                 date,
//                 timeSlot: { startTime, endTime, price: totalPrice }
//             },
//             status: "Pending"
//         });

//         await newBooking.save();
//         res.status(201).json({ message: "Booking successful", booking: newBooking });

//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };

// =============trueeeee=============

const calculateDuration = (startTime, endTime) => {
  const convertToMinutes = (time) => {
      const [hour, minute, period] = time.match(/(\d+):(\d+) (AM|PM)/).slice(1);
      let hours = parseInt(hour);
      const minutes = parseInt(minute);

      // Convert 12-hour format to 24-hour format
      if (period === "PM" && hours !== 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0; 

      return hours * 60 + minutes;
  };

  const startMinutes = convertToMinutes(startTime);
  const endMinutes = convertToMinutes(endTime);

  // Handle cases where booking spans over midnight
  const durationInMinutes = endMinutes >= startMinutes
      ? endMinutes - startMinutes
      : (1440 - startMinutes) + endMinutes;

  return durationInMinutes / 60; // Convert to hours
};


exports.createBooking = async (req, res) => {
  try {
      const { turfId, userDetails, bookingDetails } = req.body;

      if (!turfId || !userDetails || !bookingDetails) {
          return res.status(400).json({ message: "All fields are required" });
      }

      const { date, timeSlots } = bookingDetails;
      const { startTime, endTime } = timeSlots;

      // Check if turf exists
      const turf = await Turf.findById(turfId);
      if (!turf) {
          return res.status(404).json({ message: "Turf not found" });
      }

      // 🔹 Find closest matching time slot from `turf.timeSlots`
      const matchingSlot = turf.timeSlots.find(slot => {
          return slot.startTime === startTime && slot.endTime === endTime;
      });

      if (!matchingSlot) {
          return res.status(400).json({ message: "Invalid time slot selection" });
      }

      // 🔹 Calculate total price based on per-hour rate
      const durationInHours = calculateDuration(startTime, endTime);
      if (durationInHours <= 0) {
          return res.status(400).json({ message: "Invalid time slot selection" });
      }
      const totalPrice = durationInHours * parseFloat(matchingSlot.price);

      // 🔹 Check if the slot is already booked
      const existingBookings = await Booking.find({ turfId, "bookingDetails.date": date });

      const isSlotAvailable = !existingBookings.some(booking => {
          const bookedStart = booking.bookingDetails.timeSlots.startTime;
          const bookedEnd = booking.bookingDetails.timeSlots.endTime;

          return (
              (startTime >= bookedStart && startTime < bookedEnd) ||
              (endTime > bookedStart && endTime <= bookedEnd)
          );
      });

      if (!isSlotAvailable) {
          return res.status(400).json({ message: "Turf not available for the selected time slot" });
      }

      // 🔹 Save the booking with dynamically calculated price
      const newBooking = new Booking({
          turfId,
          userDetails,
          bookingDetails: {
              date,
              timeSlots: { startTime, endTime, price: totalPrice }
          },
          status: "Pending"
      });

      await newBooking.save();
      res.status(201).json({ message: "Booking successful", booking: newBooking });

  } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
  }
};


// 


// const calculateDuration = (startTime, endTime) => {
//     const convertToMinutes = (time) => {
//         const [hour, minute, period] = time.match(/(\d+):(\d+) (AM|PM)/).slice(1);
//         let hours = parseInt(hour);
//         const minutes = parseInt(minute);
//         if (period === "PM" && hours !== 12) hours += 12;
//         if (period === "AM" && hours === 12) hours = 0;
//         return hours * 60 + minutes;
//     };

//     const startMinutes = convertToMinutes(startTime);
//     const endMinutes = convertToMinutes(endTime);
//     const durationInMinutes = endMinutes >= startMinutes
//         ? endMinutes - startMinutes
//         : (1440 - startMinutes) + endMinutes;

//     return durationInMinutes / 60;
// };

// exports.createBooking = async (req, res) => {
//     try {
//         const { turfId, userDetails, bookingDetails } = req.body;

//         if (!turfId || !userDetails || !bookingDetails || !bookingDetails.date || !bookingDetails.timeSlots) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         const { date, timeSlots } = bookingDetails;

//         // Check if turf exists
//         const turf = await Turf.findById(turfId);
//         if (!turf) {
//             return res.status(404).json({ message: "Turf not found" });
//         }

//         let totalPrice = 0;

//         // Check if all selected time slots are valid and calculate price
//         const selectedSlots = [];
//         for (const slot of timeSlots) {
//             const { startTime, endTime } = slot;

//             const matchingSlot = turf.timeSlots.find(t => t.startTime === startTime && t.endTime === endTime);
//             if (!matchingSlot) {
//                 return res.status(400).json({ message: `Invalid time slot: ${startTime} - ${endTime}` });
//             }

//             const durationInHours = calculateDuration(startTime, endTime);
//             if (durationInHours <= 0) {
//                 return res.status(400).json({ message: `Invalid time slot duration for ${startTime} - ${endTime}` });
//             }

//             totalPrice += durationInHours * parseFloat(matchingSlot.price);
//             selectedSlots.push({ startTime, endTime, price: durationInHours * parseFloat(matchingSlot.price) });
//         }

//         // Check if any selected slot is already booked
//         const existingBookings = await Booking.find({ turfId, "bookingDetails.date": date });

//         for (const slot of selectedSlots) {
//             const { startTime, endTime } = slot;
//             const isSlotAvailable = !existingBookings.some(booking => {
//                 return booking.bookingDetails.timeSlots.some(bookedSlot =>
//                     (startTime >= bookedSlot.startTime && startTime < bookedSlot.endTime) ||
//                     (endTime > bookedSlot.startTime && endTime <= bookedSlot.endTime)
//                 );
//             });

//             if (!isSlotAvailable) {
//                 return res.status(400).json({ message: `Turf not available for ${startTime} - ${endTime}` });
//             }
//         }

//         // Save the booking with all selected time slots
//         const newBooking = new Booking({
//             turfId,
//             userDetails,
//             bookingDetails: {
//                 date,
//                 timeSlots: selectedSlots, // Store multiple time slots
//             },
//             status: "Pending"
//         });

//         await newBooking.save();
//         res.status(201).json({ message: "Booking successful", booking: newBooking });

//     } catch (error) {
//         res.status(500).json({ message: "Server error", error: error.message });
//     }
// };





