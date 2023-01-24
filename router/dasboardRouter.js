const express = require("express");
const auth = require("../middleware/auth");
const dashboardController = require("../controller/dashboardController");

const router = express.Router();

router.get("/read", auth,  dashboardController.viewDashboard);

module.exports = router;