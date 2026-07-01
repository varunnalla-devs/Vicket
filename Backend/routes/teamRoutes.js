const express = require("express");

const router = express.Router();

const { createTeam,
        getTeams,
        getMyTeam,
        getTeamInvitations,
        getTeamMembers,
        removePlayer,
        createJoinRequest,
        getJoinRequests,
        acceptJoinRequest,
        rejectJoinRequest
} = require("../controllers/teamController");

router.post("/create", createTeam);
router.get("/", getTeams);
router.get("/my-team/:userId", getMyTeam);

router.get(
    "/:teamId/invitations",
    getTeamInvitations
);
router.get(
    "/:teamId/members",
    getTeamMembers
);
router.delete(
    "/remove-player/:memberId",
    removePlayer
);
router.post(
    "/join-request",
    createJoinRequest
);

router.get(
    "/:teamId/join-requests",
    getJoinRequests
);

router.put(
    "/join-request/accept/:requestId",
    acceptJoinRequest
);

router.put(
    "/join-request/reject/:requestId",
    rejectJoinRequest
);



module.exports = router;

