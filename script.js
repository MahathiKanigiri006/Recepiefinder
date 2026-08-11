const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const recipes = document.getElementById("recipes");

const randomBtn = document.getElementById("randomBtn");
const favoritesBtn = document.getElementById("favoritesBtn");
const themeBtn = document.getElementById("themeBtn");
const aboutBtn = document.getElementById("aboutBtn");
const homeBtn = document.getElementById("homeBtn");


// ================= FAVORITES =================

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];


// ================= LOAD DEFAULT RECIPES =================

window.addEventListener("load", () => {
    fetchRecipes("chicken");
});


// ================= SEARCH =================

searchBtn.addEventListener("click", () => {

    const food = searchInput.value.trim();

    if (food === "") {
        alert("Please enter a food name");
        return;
    }

    fetchRecipes(food);
});


// Search using Enter key

searchInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {
        searchBtn.click();
    }

});


// ================= FETCH RECIPES =================

async function fetchRecipes(food) {

    recipes.innerHTML =
        "<h2 class='message'>Loading recipes...</h2>";

    try {

        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(food)}`
        );

        if (!response.ok) {
            throw new Error("Network response failed");
        }

        const data = await response.json();

        displayRecipes(data.meals);

    } catch (error) {

        recipes.innerHTML =
            "<h2 class='message'>Something went wrong. Please try again.</h2>";

        console.error(error);
    }
}


// ================= DISPLAY RECIPES =================

function displayRecipes(meals) {

    recipes.innerHTML = "";

    if (!meals) {

        recipes.innerHTML =
            "<h2 class='message'>No recipes found. Try another search.</h2>";

        return;
    }

    meals.forEach(meal => {

        const isFavorite = favorites.some(
            favorite => favorite.idMeal === meal.idMeal
        );

        recipes.innerHTML += `

            <div class="card">

                <img
                    src="${meal.strMealThumb}"
                    alt="${meal.strMeal}"
                >

                <div class="card-content">

                    <h2>${meal.strMeal}</h2>

                    <p>
                        <strong>Category:</strong>
                        ${meal.strCategory || "Not available"}
                    </p>

                    <p>
                        <strong>Cuisine:</strong>
                        ${meal.strArea || "Not available"}
                    </p>

                    <button
                        class="favorite-btn ${isFavorite ? "favorited" : ""}"
                        onclick="toggleFavorite('${meal.idMeal}')"
                    >
                        ${isFavorite ? "❤️ Favorited" : "🤍 Add to Favorites"}
                    </button>

                    ${
                        meal.strYoutube
                        ? `
                        <a
                            href="${meal.strYoutube}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            ▶ Watch Recipe
                        </a>
                        `
                        : ""
                    }

                </div>

            </div>

        `;
    });
}


// ================= CATEGORY BUTTONS =================

const categoryButtons =
    document.querySelectorAll(".category-buttons button");

categoryButtons.forEach(button => {

    button.addEventListener("click", () => {

        const category = button.dataset.category;

        fetchCategory(category);

    });

});


async function fetchCategory(category) {

    recipes.innerHTML =
        "<h2 class='message'>Loading recipes...</h2>";

    try {

        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
        );

        const data = await response.json();

        displayCategoryRecipes(data.meals);

    } catch (error) {

        recipes.innerHTML =
            "<h2 class='message'>Unable to load category.</h2>";

        console.error(error);
    }
}


// ================= DISPLAY CATEGORY RECIPES =================

function displayCategoryRecipes(meals) {

    recipes.innerHTML = "";

    if (!meals) {

        recipes.innerHTML =
            "<h2 class='message'>No recipes found.</h2>";

        return;
    }

    meals.forEach(meal => {

        const isFavorite = favorites.some(
            favorite => favorite.idMeal === meal.idMeal
        );

        recipes.innerHTML += `

            <div class="card">

                <img
                    src="${meal.strMealThumb}"
                    alt="${meal.strMeal}"
                >

                <div class="card-content">

                    <h2>${meal.strMeal}</h2>

                    <button
                        class="favorite-btn ${isFavorite ? "favorited" : ""}"
                        onclick="toggleFavorite('${meal.idMeal}')"
                    >
                        ${isFavorite ? "❤️ Favorited" : "🤍 Add to Favorites"}
                    </button>

                </div>

            </div>

        `;
    });
}


// ================= RANDOM RECIPE =================

randomBtn.addEventListener("click", async (event) => {

    event.preventDefault();

    recipes.innerHTML =
        "<h2 class='message'>Finding a random recipe...</h2>";

    try {

        const response = await fetch(
            "https://www.themealdb.com/api/json/v1/1/random.php"
        );

        const data = await response.json();

        displayRecipes(data.meals);

        window.scrollTo({
            top: recipes.offsetTop - 100,
            behavior: "smooth"
        });

    } catch (error) {

        recipes.innerHTML =
            "<h2 class='message'>Unable to load random recipe.</h2>";

        console.error(error);
    }
});


// ================= TOGGLE FAVORITE =================

async function toggleFavorite(mealId) {

    try {

        const response = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
        );

        const data = await response.json();

        const meal = data.meals[0];

        const existingIndex = favorites.findIndex(
            favorite => favorite.idMeal === meal.idMeal
        );

        if (existingIndex !== -1) {

            favorites.splice(existingIndex, 1);

            alert(`${meal.strMeal} removed from favorites 💔`);

        } else {

            favorites.push(meal);

            alert(`${meal.strMeal} added to favorites ❤️`);

        }

        localStorage.setItem(
            "favorites",
            JSON.stringify(favorites)
        );

        displayRecipes([meal]);

    } catch (error) {

        console.error(error);

        alert("Unable to update favorites.");
    }
}


// ================= SHOW FAVORITES =================

favoritesBtn.addEventListener("click", (event) => {

    event.preventDefault();

    displayFavorites();

    window.scrollTo({
        top: recipes.offsetTop - 100,
        behavior: "smooth"
    });
});


function displayFavorites() {

    recipes.innerHTML = "";

    if (favorites.length === 0) {

        recipes.innerHTML = `
            <div class="message">

                <h2>❤️ No Favorite Recipes Yet</h2>

                <p>
                    Add recipes to your favorites and they will appear here.
                </p>

            </div>
        `;

        return;
    }

    favorites.forEach(meal => {

        recipes.innerHTML += `

            <div class="card">

                <img
                    src="${meal.strMealThumb}"
                    alt="${meal.strMeal}"
                >

                <div class="card-content">

                    <h2>${meal.strMeal}</h2>

                    <p>
                        <strong>Category:</strong>
                        ${meal.strCategory || "Not available"}
                    </p>

                    <p>
                        <strong>Cuisine:</strong>
                        ${meal.strArea || "Not available"}
                    </p>

                    <button
                        class="favorite-btn favorited"
                        onclick="toggleFavorite('${meal.idMeal}')"
                    >
                        💔 Remove Favorite
                    </button>

                    ${
                        meal.strYoutube
                        ? `
                        <a
                            href="${meal.strYoutube}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            ▶ Watch Recipe
                        </a>
                        `
                        : ""
                    }

                </div>

            </div>

        `;
    });
}


// ================= HOME =================

homeBtn.addEventListener("click", (event) => {

    event.preventDefault();

    fetchRecipes("chicken");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


// ================= ABOUT =================

aboutBtn.addEventListener("click", (event) => {

    event.preventDefault();

    document.getElementById("aboutSection").scrollIntoView({
        behavior: "smooth"
    });
});


// ================= DARK MODE =================

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {

        themeBtn.textContent = "☀️";

    } else {

        themeBtn.textContent = "🌙";
    }
});
