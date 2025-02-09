const express = require("express");
const port = process.env.PORT || 3000;
const db = require("./db/conn");
const superAdminRoutes = require("./routes/superAdminRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const path = require("path")

require("dotenv").config();

const app = express();
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use("/uploads", express.static("uploads"));

app.use('/api/superAdmin', superAdminRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

app.use("/",async(req,res)=>{
    return res.json({
        message:"welcome"
    })
});

app.listen(port, () => {
    console.log(`Server is running at ${port} no.`);
});
