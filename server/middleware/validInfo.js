module.exports = function(req,res,next)  {
    const {mail,usr_name,pass} = req.body;
    
    function chk_valid_mail(usr_mail) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(usr_mail); //checkamos por medio de un regex si el email es valido
    }

    if(req.path === "/regt_user"){
        //console.log(!email.length);

        if (![mail, usr_name, pass].every(Boolean)) {    //verificamos si dentro del arregrlo falta uno de caulquiera de los datos por medio de la funcion every
            return res.json("Faltan credenciales");
        }else if(!chk_valid_mail(mail)){
            return res.json("El E-mail es Invalido");
        }
    }else if(req.path === "/login_usr"){
        if(![mail,pass].every(Boolean)){      //verificamos si dentro del arregrlo falta uno de caulquiera de los datos por medio de la funcion every
            return res.json("Faltan credenciales");
        }else if(!chk_valid_mail(mail)){
            return res.json("El E-mail es Invalido");
        }
    }

    next();
};