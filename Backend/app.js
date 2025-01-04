const express = require('express');
const app = express();
const port = 8000;
const mongoose = require('mongoose');
app.use(express.json());


require("./DB/Conn.js");
var cors = require('cors');

// use it before all route definitions
app.use(cors({ origin: '*' }));

const router = require("./Route/Router");

app.use(router);

app.listen(port,()=>
{
    console.log("server at port number 8000");
}
);