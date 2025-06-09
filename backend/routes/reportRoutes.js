const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddlewares");
const { exportTasksReport, exportUsersReport } = require("../controllers/reportController");

const router = express.Router();

router.get("/exports/tasks", protect, adminOnly, exportTasksReport) // Export all tasks as Excel/PDF
router.get("/exports/tasks", protect, adminOnly, exportUsersReport) // Export user-task report

module.exports = router;