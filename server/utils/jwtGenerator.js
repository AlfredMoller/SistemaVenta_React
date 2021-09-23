const jwt = require("jsonwebtoken");
require("dotenv").config();  //nos permitira obtener acceso a todas las variables de entornos

function jwtGenerator(id_user){
    const payload= {
            user: id_user
    };

   return jwt.sign(payload, process.env.jwSecret,{expiresIn: 60 * 60})   //en este caso decimos que el token expire en una hora, podemos poner en texto "1hr"
}



module.exports = jwtGenerator;