const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://Sawraj5:Sawraj5%40@cluster0.bhqpcte.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(()=>{
    console.log("Connection with DB successfully completed");
}).catch(()=>
{
console.log("There is some error in the connection")
});

