// jshint esversion:6

const express=require("express");
const bodyParse=require("body-parser");
require('dotenv').config();
const request=require("request");
const https=require("https");


const app=express();
app.use(express.static("public"));
app.use(bodyParse.urlencoded({extended:true}));
app.get("/",function(req,res){
  res.sendFile(__dirname + "/signup.html");
});


app.post("/",function(req,res){
  const firstName=req.body.fname;
  const secondName=req.body.sname;
  const mail=req.body.mail;
  console.log(firstName,secondName,mail)
  const data={
    members:[
      {
        email_address:mail,
        status:"subscribed",
        merge_fields:{
          FNAME:firstName,
          LNAME:secondName,
        }
      }
    ]
  };
const jsondata=JSON.stringify(data);
const url=process.env.URL;

const option={
  method:"POST",
  auth:process.env.AUTH
};
const request=https.request(url,option,function(response){
  if(response.statusCode===200)
  {
    res.sendFile(__dirname + "/success.html");
  }
  else{
    res.sendFile(__dirname + "/failure.html");

  }
  response.on("data",function(data){
    console.log(JSON.parse(data));
  });
});
request.write(jsondata);
request.end();

});

app.post("/failure",function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT||3000,function()
{
  console.log("listening");
});
