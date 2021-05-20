const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();

const https = require('https');


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");


   

app.get("/", function (req, res) {
  const pChoice = ["Work is the curse of the drinking classes", "A bartender is just a pharmacist with a limited inventory.", "A good writer is not, per se, a good book critic. No more so than a good drunk is automatically a good bartender."]
  let choose = pChoice[Math.floor(Math.random()* pChoice.length)];
  res.render("home", { mainP: choose });
});


app.post("/", function(req, res){

    const query = req.body.searchBox;

    console.log(query);

    const url = "https://thecocktaildb.com/api/json/v1/1/search.php?s="+ query;

    https.get(url,function(response){
        console.log(response.statusCode);
        var cocktailData = "";
        
     response.on("data", function(data){
         cocktailData =+ data;
      });

      response.on("end", ()=> {
        try{
        let results = JSON.parse(cocktailData);
          console.log(results[0].strDrink);
        } 
        catch(error){
          console.error(error.message);
        };
        });

        response.on("error", (error) => {
          console.error(error.message)
        })
        res.send();
      });
    });


    app.listen(3000, function(){
    console.log("Server runing on port 3000.");
});