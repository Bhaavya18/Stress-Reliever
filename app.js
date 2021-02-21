require('dotenv').config();
const express = require('express');
const mongoose=require('mongoose');
const bodyParser = require("body-parser");
const request = require('request');
const https = require('https');
const app = express();
const currentTime = require(__dirname + "/currentTime.js");

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

let name;
mongoose.connect("mongodb+srv://admin_bhaavya:test123@cluster1.esqzc.mongodb.net/affirmationDB",{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const itemsSchema = mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item ({
  name: "Welcome to your todolist!"
});

const item2 = new Item ({
  name: "Hit a + button to add a new item."
});

const item3 = new Item ({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listSchema = mongoose.Schema({
  name: String,
  items: [itemsSchema]
});

const List = mongoose.model("List",listSchema);
//login route
app.get("/",function(req,res){
  res.sendFile(__dirname+"/login.html");
});
app.post("/", function(req, res) {
  const fname = req.body.fname;
  name=fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fname,
        LNAME: lname
      }
    }]
  };
  const jsonData = JSON.stringify(data);
  const url="https://us7.api.mailchimp.com/3.0/lists/"+process.env.LISTID;
  const options={
    method:"post",
    auth:process.env.AUTH
  };
  const request=https.request(url,options,function(response){
    if(response.statusCode===200){
      res.redirect("/home");
    }
    else{
      res.sendFile(__dirname+"/failure.html");
    }
  });
  request.write(jsonData);
  request.end();
});
app.post("/failure",function(req,res){
  res.redirect("/");
});
//home route
app.get("/home", function(req, res) {
  let time = currentTime();
  Item.find({}, function(err,foundItems){

    if(foundItems.length===0){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("Successfully added default items");
        }
      });
      res.redirect("/home");
    }else{
      res.render("index", {
       cid: time.collectid,
       wish: time.greeting,
       affirmation:time.affirmation,
       listTitle: "Today",
       newListItems: foundItems,
       name:name
     });
    }
  });

});
app.post("/home", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if(listName === "Today")
  {
    item.save();
    res.redirect("/home");
  }

});

app.post("/delete",function(req,res){
  const checkedItemId=req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today"){
    Item.deleteOne({_id: checkedItemId},function(err){
      if(!err){
        console.log("Success");
        res.redirect("/home");
      }
    });
  }
});
//relaxing sound route
app.get("/relaxing-sound",function(req,res){
  res.sendFile(__dirname+"/relaxing-sound.html");
});
//breathing excercise route
app.get("/breathing-excercise",function(req,res){
  res.sendFile(__dirname+"/breathing-excercise.html");
});
//white noise route
app.get("/white-noise",function(req,res){
  res.sendFile(__dirname+"/white-noise.html");
});
//meditation Zone
app.get("/meditation-zone",function(req,res){
  res.sendFile(__dirname+"/meditation-zone.html");
});
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("server is runing on port 3000");
});
