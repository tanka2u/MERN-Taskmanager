const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddlewares");
const { getUsers, getUserById } = require("../controllers/userController");

const router = express.Router();

// User Management Routes
router.get("/", protect, adminOnly, getUsers); // Get all users (Admin only)
router.get("/:id", protect, getUserById); // Get a Specific user

module.exports = router;