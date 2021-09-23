const express = require("express");
const app = express();
const cors = require("cors");

//Middlewares
app.use(cors());
app.use(express.json()); //req.body


//ROUTES

app.use("/auth", require("./routes/jwtAuth"));
app.use("/dashboard", require("./routes/dashboard"));

app.set('port', process.env.port || 5000);
let port= app.get('port');
 
app.listen(port, () =>{
    console.log(`app conectada en el puerto ${port}`);
})
