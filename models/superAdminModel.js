const mongoose = require("mongoose");

const SuperAdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: [true, "email already exists"],
        required: [true, "email is required"],
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format"]
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Password must be at least 6 characters"]
    },
}, {
    timestamps: true
});

const SuperAdmin = mongoose.model('SuperAdmin', SuperAdminSchema);
module.exports = SuperAdmin;

SuperAdminSchema.pre("save", async function (next) {
    if (this.isModified("password")) {

        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});