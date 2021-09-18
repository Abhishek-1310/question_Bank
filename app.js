const bodyParser = require("body-parser");
const express=require("express");
const ejs=require("ejs");



const app=express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/qbankdb",{useNewUrlParser:true,useUnifiedTopology:true});

const userdtaSchema=new mongoose.Schema({
    email:String,
    password:String
})
const Data=mongoose.model("Data",userdtaSchema);
const qbankSchema=new mongoose.Schema({
    title:String,
    content:String,
    answer: String
});

const Bank=mongoose.model("Bank",qbankSchema);

const trial_que="First open our website,then got to ask me button ,if you want to ask question you have to login first then go to ask question put your title and ask question then publish your question ";

app.set('view engine','ejs');

app.get("/main",function(req,res){

    Bank.find({},function(err,banks){

        res.render("main" ,{
            s_cont: trial_que,
            posts: banks,
            
        });
    });

});

app.get("/signup",function(req,res){
    res.render("signup");
});

app.get("/",function(req,res){
    res.render("index");
});

app.get("/ask",function(req,res){
    
    res.redirect("login");
    
});

app.get("/index",function(req,res){
    res.render("index");
});
app.get("/login",function(req,res){
    res.render("login");
});

app.post("/compose",function(req,res){

    const bank= new Bank({
        title:req.body.publish,
        content:req.body.text1
    });

    bank.save(function(err){
        if(!err){
            res.redirect("/main");
        }
    });

    
});
app.post("/add",function(req,res){
    
    const checkedItem=req.body.list;
    const listName= req.body.newitem;
    Bank.findByIdAndUpdate(checkedItem, { answer: listName },
                            function (err, docs) {
    if (err){
        console.log(err)
    }
    else{
        console.log("Updated Answer: ");
        res.redirect("/main");
    }
});
    
   
});
app.post('/register',function(req,res){

    const user=new Data({
        email:req.body.user,
        password:req.body.pass
    });
    user.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("ask");
        }
    });
   
  
    
});


app.post('/login',function(req,res){

   const username=req.body.user;
   const password=req.body.pass

   Data.findOne({email:username},function(err,found){
       if(err){
           console.log(err);
       }else{
           if(found){
               if(found.password==password){
                   res.render("ask");
               }
           }
       }
   })


});

app.listen(3000,function(){
    console.log("Server Started on port 3000");
});