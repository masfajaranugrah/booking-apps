const express = require("express");
const infoController = require("../controller/infoController");
const { uploadSingle } = require("../middleware/multer");
const checkRole = require("../middleware/checkRole");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/create",auth, checkRole("admin"), uploadSingle, infoController.addInfo);
router.get("/read", infoController.viewInfo);
router.put("/update/:id",auth, checkRole("admin"), uploadSingle, infoController.updateInfo);
router.delete("/delete/:id",auth, checkRole("admin"), infoController.deleteInfo);
module.exports = router;
