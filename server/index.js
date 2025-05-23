const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

//Routes
const userRoutes = require("./routes/User");
const guestRoutes = require("./routes/Guest");
const adminRoutes = require("./routes/Admin");
const manageUrlRoutes = require("./routes/Urls");
const analyticsRoutes = require("./routes/Analytics");
const path = require('path');
 
dotenv.config();
const PORT = process.env.PORT || 4000;

//serve the uploded images statically
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir:"/tmp",
    })
);

app.use("/api/auth", userRoutes);
app.use("/api/guest", guestRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", manageUrlRoutes);
app.use("/api", analyticsRoutes);
 
app.get("/", (req, res) => {
    return res.json({
      success: true,
      message: "Server is running",
    });
  });
  
app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
  