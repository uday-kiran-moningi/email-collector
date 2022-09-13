const request = require("request");
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { response } = require("express");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/start.html");
});
app.post("/",function(req,res){
    
    var fname= req.body.first_name;
    var lname= req.body.last_name;
    var email= req.body.email;

    console.log(fname,lname,email);

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fname,
                    LNAME: lname
                }
            }
        ]
    };

    const jsdata = JSON.stringify(data);

    const url= "https://us9.api.mailchimp.com/3.0/lists/595126a635";
    const options={
        method:"POST",
        auth:"key:2f2a00bb40e0883e40956276c8d31f8b-us9"
    }

    const request = https.request(url,options,function(response){
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    });
    request.write(jsdata);
    request.end();
    if(response.statusCode==200){
        res.sendFile(__dirname + "/sucess.html");
    }else{
        res.sendFile(__dirname+"/fail.html");
    }
});

app.post("/fail",function(req,res){
    res.redirect("/");
})
app.post("/sucess",function(req,res){
    res.redirect("/");
})
app.listen(process.env.PORT || 3000 ,function(){
    console.log("listening on port 3000");
})

// api key : 2f2a00bb40e0883e40956276c8d31f8b-us9
// list id:  595126a635