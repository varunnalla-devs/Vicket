const db = require("../config/db");

// Get User Invitations

const getUserInvitations = (req, res) => {

    const { userId } = req.params;

    const sql = `
        SELECT
            ti.*,
            t.team_name
        FROM team_invitations ti
        JOIN teams t
            ON ti.team_id = t.team_id
        WHERE ti.user_id = ?
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(results);

    });

};

// Accept Invitation

const acceptInvitation = (req, res) => {

    const { invitationId } = req.params;

    const getSql = `
        SELECT *
        FROM team_invitations
        WHERE invitation_id = ?
    `;

    db.query(getSql, [invitationId], (err, results) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Invitation Not Found"
            });
        }

        const invitation = results[0];

        const updateSql = `
            UPDATE team_invitations
            SET status = 'ACCEPTED'
            WHERE invitation_id = ?
        `;

        db.query(updateSql, [invitationId], (err) => {

            if (err) {
                return res.status(500).json(err);
            }

            const memberSql = `
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
            `;

            db.query(
                memberSql,
                [
                    invitation.team_id,
                    invitation.user_id
                ],
                (err) => {

                    if (err) {
                        return res.status(500).json(err);
                    }

                    res.json({
                        message: "Invitation Accepted"
                    });

                }
            );

        });

    });

};

// Reject Invitation

const rejectInvitation = (req, res) => {

    const { invitationId } = req.params;

    const sql = `
        UPDATE team_invitations
        SET status = 'REJECTED'
        WHERE invitation_id = ?
    `;

    db.query(sql, [invitationId], (err) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            message: "Invitation Rejected"
        });

    });

};

module.exports = {
    getUserInvitations,
    acceptInvitation,
    rejectInvitation
};