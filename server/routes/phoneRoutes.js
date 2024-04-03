const express = require("express");
const phoneController = require("../controllers/phoneController");
const router = express.Router();
router.route("/getphones/:phone").get(phoneController.getPhones);
router.route("/getPhonesDetailsByURL/:url").get(phoneController.getPhonesDetailsByURL);
router.route("/AddPhone").post(phoneController.AddPhone);
router.route("/updatePhone").post(phoneController.updatePhone);
router.route("/getverifiedphones/:searchTerm").get(phoneController.getAllPhones)
module.exports = router