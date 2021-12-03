const search = document.getElementById("search");
const submit = document.getElementById("submit");
const random = document.getElementById("random");
const mealEl = document.getElementById("meals");
const resultHeading = document.getElementById("result-heading");
const single_mealEl = document.getElementById("single-meal");

//Search Meals Function
function searchMeal(e){
    e.preventDefault(); // After clicking the submit button, the search text box will become blank.To avoid the searched value 
    //to disappear after clicking the search button, we use this function 

    // If we first clicked on the random button, after that clicked on the search button, the value in the single meal element will be cleared
    single_mealEl.innerHTML="";

    //get Searched Meal value
    const term = search.value;

    //Checking if the searched value is not empty
    if(term.trim()){
        // resultHeading.innerHTML = `<h2>Search Results for : '${term}':</h2>`;
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
        .then((res) => res.json())
        .then((data) => {
            // console.log(`<h2>Search Results for: ${term}</h2>`);
            resultHeading.innerHTML = `<h2>Search Results for : '${term}'</h2>`;

            //If result is not found then
            if(data.meals == null){
                resultHeading.innerHTML = `<h2>There are no Results for : '${term}'</h2>`;
                single_mealEl.innerHTML=""; //If the random button is pressed, the meal element should have a blank value, 
                //only the random Meal value should be present
                mealEl.innerHTML="";
            } else {
                console.log( resultHeading.innerHTML);
                mealEl.innerHTML = data.meals.map(
                    (meal) =>  `<a href="#mealTitle">
                                    <div class="meal">   
                                        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                                        <div class="meal-info" data-mealID="${meal.idMeal}">
                                            <h3>${meal.strMeal}</h3>
                                        </div>
                                    </div>
                                </a>
                                `
                )
                .join("");
            }
        });
    }else{//Checking if the searched value is empty
        alert('Please insert any value to be searched');
    }
}
//fetch meal by ID
function getMealById(mealID){  //on clicking a meal, we have to get further details
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
        const meal = data.meals[0];   // all the data is stored inside the meal variable
        addMealToDOM(meal);  //Now we will show the data
    });
}
//Random Meal
function randomMeal(){
    mealEl.innerHTML = "";//If the random button is pressed, the meal element should have a blank value, 
    //only the random Meal value should be present
    resultHeading.innerHTML = "";//If the random button is pressed, the meal element heading should have a blank value, 
    //only the random Meal value should be present
    search.value = ""; // remove the earlier search value present in the placeholder and make it to default placeholder(Search for Meal)
    console.log(search.innerHTML);
    fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
    .then(res => res.json()).then(data => {
        const meal = data.meals[0];
        addMealToDOM(meal);
    });
}

//add meal to the DOM
function addMealToDOM(meal){
    const ingredients = []; //as there are many ingredients for a particular dish
    for(let i = 1; i <= 20; i++){
        if(meal[`strIngredient${i}`]){
            ingredients.push(`
                ${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]
            }
            `);
        }else{
            break;
        }
    }
    single_mealEl.innerHTML = `
                                <div class="single-meal">
                                    <h1 id="mealTitle">${meal.strMeal}</h1>
                                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                                    <div class="single-meal-info">
                                        ${meal.strCategory ? `<p>${meal.strCategory}</p>`: ""}
                                        ${meal.strArea ? `<p>${meal.strArea}</p>`: ""}
                                    </div>  
                                    <div class="main">
                                        <p>${meal.strInstructions}</p>
                                        <h2>Ingredients</h2>
                                        <ul>
                                            ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
                                        </ul>
                                    </div>  
                                </div>
                                `;
}

//event Listeners
submit.addEventListener("submit",searchMeal);
random.addEventListener("click",randomMeal);
mealEl.addEventListener("click", e => {
    const mealInfo = e.path.find(item => {
        console.log(item);
        if(item.classList){
            return item.classList.contains("meal-info");
        }else{
            return false;
        }
    });
    if(mealInfo){
        const mealID = mealInfo.getAttribute("data-mealid");
        getMealById(mealID);
    }
});