const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerControllers");

router.post("/", registerController.handleNewUser);

module.exports = router;