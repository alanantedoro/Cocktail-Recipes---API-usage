const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();

const https = require('https');
const { resourceUsage } = require("process");


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
      const chunks = [];
      const drinkNames = [];
      const drinkImgs = [];
      const drinkRecipe = [];
      const drinkIngredients = [];

     response.on("data", function(chunk){
      chunks.push(chunk);
      });

    response.on("end", function(){
      const data = Buffer.concat(chunks);
      var results = JSON.parse(data);

      if(results.drinks !== null){
        console.log(results.drinks.length);
        for (let i=0; results.drinks.length; i++){
          try{
            drinkNames.push(results.drinks[i].strDrink);
            drinkImgs.push(results.drinks[i].strDrinkThumb);
            drinkRecipe.push(results.drinks[i].strInstructions);            
          }
          catch (e) { 
            console.log(drinkNames, drinkImgs, drinkRecipe);
    
          break;
          }


        };
        
        res.render("result", { 
          names: drinkNames,
          imgs: drinkImgs,
          recipes: drinkRecipe
        });

      } else { 
        res.render("fail");     


       }
      });
      
    });
  });
 
    app.listen(3000, function(){
    console.log("Server runing on port 3000.");
});



/* Probably need to move everything into objects to add the ingredients. TBD

function Cocktail(name, image, descr, ingredients){
  this.name = name,
  this.image = image;
  this.description = descr,
  this.ingredients = ingredients
}

var drink = new Cocktail (results.drinks[i].strDrink, 
  results.drinks[i].strDrinkThumb,
  results.drinks[i].strInstructions,
  results.drinks[i].strInstructions,
  for (i=1; i < 16; i++){
    results.drinks[i].strIngredient
  }
  
);

drinks.push(drink) */