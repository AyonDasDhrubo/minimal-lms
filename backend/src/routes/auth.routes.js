import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

// Hardcoded admin user
const ADMIN_USER = {
  email: "admin@lms.com",
  password: "admin123",
  role: "admin",
};

// Login route
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
    const token = jwt.sign(
      { email: ADMIN_USER.email, role: ADMIN_USER.role },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1h" }
    );
    return res.json({ token });
  }
  return res.status(401).json({ error: "Invalid credentials" });
});

export default router;
