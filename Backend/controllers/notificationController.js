const db = require("../config/db");

const getNotifications = (req, res) => {

    const { userId } = req.params;

    const sql = `
        SELECT *
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(results);

    });

};

module.exports = {
    getNotifications
};