const router = require("express").Router();
const pool = require("../db");
const authorize = require("../middleware/authorize");

router.post("/", authorize, async (req, res) => {
    try {

        const user = await pool.query(
            "SELECT id_users ,username,user_mail  FROM users WHERE id_users = $1",
            [req.user]
        );
        res.json(user.rows[0]);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Error del Servidor");
    }
});

module.exports = router;
