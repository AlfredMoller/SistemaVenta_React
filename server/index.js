const express = require("express");
const app = express();
const cors = require("cors");

//Middlewares
app.use(cors());
app.use(express.json()); //req.body


//Routes to DashBoard And Authentication
app.use("/auth", require("./routes/jwtAuth"));
app.use("/dashboard", require("./routes/dashboard"));

//Routes to Department


//Routes to Product
app.use("/product", require("./routes/product"));
//Routes to Product Categories
app.use("/categ", require("./routes/categories"));
//Routes to System Auditory
app.use("/sysaudit", require("./routes/sys_audit"));

app.set('port', process.env.port || 5000);
let port= app.get('port');
 
app.listen(port, () =>{
    console.log(`app conectada en el puerto ${port}`);
})
