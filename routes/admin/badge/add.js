const express = require("express");
const router = express.Router();
const badgesController = require("../../../controllers/badgesController");

router.post("/", badgesController.addBadge);

module.exports = router;
