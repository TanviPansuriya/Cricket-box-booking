const express = require("express");
const port = process.env.PORT || 3000;
const db = require("./db/conn");
const superAdminRoutes = require("./routes/superAdminRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const path = require("path")
const cors = require("cors");

const env = require("dotenv").config();

const app = express();
app.use(express.json());

app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const swaggerOptions = require("./config/swagger")
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");


// bind swagger
const specs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))

app.use('/superAdmin', superAdminRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

app.listen(port, () => {
    console.log(`Server is running at ${port} no.`);
});
