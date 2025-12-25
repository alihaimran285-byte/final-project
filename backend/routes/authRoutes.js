const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");


// REGISTER ----------------------
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Check duplicate
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hash,
      role
    });

    await user.save();

    res.status(201).json({ 
      message: "Registration successful", 
      redirectTo: getDashboardRoute(role) 
    });

  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});


// LOGIN --------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    if (role !== user.role) {
      return res.status(400).json({ message: "Role doesn't match" });
    }

    res.json({
      message: "Login successful",
      redirectTo: getDashboardRoute(user.role),
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});


// ROLE BASED DASHBOARD FUNCTION -------------------
function getDashboardRoute(role) {
  switch (role) {
    case "admin":
      return "/admin-dashboard";
    case "teacher":
      return "/teacher-dashboard";
    case "student":
      return "/student-dashboard";
    default:
      return "/";
  }
}

module.exports = router;
