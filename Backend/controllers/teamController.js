const db = require("../config/db");
const createTeam = (req, res) => {

    const { team_name, captain_id, players } = req.body;

    if (!players || players.length < 6) {
        return res.status(400).json({
            message: "Minimum 6 players required"
        });
    }

    const teamSql = `
        INSERT INTO teams
        (team_name, captain_id)
        VALUES (?, ?)
    `;

    db.query(teamSql, [team_name, captain_id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        const teamId = result.insertId;
        players.forEach((playerName) => {

    const findUserSql =
        "SELECT * FROM users WHERE full_name = ?";

    db.query(
        findUserSql,
        [playerName],
        (err, users) => {

            if (users.length > 0) {

                const user = users[0];

                // Invitation
                db.query(
                    `
                    INSERT INTO team_invitations
                    (team_id,user_id)
                    VALUES (?,?)
                    `,
                    [teamId, user.user_id]
                );

                // Notification
                db.query(
                    `
                    INSERT INTO notifications
                    (user_id,title,message)
                    VALUES (?,?,?)
                    `,
                    [
                        user.user_id,
                        "Team Invitation",
                        `${team_name} invited you to join the team`
                    ]
                );

            } else {

                // Unregistered Player

                db.query(
                    `
                    INSERT INTO team_members
                    (
                        team_id,
                        player_name,
                        role,
                        status
                    )
                    VALUES
                    (
                        ?,
                        ?,
                        'PLAYER',
                        'UNREGISTERED'
                    )
                    `,
                    [teamId, playerName]
                );

            }

        }
    );

});

        // Add captain as first member
        const captainSql = `
            INSERT INTO team_members
            (team_id, user_id, player_name, role, status)
            VALUES (?, ?, ?, 'CAPTAIN', 'ACCEPTED')
        `;

        db.query(
            captainSql,
            [teamId, captain_id, "Captain"],
            (err) => {

                if (err) {
                    return res.status(500).json(err);
                }

                res.status(201).json({
                    message: "Team Created Successfully",
                    team_id: teamId
                });
            }
        );

    });

};
const getTeams = (req, res) => {

    const sql = "SELECT * FROM teams";

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(results);

    });

};
const getMyTeam = (req, res) => {

    const { userId } = req.params;

    const sql = `
        SELECT
            t.team_id,
            t.team_name,
            tm.role
        FROM team_members tm
        JOIN teams t
        ON tm.team_id = t.team_id
        WHERE tm.user_id = ?
        AND tm.status = 'ACCEPTED'
        LIMIT 1
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "No Team Found"
            });
        }

        res.json(results[0]);

    });

};
const getTeamInvitations = (req, res) => {

    const { teamId } = req.params;

    const sql = `
        SELECT
            ti.*,
            u.full_name
        FROM team_invitations ti
        JOIN users u
        ON ti.user_id = u.user_id
        WHERE ti.team_id = ?
        ORDER BY ti.invitation_id DESC
    `;

    db.query(sql, [teamId], (err, results) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(results);

    });

};
const getTeamMembers = (req, res) => {

    const { teamId } = req.params;

    const sql = `
        SELECT
            member_id,
            user_id,
            player_name,
            role,
            status
        FROM team_members
        WHERE team_id = ?
        ORDER BY role DESC
    `;

    db.query(sql, [teamId], (err, results) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(results);

    });

};
const removePlayer = (req, res) => {

    const { memberId } = req.params;

    const sql = `
        DELETE FROM team_members
        WHERE member_id = ?
        AND role != 'CAPTAIN'
    `;

    db.query(sql, [memberId], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (result.affectedRows === 0) {
            return res.status(400).json({
                message: "Cannot Remove Captain"
            });
        }

        res.json({
            message: "Player Removed Successfully"
        });

    });

};
const createJoinRequest = (req, res) => {

    const { team_id, user_id } = req.body;

    const sql = `
        INSERT INTO join_requests
        (team_id, user_id)
        VALUES (?, ?)
    `;

    db.query(sql, [team_id, user_id], (err) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            message: "Join Request Sent"
        });

    });

};
const getJoinRequests = (req, res) => {

    const { teamId } = req.params;

    const sql = `
        SELECT
            jr.*,
            u.full_name
        FROM join_requests jr
        JOIN users u
        ON jr.user_id = u.user_id
        WHERE jr.team_id = ?
    `;

    db.query(sql, [teamId], (err, results) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(results);

    });

};
const acceptJoinRequest = (req, res) => {

    const { requestId } = req.params;

    const getSql = `
        SELECT *
        FROM join_requests
        WHERE request_id = ?
    `;

    db.query(getSql, [requestId], (err, results) => {

        if (err) {
            return res.status(500).json(err);
        }

        const request = results[0];

        db.query(
            `
            UPDATE join_requests
            SET status='ACCEPTED'
            WHERE request_id=?
            `,
            [requestId]
        );

        db.query(
            `
            INSERT INTO team_members
            (
                team_id,
                user_id,
                player_name,
                role,
                status
            )
            VALUES
            (
                ?,
                ?,
                '',
                'PLAYER',
                'ACCEPTED'
            )
            `,
            [request.team_id, request.user_id]
        );

        res.json({
            message: "Join Request Accepted"
        });

    });

};
const rejectJoinRequest = (req, res) => {

    const { requestId } = req.params;

    const sql = `
        UPDATE join_requests
        SET status='REJECTED'
        WHERE request_id=?
    `;

    db.query(sql, [requestId], (err) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            message: "Join Request Rejected"
        });

    });

};

module.exports = {
    createTeam,
    getTeams,
    getMyTeam,
    getTeamInvitations,
    getTeamMembers,
    removePlayer,
    createJoinRequest,
    getJoinRequests,
    acceptJoinRequest,
    rejectJoinRequest,



};

