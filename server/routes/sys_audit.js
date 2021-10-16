const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorize");
const { networkInterfaces } = require('os');

//Current Date
const fecha_actual = () => {
    let date_cur = new Date();
    let day = String(date_cur.getDate()).padStart(2, '0');
    let month = String(date_cur.getMonth() + 1).padStart(2, '0');
    let year = date_cur.getFullYear();
    date_cur = day + '-' + month + '-' + year;

    return date_cur;
  }

//Current Time
const hora_actual = () => {
    let hour_cur = new Date();
    let hour = String(hour_cur.getHours()).padStart(2, '0');
    let min = String(hour_cur.getMinutes()).padStart(2, '0');
    let secs = String(hour_cur.getSeconds()).padStart(2, '0');
    hour_cur = hour + ':' + min + ':' + secs;

    return hour_cur;
  }  


//Records all associated data in the System Audit
const reg_audi = (evento,tabla,descr,usuario) => {
    try {
        const netInterfaces = networkInterfaces();
        const [{address}] = Object.values(netInterfaces).flatMap((netInterface) =>
            netInterface.filter((prop) => prop.family === "IPv4" && !prop.internal)
        );
        /*At the const [{address}] we brought like that, because we need directly the address and not the whole Json tree*/
        //console.log("ip maquina:",address)
        const jsonAudi = {
            "curdate": fecha_actual(),
            "curhour": hora_actual(),
            "event": evento,
            "table": tabla,
            "descrp": descr,
            "ipmaq": address,
            "name": usuario,
        }
        var stringified = JSON.stringify(jsonAudi);
        const obj_audi = JSON.parse(stringified);
        console.log("auditoria almacenada", obj_audi);
    } catch (error) {
        console.error("Error en Auditoria por estos motivos:", error.message);
    }
};

//List all associated data in the System Audit
router.get("/get_listaud", async(req,res) => {
    try {
        const response = await pool.query("select * from  auditoria");
        res.json(response.rows);
    } catch (error) {
        console.error(error.message);
    }
})

//Search and list events and uses in the System Audit
router.get("/search_listaud", async (req, res) => {
    try {
      const { evento , usuario } = req.params;
      const searchaudit = await pool.query("SELECT * from auditoria where evento= $1 and usuario= $2 ", [evento, usuario])
      res.json(searchaudit.rows[0]);
    } catch (error) {
      console.log(error.message)
    }
  });

module.exports = router;
module.exports = reg_audi;
 