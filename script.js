// For testing, will have blank array for user input later
var ingredient = ['chicken', 'spinach', 'lettuce', 'bread', 'apple', 'sausage'];
var foodAPI = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=' + ingredient;
var mealID = ''




var dishArray = [];
var finalDishes = [];
var matchArray = [];

// put in click function
fetchFoodAPI();


function fetchFoodAPI() {

for (var i = 0; i < ingredient.length; i++) {
console.log(ingredient[i])
    var foodAPI = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=' + ingredient[i];


    fetch(foodAPI).then(function(response) {
        // console.log(foodAPI);
        return response.json();
    }).then(function(data) {
        console.log(data);
// loop for pulling meal names out of data based on a search for one ingredient
        for (var i = 0; i < data.meals.length; i++) {
            dishArray.push(JSON.parse(data.meals[i].idMeal));
        }
    })
}


setTimeout (function() {

    dishArray.sort(function(a, b){return a - b});

    console.log(dishArray);

    setTimeout (function() {

        for (var i = 0; i < dishArray.length; i++) {
            if (dishArray[i] === dishArray[i+1]) {
                matchArray.push(dishArray[i]);
            }
        }
    console.log(matchArray);
    fetchDishAPI();
    },1500)
    
  }, 1500)
}

function fetchDishAPI() {
      // loop for pulling meal names out of dishArray to search for each meal and provide all ingredients needed
      for (var i = 0; i < matchArray.length; i++) {
        mealID = matchArray[i]
        var dishInfoAPI = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + mealID;
        console.log(mealID)
        fetch(dishInfoAPI).then(function(response) {
            return response.json();
        }).then(function(data) {
        // console.log(data)
           finalDishes.push(data.meals[0])

        })
    }
    console.log(finalDishes); 
}

