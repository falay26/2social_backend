const express = require("express");
const router = express.Router();
const messagesController = require("../../../controllers/messagesController");

router.post("/", messagesController.baseToImg);

module.exports = router;
