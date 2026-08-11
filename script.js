const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const recipes = document.getElementById("recipes");

const randomBtn = document.getElementById("randomBtn");
const favoritesBtn = document.getElementById("favoritesBtn");
const themeBtn = document.getElementById("themeBtn");
const aboutBtn = document.getElementById("aboutBtn");
const homeBtn = document.getElementById("homeBtn");


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


// Search when pressing Enter

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


function displayCategoryRecipes(meals) {

    recipes.innerHTML = "";

    if (!meals) {

        recipes.innerHTML =
            "<h2 class='message'>No recipes found.</h2>";

        return;
    }

    meals.forEach(meal => {

        recipes.innerHTML += `

            <div class="card">

                <img
                    src="${meal.strMealThumb}"
                    alt="${meal.strMeal}"
                >

                <div class="card-content">

                    <h2>${meal.strMeal}</h2>

                    <a
                        href="#"
                        onclick="getRecipeDetails('${meal.idMeal}'); return false;"
                    >
                        View Recipe
                    </a>

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


// ================= HOME =================

homeBtn.addEventListener("click", (event) => {

    event.preventDefault();

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


// ================= FAVORITES =================

favoritesBtn.addEventListener("click", (event) => {

    event.preventDefault();

    alert("Favorites feature will be added in the next upgrade ❤️");

});
