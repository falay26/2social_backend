require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors({ credentials: true, origin: true }));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files
app.use("/", express.static(path.join(__dirname, "/public")));

// routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/register_otp", require("./routes/auth/register_otp"));
app.use("/resend_register_otp", require("./routes/auth/resend_register_otp"));
app.use("/login", require("./routes/auth/auth"));
app.use("/confirm_login_otp", require("./routes/auth/confirm_login_otp"));
app.use("/resend_login_otp", require("./routes/auth/resend_login_otp"));

//For Mobile
app.use("/create_post", require("./routes/mobile/post/create"));
app.use("/timeline", require("./routes/mobile/post/timeline"));
app.use("/create_comment", require("./routes/mobile/comment/create"));
app.use("/categories", require("./routes/mobile/categories"));
app.use("/notifications", require("./routes/mobile/notification/get"));
app.use("/read_notifications", require("./routes/mobile/notification/read"));
//User related
app.use("/change_language", require("./routes/mobile/user/change_language"));
app.use("/unfollow_user", require("./routes/mobile/user/unfollow_user"));

//For Admin
//Users
app.use("/get_all_users", require("./routes/admin/get_all_users"));
//Titles
app.use("/get_all_titles", require("./routes/admin/title/get_all"));
app.use("/add_title", require("./routes/admin/title/add"));
app.use("/update_title", require("./routes/admin/title/update"));
app.use("/delete_title", require("./routes/admin/title/delete"));
//Types
app.use("/get_all_types", require("./routes/admin/type/get_all"));
app.use("/add_type", require("./routes/admin/type/add"));
app.use("/update_type", require("./routes/admin/type/update"));
app.use("/delete_type", require("./routes/admin/type/delete"));
//Categories
app.use("/get_all_categories", require("./routes/admin/category/get_all"));
app.use("/add_category", require("./routes/admin/category/add"));
app.use("/update_category", require("./routes/admin/category/update"));
app.use("/delete_category", require("./routes/admin/category/delete"));
//SubCategories
app.use(
  "/get_all_sub_categories",
  require("./routes/admin/sub_category/get_all")
);
app.use("/add_sub_category", require("./routes/admin/sub_category/add"));
app.use("/update_sub_category", require("./routes/admin/sub_category/update"));
app.use("/delete_sub_category", require("./routes/admin/sub_category/delete"));
//Badges
app.use("/get_all_badges", require("./routes/admin/badge/get_all"));
app.use("/add_badge", require("./routes/admin/badge/add"));
app.use("/update_badge", require("./routes/admin/badge/update"));
app.use("/delete_badge", require("./routes/admin/badge/delete"));

/*
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use(verifyJWT);
app.use("/users", require("./routes/api/users"));
*/

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
