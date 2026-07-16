const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const recipes = document.getElementById("recipes");

// Load default recipes when the page opens
window.onload = () => {
    fetchRecipes("chicken");
};

// Search button click
searchBtn.addEventListener("click", () => {

    const food = searchInput.value.trim();

    if (food === "") {
        alert("Please enter a food name");
        return;
    }

    fetchRecipes(food);
});

// Fetch recipes from API
async function fetchRecipes(food) {

    recipes.innerHTML = "<h2 class='message'>Loading recipes...</h2>";

    try {

        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${food}`
        );

        const data = await response.json();

        displayRecipes(data.meals);

    } catch (error) {

        recipes.innerHTML =
            "<h2 class='message'>Something went wrong!</h2>";

        console.log(error);
    }

}

// Display recipes
function displayRecipes(meals) {

    recipes.innerHTML = "";

    if (!meals) {

        recipes.innerHTML =
            "<h2 class='message'>No recipes found.</h2>";

        return;
    }

    meals.forEach(meal => {

        recipes.innerHTML += `

        <div class="card">

            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">

            <div class="card-content">

                <h2>${meal.strMeal}</h2>

                <p><strong>Category:</strong> ${meal.strCategory}</p>

                <p><strong>Cuisine:</strong> ${meal.strArea}</p>

                <a href="${meal.strYoutube}" target="_blank">
                    ▶ Watch Recipe
                </a>

            </div>

        </div>

        `;

    });

}
