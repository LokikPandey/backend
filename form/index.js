import express from "express";
import path from "path";
import mongoose from "mongoose";
import { name } from "ejs";

//connecting to mongo and defining the schema
mongoose.connect("mongodb://localhost:27017",{
    dbName: "backend"
}).then(()=>console.log("connected to mongo")).catch((e)=>console.log(e));

const msgschema=new mongoose.Schema({
    name:String,
    email:String,
});
const Message=mongoose.model("Message",msgschema);



const app=express();
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended : true }));

// const data=[];

app.set("view engine","ejs");
app.get("/",(req,res)=>{
    res.render("index");
    
})
 app.post("/",async (req,res)=>{
    // console.log(req.body);
    // data.push({name:req.body.name},{email:req.body.email});
    // console.log(data);
    const {name,email}=req.body;
    await Message.create({name:name, email:email})
    res.render("success");
    
});


app.get("/add",async (req,res)=>{
    await Message.create({name:"kartik",email:"sample2@gmail"}).then(()=>{
        res.send("<h1>Add</h1>")
    })
});
// app.get("/users",(req,res)=>{
//     res.json({
//         data,
//     });
// });
 
app.listen(6010,()=>{
    console.log('running');
})

