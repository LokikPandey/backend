import express from "express";
import path from "path"
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt  from "bcrypt";


const app= express();
app.listen(6011,()=>{
    console.log("connected");
});
app.set("view engine","ejs");
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended : true }));
app.use(cookieParser())
// app.get("/",(req,res)=>{;
//     res.render("index");
// });

mongoose.connect("mongodb://localhost:27017",{
    dbName:"backend"
}).then(()=>console.log("connected to database")).catch((e)=>console.log(e));

const userschema=new mongoose.Schema({
    name:String,email:String,password:String,
});

const user = mongoose.model("user",userschema);



const isAuthenticate= async (req,res,next)=>{
    const {token} =req.cookies;
    if(token){
        const  decoded=jwt.verify(token,"abcdefgh");
        req.user=await user.findById(decoded._id);

        next();}
    else res.render("index");
}
app.post("/login",async (req,res)=>{
    // res.render("success");/
    // console.log(req.body);
    const {email,password}=req.body;
    let userid=await user.findOne({email});
    if(!userid){
        return res.redirect("/register");
    }

    const ismatch= await bcrypt.compare(password,userid.password);
    if(!ismatch)
    {
        return res.render("index",{email,message:"Incorrect Password"});
    }
    const token=jwt.sign({_id:userid._id},"abcdefgh");
    // console.log(token);

    res.cookie("token",token,{
        httpOnly :true, 
        expires: new Date(Date.now()+60*1000)
    });
    res.redirect("/");
});
app
app.get("/logout",(req,res)=>{
    res.cookie("token",null,{
        httpOnly :true,
        expires: new Date(Date.now())
    });
    res.redirect("/");
})
app.get("/",isAuthenticate,(req,res)=>{
    // console.log(req.user);

    res.render("logout",{name:req.user.name});
});

app.get("/register",(req,res)=>{
    res.render("register");
})

app.post("/register",async(req,res)=>{
    const {name,email,password} =req.body;
    let Usera=await user.findOne({email});
    if(Usera) res.redirect("/");
    const hashedpass=await bcrypt.hash(password,10);
    Usera =await user.create({
        name,email,password:hashedpass,
    })

    const token = jwt.sign({ _id: Usera._id }, "abcdefgh");

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 1000),
    });
    res.redirect("/");

})

// app.get("/",(req,res)=>{
//     // console.log(req.cookies);
//     const {token}= req.cookies;
//     if(token)
//     {
//         res.render("logout");
//     }
//     else res.render("index");

    
// })
