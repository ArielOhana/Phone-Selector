const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userController = require('./controllers/userController')
const userRoutes = require("./routes/userRoutes");
const phoneRoutes = require("./routes/phoneRoutes");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const app = express();
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
    origin:`${process.env.CLIENT_URL}`,
    credentials: true,
};
app.use(cors(corsOptions));
app.post("/users/signin", userController.Signin);
app.post("/users/signup", userController.createUser);
app.get("/users/verify/:token", userController.verifyEmail);
app.use(userController.verifyToken);
app.use("/phones",phoneRoutes)
app.use("/users", userRoutes);


module.exports = app;