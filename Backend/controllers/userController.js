const db = require("../config/db");
const jwt = require("jsonwebtoken");
const registerUser = (req, res) => {

    const { full_name, email, mobile, password } = req.body;

    const sql = `
        INSERT INTO users
        (full_name,email,mobile,password)
        VALUES (?,?,?,?)
    `;

    db.query(
        sql,
        [full_name, email, mobile, password],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.status(201).json({
                message: "User Registered Successfully"
            });

        }
    );
};

const loginUser = (req, res) => {

    const { email, password } = req.body;

    const sql =
        "SELECT * FROM users WHERE email = ? AND password = ?";

    db.query(
        sql,
        [email, password],
        (err, results) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (results.length === 0) {
                return res.status(401).json({
                    message: "Invalid Credentials"
                });
            }

            const token = jwt.sign(
    {
        user_id: results[0].user_id,
        email: results[0].email
    },
    process.env.JWT_SECRET,
    {
        expiresIn: "7d"
    }
);

res.json({
    message: "Login Successful",
    token,
    user: results[0]
});
        }
    );
};

module.exports = {
    registerUser,
    loginUser
};
