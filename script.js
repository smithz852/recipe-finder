var ingrediant = 'spinach'
var foodAPI = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=' + ingrediant;
var mealID = ''




var dishArray = [];
var dishDetials = [];

fetchFoodAPI();

function fetchFoodAPI() {
    fetch(foodAPI).then(function(response) {
        console.log(foodAPI);
        return response.json();
    }).then(function(data) {
        console.log(data);
// loop for pulling meal names out of data based on a search for one ingrediant
        for (var i = 0; i < data.meals.length; i++) {
            dishArray.push(data.meals[i].idMeal)
            
        }
        console.log(dishArray);

      fetchDishAPI();

    })
}

function fetchDishAPI() {
      // loop for pulling meal names out of dishArray to search for each meal and provide all ingrediants needed
      for (var i = 0; i < dishArray.length; i++) {
        mealID = dishArray[i]
        var dishInfoAPI = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + mealID;
        console.log(mealID)
        fetch(dishInfoAPI).then(function(response) {
            return response.json();
        }).then(function(data) {
            console.log(data);

           dishDetials.push(data)

        })
    }
    console.log(dishDetials);
}