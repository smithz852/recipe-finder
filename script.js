// visibility of the dropdown menu
document.addEventListener('DOMContentLoaded', function () {
    var burger = document.querySelector('.navbar-burger');
    var dropdown = document.querySelector('.navbar-dropdown');

    burger.addEventListener('click', function () {
      // Toggle the display property of the dropdown
      dropdown.style.display = dropdown.style.display === 'none' || dropdown.style.display === '' ? 'block' : 'none';
    });
  });

//

function reloadPage() {
    location.reload();
  }

  
// Function to handle the user's cocktail search
function getCocktailInfo() {
    console.log('getCocktailInfo called');
    // Get the info from the input field
    var searchTerm = document.getElementById('ingredientInput').value;
    // Get the element where the error message will be displayed
    var errorMessageElement = document.getElementById('errorMessage');
    if (!searchTerm) {
        // Display an error message on the webpage
        errorMessageElement.textContent = "Please enter a cocktail name.";
        return;
    }
    // Clear any existing error messages
    errorMessageElement.textContent = '';
    // Fetch cocktails by search term
    fetchCocktails(searchTerm);
}
//function to make an API request and handle the response
function fetchCocktails(searchTerm) {
    //create a new request object
    var xhr = new XMLHttpRequest();
    // Define the function to handle the response
    xhr.onreadystatechange = function () {
        // Check if the request is complete
        if (xhr.readyState === 4) {
            //check if the response status is successful
            if (xhr.status === 200) {
                // parse to JSON response
                var result = JSON.parse(xhr.responseText);
                // Log the entire API response for issues
                console.log('API Response:', result);
                //display the retrieved cocktails
                displayIngredients(result.drinks);
            } else {
                //log errrors
                console.error('Error Status:', xhr.status);
                console.error('Error Response:', xhr.responseText);
            }
        }
    };
    // GET request to the cocktail API with the search term
    xhr.open('GET', 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + searchTerm, true);
    //send the request
    xhr.send();
}
//function to display cocktail information on the webpage
function displayIngredients(drinks) {
    console.log('API Response:', drinks);
    // Get the HTML element for the list of cocktails
    var ingredientListElement = document.getElementById('ingredientList');
    // Clear the existing content
    ingredientListElement.innerHTML = '';
    // Check if 'drinks' is an array and not empty
    if (Array.isArray(drinks) && drinks.length > 0) {
        // go through each drink and create an HTML element
        drinks.forEach(function (drink) {
            // Create a container div for each drink
            var drinkContainer = document.createElement('div');
            drinkContainer.classList.add('drink-container');

            // Create an h3 element for the drink name
            var nameHeading = document.createElement('h3');
            nameHeading.textContent = 'Name: ' + drink.strDrink;
            drinkContainer.appendChild(nameHeading);

            // Create a p element for the ingredients
            var ingredientsParagraph = document.createElement('p');
            ingredientsParagraph.textContent = 'Ingredients: ' + getIngredients(drink);
            drinkContainer.appendChild(ingredientsParagraph);

            // Create a p element for the instructions
            var instructionsParagraph = document.createElement('p');
            instructionsParagraph.textContent = 'Instructions: ' + drink.strInstructions;
            drinkContainer.appendChild(instructionsParagraph);

            // Append the drink container to the 'ingredientList' element
            ingredientListElement.appendChild(drinkContainer);
        });
    } else {
        // Log the entire API response to the console for issues
        console.log('API Response:', drinks);
        // Handle the case where 'drinks' is not a valid array
        ingredientListElement.textContent = 'No cocktails found.';
    }
}
//function to extract and format ingredients from a drink object
function getIngredients(drink) {
    // Extract and join the ingredients from the drink object
    var ingredients = [];
    for (var i = 1; i <= 15; i++) {
        var ingredient = drink['strIngredient' + i];
        var measure = drink['strMeasure' + i];
        if (ingredient && measure) {
            ingredients.push(measure + ' ' + ingredient);
        } else if (ingredient) {
            ingredients.push(ingredient);
        }
    }
    // join the ingredients into a string
    return ingredients.join(', ');
}

// ****FOOD API CONTENT STARTS HERE****

// Variables for food API


var ingredientListElement = document.getElementById('foodRecipes');
var foodAPI = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=' + ingredient;
var mealID = ''
var foodButton = document.querySelector('.foodLink')
var foodInput = document.querySelector('.foodInput')

// Arrays list for the below functions
var foodText = [];
var ingredient = [];
var dishArray = [];
var finalDishes = [];
var matchArray = [];

