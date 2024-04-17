const express = require("express");
const router = express.Router();
const titlesController = require("../../../controllers/titlesController");

router.post("/", titlesController.deleteTitle);

module.exports = router;
