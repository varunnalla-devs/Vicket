const db = require("../config/db");

const createRequest = (req, res) => {

    const { match_id, requesting_team_id } = req.body;

    const checkMatchSql = `
        SELECT status
        FROM match_posts
        WHERE match_id = ?
    `;

    db.query(checkMatchSql, [match_id], (err, results) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Match Not Found"
            });
        }

        if (results[0].status === "CLOSED") {
            return res.status(400).json({
                message: "Match Already Closed"
            });
        }

        const sql = `
            INSERT INTO match_requests
            (match_id, requesting_team_id)
            VALUES (?, ?)
        `;

        db.query(
            sql,
            [match_id, requesting_team_id],
            (err, result) => {

                if (err) {
                    return res.status(500).json(err);
                }

                res.status(201).json({
                    message: "Match Request Sent"
                });

            }
        );

    });

};
const getRequestsByMatch = (req, res) => {

    const { matchId } = req.params;

    const sql = `
        SELECT
            mr.*,
            t.team_name
        FROM match_requests mr
        JOIN teams t
            ON mr.requesting_team_id = t.team_id
        WHERE mr.match_id = ?
    `;

    db.query(sql, [matchId], (err, results) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(results);

    });

};
const acceptRequest = (req, res) => {

    const { requestId } = req.params;

    const getMatchSql = `
        SELECT match_id
        FROM match_requests
        WHERE request_id = ?
    `;

    db.query(getMatchSql, [requestId], (err, results) => {

        if (err) {
            return res.status(500).json(err);
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Request Not Found"
            });
        }

        const matchId = results[0].match_id;

        const acceptSql = `
            UPDATE match_requests
            SET status = 'ACCEPTED'
            WHERE request_id = ?
        `;

        db.query(acceptSql, [requestId], (err) => {

            if (err) {
                return res.status(500).json(err);
            }

            const closeMatchSql = `
                UPDATE match_posts
                SET status = 'CLOSED'
                WHERE match_id = ?
            `;

            db.query(closeMatchSql, [matchId], (err) => {

                if (err) {
                    return res.status(500).json(err);
                }

                res.json({
                    message: "Match Accepted & Closed"
                });

            });

        });

    });

};
module.exports = {
    createRequest,
    getRequestsByMatch,
     acceptRequest 

};