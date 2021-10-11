const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorize");


router.post("/regt_prod", async (req, res) => {
    try {
        const { producto,precioCompra,ivaCompra,montocompra,stock,preciov,ivaventa,montoventa,category } = req.body;
        const jsonProd = {
            "producto": producto,
            "precio_compra": precioCompra,
            "iva_compra": ivaCompra,
            "monto_compra": montocompra,
            "stock": stock,
            "precio_venta": preciov,
            "iva_venta": ivaventa,
            "monto_venta": montoventa,
            "cat":category

        }
        const stringf_prod = JSON.stringify(jsonProd);
        const obj_prod = JSON.parse(stringf_prod);
        console.log("producto almacenado", obj_prod)

    } catch (error) {
        console.error("Error en producto:", error.message)
    }
})


router.post("/regt_audi", async (req, res) => {
    try {
        const { fecha, hora, usuario, evento, tabla, descr } = req.body;

        const jsonAudi = {
            "curdate": fecha,
            "curhour": hora,
            "name": usuario,
            "event": evento,
            "table": tabla,
            "descrp": descr
        }
        var stringified = JSON.stringify(jsonAudi);
        const obj_audi = JSON.parse(stringified);
        console.log("auditoria almacenada", obj_audi)

    } catch (error) {
        console.error("Error en producto:", error.message)
    }
})


router.get("/get_cat", async(req,res) => {
    try {
        const response = await pool.query("select * from  cate_prod");
        res.json(response.rows);
    } catch (error) {
        console.error(error.message);
    }
})

router.post("/regt_cat", async (req, res) => {
    try {
        const {ref_cat, nomb_cat} = req.body;
        console.log("cate:",ref_cat)

        const jsonCat = {
            "referencia": ref_cat,
            "nombre_cat": nomb_cat,
        }

       const record_cat = await pool.query("INSERT INTO cate_prod(ref_categoria, nomb_categoria) VALUES ($1, $2) RETURNING *", [ref_cat, nomb_cat]);
        var stringf_cat = JSON.stringify(jsonCat);
        const obj_cat = JSON.parse(stringf_cat);
        console.log("Categoria almacenada", obj_cat)
        res.json(record_cat)

    } catch (error) {
        console.error("Error en categoria:", error.message)
    }
})

module.exports = router