const express = require("express");
const router = express.Router();
const typesController = require("../../../controllers/typesController");

router.post("/", typesController.addType);

module.exports = router;
