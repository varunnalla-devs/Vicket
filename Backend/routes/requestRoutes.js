const express = require("express");

const router = express.Router();

const {
    createRequest,
    getRequestsByMatch,
  acceptRequest
} = require("../controllers/requestController");

router.put("/accept/:requestId", acceptRequest);
router.post("/create", createRequest);
router.get("/:matchId", getRequestsByMatch);
module.exports = router;