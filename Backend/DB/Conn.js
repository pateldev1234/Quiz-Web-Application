const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/Quiz").then(()=>{
    console.log("Connection with DB successfully completed");
}).catch(()=>
{
console.log("There is some error in the connection")
});

