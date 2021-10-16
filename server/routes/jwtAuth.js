const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorize");


/*El código de respuesta para el estado de error del cliente indica que la solicitud no se aplicó
 porque carece de credenciales de autenticación válidas para el recurso de destino*/

//Ruta de registro de usuario
router.post("/regt_user", validInfo, async (req, res) => {
    const { usr_name, mail, pass } = req.body;
    try {
        const check_usr = await pool.query("SELECT * FROM users WHERE user_mail = $1", [mail]);

        if (check_usr.rows.length > 0) {
            return res.status(401).json("Este usuario ya existe!!!");

        }

        /*en caso de que usemos callbacks
        bcrypt.genSalt(salt_round, function(err,salt){
            bcrypt.hash(pass,salt, function(err,hash){

            })
        })
        
        */

        const salt_round = 10;
        const generate_salt = await bcrypt.genSalt(salt_round);
        //le damos  un costo de 10 que tardara 65.683 ms en generar el salt  -> no olvidar poner el await, porque tardara mas tiempo de lo normal en realziar el hash
        const final_salt = await bcrypt.hash(pass, generate_salt);

        const record_usr = await pool.query("INSERT INTO users(username, user_mail, password) VALUES ($1, $2, $3) RETURNING *", [usr_name, mail, final_salt]);

        const jwtToken = jwtGenerator(record_usr.rows[0].id_users)

        res.json({ jwtToken });
    } catch (error) {
        console.log(error.message);
    }
})

//Ruta de logeo de usuario
router.post("/login_usr", validInfo, async (req, res) => {
    const { mail, pass } = req.body;

    try {
        const chk_log = await pool.query("SELECT * FROM users WHERE user_mail = $1", [mail]);

        if (chk_log.rows === 0) {
            return res.status(401).json("No existe el usuario con esta credencial");

        }

        const bcrypt_chk = await bcrypt.compare(pass, chk_log.rows[0].password); // row[0] es porque traemos el primer item
        if (!bcrypt_chk) {
            return res.status(401).json("La contraseña dek usuario no corresponde");
        }

        /* WT es "simplemente" una cadena de texto que tiene 3 partes codificadas en Base64, separadas por un punto 
        (header.payload.firma) que generamos y entregamos a los clientes de nuestra APlicacion*/

        const jwtToken = jwtGenerator(chk_log.rows[0].id_users);

        res.json({ jwtToken });

    } catch (error) {
        console.log(error.message);
    }
});


//Ruta para verificar si el token del usuario posee autorizacion para acceder a las rutas
router.post("/verif_token", authorization, async (req, res) => {
    try {
        res.json(true);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Error del Servidor")
    }
});

module.exports = router;
