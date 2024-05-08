const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

//Routes
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const guestRoutes = require("./routes/Guest");
const adminRoutes = require("./routes/Admin");
const manageUrlRoutes = require("./routes/Urls");
const path = require('path');

dotenv.config();
const PORT = process.env.PORT || 4000;

//serve the uploded images statically
app.use('/api/uploads', express.static(path.join(__dirname, 'controllers/uploads')));
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
app.use("/api/profile", profileRoutes);
app.use("/api/guest", guestRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", manageUrlRoutes);

app.get("/", (req, res) => {
    return res.json({
      success: true,
      message: "Server is running",
    });
  });
  
  app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
  });
  