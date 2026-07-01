const express = require("express");

const router = express.Router();

const {
    createMatch,
    getMatches
} = require("../controllers/matchController");

router.post("/create", createMatch);

router.get("/", getMatches);

module.exports = router;