const db = require("../config/db");

const createMatch = (req, res) => {

    const {
        team_id,
        match_date,
        match_time,
        overs,
        location,
        prize_money,
        contact_number,
        notes
    } = req.body;

    const sql = `
        INSERT INTO match_posts
        (
            team_id,
            match_date,
            match_time,
            overs,
            location,
            prize_money,
            contact_number,
            notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            team_id,
            match_date,
            match_time,
            overs,
            location,
            prize_money,
            contact_number,
            notes
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.status(201).json({
                message: "Match Posted Successfully"
            });

        }
    );
};
const getMatches = (req, res) => {

    const sql = `
        SELECT
            mp.*,
            t.team_name
        FROM match_posts mp
        JOIN teams t
            ON mp.team_id = t.team_id
        ORDER BY mp.created_at DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(results);

    });

};

module.exports = {
    createMatch,
    getMatches
};