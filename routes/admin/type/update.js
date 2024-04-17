const express = require("express");
const router = express.Router();
const typesController = require("../../../controllers/typesController");

router.post("/", typesController.updateType);

module.exports = router;
