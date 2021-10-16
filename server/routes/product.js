const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorize");
var format = require("pg-format");


const reg_audi = require("../routes/sys_audit");
var tabla = "producto";
var evento = "";
//const format = require("pg-format");


//Record all products
router.post("/regt_prod", async (req, res) => {
    try {
        const { producto, precioCompra, ivaCompra, montocompra, stockact, stockmax, stockmin, preciov, ivaventa, montoventa, category } = req.body;
        const jsonProd = {
            "producto": producto,
            "precio_compra": precioCompra,
            "iva_compra": ivaCompra,
            "monto_compra": montocompra,
            "stockact": stockact,
            "stockmax": stockmax,
            "stockmin": stockmin,
            "precio_venta": preciov,
            "iva_venta": ivaventa,
            "monto_venta": montoventa,
            "cat": category
        }


        const  list_prod = [[producto, precioCompra, ivaCompra, montocompra, stockact, stockmax, stockmin, preciov, ivaventa, montoventa, category]];

        const stringf_prod = JSON.stringify(jsonProd);
        const obj_prod = JSON.parse(stringf_prod);
        console.log("producto almacenado", obj_prod);

        //const add_query =  "INSERT INTO producto (nomb_prod, precio_compra, iva_compra, monto_ivac, stock_act, stock_max, stock_min, precio_venta, iva_venta, monto_ivav, id_categoria) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)";
        const addquery = format("INSERT INTO producto (nomb_prod, precio_compra, iva_compra, monto_ivac, stock_act, stock_max, stock_min, precio_venta, iva_venta, monto_ivav, id_categoria) VALUES %L", list_prod)
        await pool.query(addquery);

        evento = "Guardar";
        const usuario = "moller"
        descripcion = "Producto con nombre:" + " " + producto;
        reg_audi(producto, tabla, evento, descripcion, usuario)

        res.json("Datos de producto almacenados");

    } catch (error) {
        console.error("Error al tratar de insertar el producto:", error.message);
    }
})


//Update the selected product record by id
router.put("/edt_prod/:id", async (req, res) => {
    try {
        const { producto, precioCompra, ivaCompra, montocompra, stockact, stockmax, stockmin, preciov, ivaventa, montoventa, category } = req.body;
        const { id } = req.params;

        const query_edit = "UPDATE producto SET nomb_prod= $1, precio_compra= $2, iva_compra= $3, monto_ivac= $4, stock_act= $5, stock_max= $6, stock_min= $7, precio_venta= $8, iva_venta= $9, monto_ivav= $10, id_categoria= $11 WHERE idproducto= $12";

        await pool.query(query_edit, [producto, precioCompra, ivaCompra, montocompra, stockact, stockmax, stockmin, preciov, ivaventa, montoventa, category, id]);

        evento = "Editar";
        const usuario = "moller"
        descripcion = "Producto guardado Con nombre:" + " " + producto;
        reg_audi(producto, tabla, evento, descripcion, usuario)

        res.json("Datos de productos actualizados!");

    } catch (error) {
        console.error("Error al tratar de actualizar produto:", error.message);
    }
});


//Delete the selected product record by id
router.delete("/del_prod/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const query_del = "DELETE from producto where idproducto= $1";

        //await pool.query(query_del, [id_producto]);
        evento = "Eliminar";
        console.log("params", id)
        const usuario = "moller"

        let product_val = await prod_byid(id);
        descripcion = "Producto con nombre:" + " " + product_val;
        reg_audi(product_val, tabla, evento, descripcion, usuario)

        res.json("Datos de producto eliminados!");
    } catch (error) {
        console.log("Error al tratar de eliminar producto:", error.message);
    }
});


//Function to bring all the products by Id
const prod_byid = async (id) => {
    try {
        /*const query_sel = {
            text: 'SELECT nomb_prod from producto where idproducto= $1',
            values: [id],
            rowMode: 'array',
          }

        const sel_idq = await pool.query(query_sel);*/
        const sel_byid = await pool.query("SELECT nomb_prod from producto where idproducto= $1", [id]);
        let obj_selid = sel_byid.rows[0]
        return obj_selid['nomb_prod']
        //console.log("producto:", obj_selid['nomb_prod'])
    } catch (error) {
        console.error("Error al traer nombre de producto:", error.message);
    }
}


module.exports = router