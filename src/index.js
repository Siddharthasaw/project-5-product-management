const express = require("express");
const mongoose = require("mongoose");
const route = require("./route/route");
const multer = require("multer");
const app = express();

app.use(express.json())
app.use(multer().any())

mongoose.connect("mongodb+srv://Siddharth609:q8PCZ8BpcFz4-nc@cluster0.thktdho.mongodb.net/project-5",{
    useNewUrlParser:true
})

.then(()=>console.log("mongoDB is conected"))
.catch((err)=>console.log(err))


app.use("/",route)


app.listen(process.env.PORT||3000,()=>{
    console.log("Application running in 3000")
})


