const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = async (req,res, next) =>{   //si todos los procesos estan bien...conituamos con next
    try {
            const token = req.header("token"); //obtenemos el token del header del navegador 

            if(!token){
                /*Un error 403 es un error que se encuentra en las páginas web, lo que significa que la página web
                    intentaste ir a está prohibido y se supone que no debes acceder a él. */
                return res.status(403).json("Accion Denegada al supuesto usuario")
            }

            const payload = jwt.verify(token, process.env.jwSecret); //verificamos si el token es valido
            req.user = payload.user;
            next(); //no olvidar siempre el next, ya que si no se cumplen las condiciones negativas damos next, ya que significa que funciona
    } catch (error) {
        console.log(error.message);
        return res.status(401).json("Usuario no Autorizado")
    }
}