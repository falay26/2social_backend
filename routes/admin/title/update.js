const express = require("express");
const router = express.Router();
const titlesController = require("../../../controllers/titlesController");

router.post("/", titlesController.updateTitle);

module.exports = router;