// Fetch request to generate meal IDs based on the user's input ingredients
function fetchFoodAPI() {
// Loop for pulling each ingredient and returning recipes based on that ingredient
for (var i = 0; i < ingredient.length; i++) {

    var foodAPI = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=' + ingredient[i];

    console.log(ingredient[i]);
    console.log(foodAPI);
    fetch(foodAPI).then(function(response) {
        console.log(foodAPI);
        return response.json();
    }).then(function(data) {
        console.log(data);
// loop for pulling meal names out of returned data
        for (var i = 0; i < data.meals.length; i++) {
            dishArray.push(JSON.parse(data.meals[i].idMeal));
        }
    })
}
// Slight delay to allow for all data to enter dishArray before sorting
setTimeout (function() {

    dishArray.sort(function(a, b){return a - b});
    console.log(dishArray);

// Slight delay to allow for array to be reorganized before running loop
    setTimeout (function() {
        // Compares array data to each other for matches and pushes matches to seperate array
        for (var i = 0; i < dishArray.length; i++) {
            if (dishArray[i] === dishArray[i+1]) {
                matchArray.push(dishArray[i]);
            }
        }
    console.log(matchArray);
    fetchCheck();
    }, 500)
  }, 500)
}


// To check if match array has enough recipes
function fetchCheck() {
    if (matchArray.length < 6) {

        var matchesQty = matchArray.length
        console.log(matchArray.length);
        var recipesNeeded = 6 - matchesQty;
 // Adds more recipes to array if there are not enough matches
        for (var i = 0; i < recipesNeeded; i++) {
            matchArray.push(dishArray[i])
            console.log(dishArray[i])
        }

        console.log(matchArray);
        fetchDishAPI();

       } else {
        fetchDishAPI();
       }
}




function fetchDishAPI() {
      // loop for pulling meal IDs out of matchArray to provide full recipes
      for (var i = 0; i < matchArray.length; i++) {
        mealID = matchArray[i]
        var dishInfoAPI = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + mealID;
        console.log(mealID)
        fetch(dishInfoAPI).then(function(response) {
            return response.json();
        }).then(function(data) {
        // logs all final dishes to be put on webpage
           finalDishes.push(data.meals[0]) 
        //    console.log(finalDishes)
           
        })
    }
    console.log(finalDishes);
    setTimeout(function() {

        displayFoodIngredients(finalDishes);
        console.log(finalDishes)
    }, 500) 

}

// Processes data from user input and converts into usable string data
function ingredientList() {
    var food = foodInput.value
    var foodSplit = food.split(', ');
    
for (var i = 0; i < foodSplit.length; i++) {
    ingredient.push(foodSplit[i])
    console.log(ingredient)
}

    setTimeout(function() {
        fetchFoodAPI();
    }, 500)
}



//spinach, chicken, potato, marinara, onion, beef




//function to display food recipe information on the webpage
function displayFoodIngredients() {
    // console.log('API Response:', drinks);
    // Get the HTML element for the list of cocktails
    var ingredientListElement = document.getElementById('foodRecipes');
    // Clear the existing content
    ingredientListElement.innerHTML = '';
    // Check if 'finalDishes' is an array and not empty
    if (Array.isArray(finalDishes) && finalDishes.length > 0) {
        console.log(finalDishes)
        // go through each recipe and create an HTML element
        finalDishes.forEach(function (recipeResult) {
            // Create a container div for each recipe
            var drinkContainer = document.createElement('div');
            drinkContainer.classList.add('drink-container');

            // Create an h3 element for the recipe name
            var nameHeading = document.createElement('h3');
            nameHeading.textContent = 'Name: ' + recipeResult.strMeal;
            drinkContainer.appendChild(nameHeading);

            // Create a p element for the ingredients
            var ingredientsParagraph = document.createElement('p');
            ingredientsParagraph.textContent = 'Ingredients: ' + getFoodIngredients(recipeResult);
            drinkContainer.appendChild(ingredientsParagraph);

            // Create a p element for the instructions
            var instructionsParagraph = document.createElement('p');
            instructionsParagraph.textContent = 'Instructions: ' + recipeResult.strInstructions;
            drinkContainer.appendChild(instructionsParagraph);

            // Append the drink container to the 'ingredientList' element
            ingredientListElement.appendChild(drinkContainer);
        });
    } else {
        // Log the entire API response to the console for issues
        // console.log('API Response:', drinks);
        // Handle the case where 'finalDishes' is not a valid array
        ingredientListElement.textContent = 'No Recipes Found';
    }
}
//function to extract and format ingredients from a drink object
function getFoodIngredients(recipeResult) {
    // Extract and join the ingredients from the final object
    var ingredientsArray = [];
    for (var i = 1; i <= 15; i++) {
        var foodIngredient = recipeResult['strIngredient' + i];
        var measure = recipeResult['strMeasure' + i];
        if (foodIngredient && measure) {
            ingredientsArray.push(measure + ' ' + foodIngredient);
        } else if (foodIngredient) {
            ingredientsArray.push(foodIngredient);
        }
    }
    // join the ingredients into a string
    return ingredientsArray.join(', ');
}




// click event for food button
foodButton.addEventListener('click', function(event) {
event.preventDefault();
ingredientList();

})