const express = require("express");
const router = express.Router();
const badgesController = require("../../../controllers/badgesController");

router.post("/", badgesController.getCareer);

module.exports = router;
