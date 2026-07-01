const express = require("express");

const router = express.Router();

const {
    getUserInvitations,
    acceptInvitation,
    rejectInvitation
} = require("../controllers/invitationController");

router.get("/user/:userId", getUserInvitations);

router.put(
    "/accept/:invitationId",
    acceptInvitation
);

router.put(
    "/reject/:invitationId",
    rejectInvitation
);

module.exports = router;