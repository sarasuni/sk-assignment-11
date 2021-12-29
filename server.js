// adding required modules
const express = require ("express");
const path = require("path");

// create server application at port 3000
const app = express();
const PORT = process.env.PORT || 3000;

//read URL or JSON 
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Including js files
require("./routes/apiRoutes.js")(app);
require("./routes/htmlRoutes.js")(app);

//use public folder
app.use(express.static ("public"));

//add listener
app.listen(PORT,function(){
    console.log("app listening on PORT:"+PORT);
});
