const express = require("express");
const router = express.Router();
const typesController = require("../../../controllers/typesController");

router.post("/", typesController.getallTypes);

module.exports = router;
