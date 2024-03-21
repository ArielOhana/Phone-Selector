const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router.route("/signout").get(userController.signout);
router.route("/updateThisUser").post(userController.updateThisUser);

module.exports = router;