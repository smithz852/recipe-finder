// visibility of the dropdown menu
document.addEventListener('DOMContentLoaded', function () {
    var burger = document.querySelector('.navbar-burger');
    var dropdown = document.querySelector('.navbar-dropdown');

    burger.addEventListener('click', function () {
      // Toggle the display property of the dropdown
      dropdown.style.display = dropdown.style.display === 'none' || dropdown.style.display === '' ? 'block' : 'none';
    });
  });

// reload page function

function reloadPage() {
    location.reload();
  }

// function to display the user's ingredient list whenever they make an input

var ingredientInput = document.getElementById('ingredientInput');
ingredientInput.addEventListener('input', function () {
    var inputValue = ingredientInput.value;
    updateIngredientContainer(inputValue);
});

function updateIngredientContainer(value) {
   var ingredientContainer = document.getElementById('enteredIngredientContainer');
   ingredientContainer.textContent = 'Ingredient List: ' + value;
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
    // Save to local storage
    localStorage.setItem('lastSearchTerm', searchTerm);
    // Clear any existing error messages
    errorMessageElement.textContent = '';
    // Fetch cocktails by search term
    fetchCocktails(searchTerm);
    // Display entered ingredient in a box
    displayEnteredIngredient(searchTerm);
}
// Function to retrieve last search term from local storage
function loadLastSearchTerm() {
    var lastSearchTerm = localStorage.getItem('lastSearchTerm');
    if (lastSearchTerm) {
        document.getElementById('ingredientInput').value = lastSearchTerm;
        // Fetch cocktails by the last search term
        fetchCocktails(lastSearchTerm);
    }
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

    var foodListElement = document.getElementById('foodRecipes')
    // To check if content is already on page, and adds a flex box if so
    if (foodListElement.hasChildNodes()) {
        listContainer.classList.add('flex')
        console.log('Has Children')
    } else {
        console.log('No Children')
        foodListElement.classList.remove('flex')
    }

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
            drinkContainer.classList.add('drink-container', 'flex');

            
             // photo placeholder withing div
             var imgContainer = ''
             imgContainer = `<img class = 'photoContainer' src = '${drink.strDrinkThumb}'></img>`
              drinkContainer.innerHTML = imgContainer
 
              var textDiv = document.createElement('div')
              textDiv.classList.add('textFlex')
              drinkContainer.appendChild(textDiv)

            // Create an h3 element for the drink name
            var nameHeading = document.createElement('h3');
            nameHeading.textContent = 'Name: ' + drink.strDrink;
            textDiv.appendChild(nameHeading);

            // Create a p element for the ingredients
            var ingredientsParagraph = document.createElement('p');
            ingredientsParagraph.textContent = 'Ingredients: ' + getIngredients(drink);
            textDiv.appendChild(ingredientsParagraph);

            // Create a button for the instructions toggle
            var instructionsButton = document.createElement('button');
            instructionsButton.textContent = 'Instructions';
            instructionsButton.classList.add('button', 'is-ghost');
            instructionsButton.style.cssText = 'align-self: baseline'  //adjusts button styling
            textDiv.appendChild(instructionsButton);

            // Create a p element for the instructions
            var instructionsParagraph = document.createElement('p');
            instructionsParagraph.textContent = drink.strInstructions;
            instructionsParagraph.classList.add('hide', 'instructionsFood');
            textDiv.appendChild(instructionsParagraph);
            
            // Toggle function for instructions
            instructionsButton.onclick = function () {
                instructionsParagraph.classList.toggle('hide');
            }

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

// Function to clear the page and local storage
function clearEnteredIngredients() {
    // Clear entered ingredients
    var enteredIngredientBox = document.querySelector('.field');
    enteredIngredientBox.innerHTML = '';
}

// Function to clear the page and local storage
function clearEnteredIngredients() {
    // Get the container of entered ingredients
    var enteredIngredientBox = document.querySelector('.field');
    // Remove spans with entered ingredients
    var enteredIngredientSpans = enteredIngredientBox.querySelectorAll('span');
    enteredIngredientSpans.forEach(function (span) {
        span.remove();
    });
}

// Function to clear the page and local storage
function clearPage() {
    // Clear entered ingredients
    clearEnteredIngredients();
    // Clear the ingredientList content
    document.getElementById('ingredientList').innerHTML = '';
    // Clear local storage
    localStorage.removeItem('lastSearchTerm');
     // Clear food API content
    document.getElementById('foodRecipes').innerHTML = '';
    // Clear ingredient array
    ingredient = [];
}
loadLastSearchTerm();
// ****FOOD API CONTENT STARTS HERE****

// Variables for food API

var listContainer = document.getElementById('container')
var ingredientListElement = document.getElementById('foodRecipes');
var foodAPI = 'https://www.themealdb.com/api/json/v1/1/filter.php?i=' + ingredient;
var mealID = ''
var foodButton = document.querySelector('.foodLink')
var foodInput = document.querySelector('.foodInput')
var infoButton = ''

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

    var drinkListElement = document.getElementById('ingredientList')
    // To check if content is already on page, and adds a flex box if so

    if (drinkListElement.hasChildNodes()) {
        listContainer.classList.add('flex')
        console.log('Has Children')
    } else {
        console.log('No Children')
        listContainer.classList.remove('flex')
    }

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
            drinkContainer.classList.add('drink-container', 'flex');

            // photo placeholder withing div
            var imgContainer = ''
            // imgContainer.classList.add('photoContainer')
            imgContainer = `<img class = 'photoContainer' src = '${recipeResult.strMealThumb}'></img>`
            //  drinkContainer.appendChild(imgContainer)
             drinkContainer.innerHTML = imgContainer

             var textDiv = document.createElement('div')
             textDiv.classList.add('textFlex')
             drinkContainer.appendChild(textDiv)

            // Create an h3 element for the recipe name
            var nameHeading = document.createElement('h3');
            nameHeading.textContent = 'Name: ' + recipeResult.strMeal;
            textDiv.appendChild(nameHeading);

            // Create a p element for the ingredients
            var ingredientsParagraph = document.createElement('p');
            ingredientsParagraph.textContent = 'Ingredients: ' + getFoodIngredients(recipeResult);
            textDiv.appendChild(ingredientsParagraph);

            // Create a p element for the instructions
            // recipeResult.strInstructions.substring(0,150)  for intruction results
            var instructionsButton = document.createElement('button');
            var instructionsParagraph = document.createElement('p')
            instructionsButton.classList.add('button', 'is-ghost',)
            instructionsButton.style.cssText = 'align-self: baseline'  //adjusts button styling
            instructionsParagraph.classList.add('hide', 'instructionsFood')

            // Enables toggle fucntion for recipe instructions
            instructionsButton.onclick = function () {
                instructionsParagraph.classList.toggle('hide')
            }
        
            // var infoButton = document.createElement('button')
            instructionsButton.textContent = 'Instructions';
            instructionsParagraph.textContent = recipeResult.strInstructions
            textDiv.appendChild(instructionsButton);
            textDiv.appendChild(instructionsParagraph);

            // Append the drink container to the 'ingredientList' element
            ingredientListElement.appendChild(drinkContainer);
        });
    } else {
        // Log the entire API response to the console for issues
        // console.log('API Response:', drinks);
        // Handle the case where 'finalDishes' is not a valid array
        ingredientListElement.textContent = 'No Recipes Found';
    }
    setTimeout(function() {

        emptyDishes();
    }, 1000)
   
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

function emptyDishes() {
    foodText = [];
    dishArray = [];
    finalDishes = [];
    matchArray = [];
}


// click event for food button
foodButton.addEventListener('click', function(event) {
event.preventDefault();
// emptyDishes();
ingredientList();

})

