const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorize");
var format = require("pg-format");

const reg_audi = require("../routes/sys_audit");
var tabla = "cate_prod";
var evento = "";


//Record all products categories
router.post("/regt_cat", async (req, res) => {
    try {
        const { ref_cat, nomb_cat } = req.body;
        let list_cat = [[ref_cat, nomb_cat]];

        const check_catprod = await pool.query("SELECT * from cate_prod where nomb_categoria = $1", [nomb_cat]);
        let tam_catprod = check_catprod.rows.length;

        if (!tam_catprod == 0) {
            res.json({ status: 200, msg: "Este producto se registro anteriormente!" });
        } else {
            const record_cat = format('INSERT INTO cate_prod (ref_categoria, nomb_categoria) VALUES %L', list_cat);
            await pool.query(record_cat);
            let stringf_cat = JSON.stringify(record_cat);
            const obj_cat = JSON.parse(stringf_cat);
            console.log("Categoria almacenada", obj_cat);

            evento = "Guardar";
            const usuario = "moller"
            descripcion = "Categoria con nombre:" + " " + nomb_cat;
            reg_audi(nomb_cat, tabla, evento, descripcion, usuario);
            res.json({ status: 404, msg: "Datos de categoria de producto almacenados!" });
        }

    } catch (error) {
        console.error("Error en categoria:", error.message);
    }
});


//Update the selected product record by id
router.put("/edit_cat/:id", async (req, res) => {
    const { ref_cat, nomb_cat } = req.body;
    const { id } = req.params;

    const check_catprod = await pool.query("SELECT * from cate_prod where nomb_categoria= $1 and ref_categoria= $2 and id_categoria= $3 ", [nomb_cat, ref_cat, id]);
    let tam_catprod = check_catprod.rows.length;

    if (!tam_catprod == 0) {
        res.json({ status: 426, msg: "Los datos requiren ser modificados, al menos uno!" })
    } else {
        const query_edtcat = "UPDATE cate_prod SET ref_categoria= $1, nomb_categoria= $2 where id_categoria= $3"
        await pool.query(query_edtcat, [ref_cat, nomb_cat, id]);

        evento = "Editar";
        const usuario = "moller"
        descripcion = "Categoria con nombre:" + " " + nomb_cat;
        reg_audi(nomb_cat, tabla, evento, descripcion, usuario)

        res.json({ status: 200, msg: "Datos de categoria de producto actualizados!" });
    }
});


//Delete the selected categories record by id
router.delete("/del_cat/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const query_delcat = "DELETE from cate_prod where id_categoria= $1";
        await pool.query(query_delcat, [id]);

        evento = "Eliminar";
        const usuario = "moller"
        let cat_val = await cat_byid(id);
        descripcion = "Categoria con nombre:" + " " + cat_val;
        reg_audi(cat_val, tabla, evento, descripcion, usuario)

        res.json({ status: 200, msg: "Datos de categoria de producto eliminado!" });
    } catch (error) {
        console.error("Error al tratar de actualizar categoria de producto:", error.message);
    }

});


//Function to bring all the products by Id
const cat_byid = async (id) => {
    try {
        const sel_byid = await pool.query("SELECT nomb_categoria from cate_prod where id_categoria= $1", [id]);
        let obj_selid = sel_byid.rows[0]
        return obj_selid['nomb_prod']
    } catch (error) {
        console.error("Error al traer nombre de categoria:", error.message);
    }
}


//List all products categories
router.get("/get_cat", async (req, res) => {
    try {
        const response = await pool.query("select * from cate_prod");
        res.json(response.rows);
    } catch (error) {
        console.error(error.message);
    }
});



module.exports = router;