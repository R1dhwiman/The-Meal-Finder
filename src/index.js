// creating popup for fav list

const popup = document.getElementById("popup");
const openPopupBtn = document.getElementById("openPopupBtn");
const closeBtn = document.querySelector(".close-btn");

openPopupBtn.addEventListener("click", () => {
  popup.classList.remove("displayHidden");
});

closeBtn.addEventListener("click", () => {
  popup.classList.add("displayHidden");
});

window.addEventListener("click", (event) => {
  if (event.target === popup) {
    popup.style.display = "none";
  }
});

// https://www.themealdb.com/api/json/v1/1/search.php?s=Burger

const userInput = document.getElementById("meal-search");
const searchList = document.getElementById("search-item-info");
const result = document.getElementById("output-container");

// loading the API
async function loadMeals(searchTerm) {
  const URL = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`;
  const res = await fetch(`${URL}`);
  const data = await res.json();
  if (data.meals) {
    displayMealList(data.meals);
  } else {
    searchList.innerHTML = "No meals found";
  }
}

// finding meals
function findMeals() {
  let searchTerm = userInput.value.trim();
  if (searchTerm.length > 0) {
    searchList.classList.remove("displayHidden");
    loadMeals(searchTerm);
  } else {
    searchList.classList.add("displayHidden");
  }
}

function displayMealList(meals) {
  searchList.innerHTML = "";
  for (let idx = 0; idx < meals.length; idx++) {
    let mealListItem = document.createElement("div");
    mealListItem.dataset.id = meals[idx].idMeal;
    mealListItem.classList.add("search-list-item");
    let mealPoster =
      meals[idx].strMealThumb !== "N/A"
        ? meals[idx].strMealThumb
        : "image/image_not_available.png";
    mealListItem.innerHTML = `
      <div class="thumb">
        <img src="${mealPoster}">
      </div>
      <div class="searchlist-details">
        <h4>${meals[idx].strMeal}</h4>
        <p>Category:- ${meals[idx].strCategory}</p>
        <p>Zone:- ${meals[idx].strArea}</p>
      </div>
    `;
    searchList.appendChild(mealListItem);
  }
  loadMealsDetails();
}

// loading meal details

function loadMealsDetails() {
  const searchListMeals = searchList.querySelectorAll(".search-list-item");
  searchListMeals.forEach((meal) => {
    meal.addEventListener("click", async () => {
      searchList.classList.add("displayHidden");
      userInput.value = "";
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.dataset.id}`
        );
        const data = await response.json();
        const mealDetails = data.meals[0];
        displayMealDetails(mealDetails);
      } catch (error) {
        console.error("Error fetching meal details:", error);
        result.innerHTML = "An error occurred while fetching meal details.";
      }
    });
  });
}

// fav meal array to store fav meals 
const favoritedMealsGrid = document.getElementById("fav-meals-list");

let favMeals = JSON.parse(localStorage.getItem("favMeals")) || [];
displayFavoriteMeals();

// displaying meal
function displayMealDetails(details) {
  let mealPoster =
    details.strMealThumb !== "N/A"
      ? details.strMealThumb
      : "image/image_not_available.png";
  result.innerHTML = `
  <div class="meal-poster"><img
    src="${mealPoster}">
  </div>
  <div class="meal-details">
    <div class="header-details">
      <h2>Title:- ${details.strMeal}</h2>
      <button type="button" class="fav"><i class="fa-solid fa-heart" id="fav"></i></button>
    </div>
    <div class="zone">
      <span><b>Area</b> ${details.strArea}</span>
      <span><b>Category</b> ${details.strCategory} </span>
    </div>
    <p class="instruction"><b>Instruction:-</b><br>
    <br> ${details.strInstructions}</p>
    <a href="${details.strYoutube}" target="_blank" class="youtube">Watch it on YouTube?</a>
  </div>
  `;
  const favBtn = document.getElementById("fav");
  favBtn.addEventListener("click", () => {
    favBtn.classList.add("active");
    const mealId = details.idMeal;
    if (favBtn.classList.contains("active")) {
      if (!favMeals.includes(mealId)) {
        favMeals.push(mealId);
      } else {
        alert("Meal already in list!");
        return;
      }
    } else {
      const index = favMeals.indexOf(mealId);
      if (index !== -1) {
        favMeals.splice(index, 1);
      }
    }
    localStorage.setItem("favMeals", JSON.stringify(favMeals));
    displayFavoriteMeals();
  });
}

// displaying fav meals from stored favMeals array

function displayFavoriteMeals() {
  favoritedMealsGrid.innerHTML = "";
  favMeals.forEach(async (mealId) => {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
      );
      const data = await response.json();
      const meal = data.meals[0];

      const mealCard = document.createElement("div");
      mealCard.classList.add("card");
      mealCard.innerHTML = `
          
          <img class="poster" src="${
            meal.strMealThumb || "image/Image_not_available.png"
          }" alt="Meal Poster">
          <h3 class="title">${meal.strMeal}</h3>
          <div class="card-footer">
            <p>${meal.strCategory}</p>
            <button type="button" id="fav" class="fav"><i class="fa-solid fa-heart active"></i></button> 
          </div>
        
      `;

      const favButton = mealCard.querySelector("#fav");
      favButton.addEventListener("click", () => {
        favButton.classList.remove("active");
        const index = favMeals.indexOf(meal.idMeal);
        if (index !== -1) {
          favMeals.splice(index, 1);
        }
        localStorage.setItem("favMeals", JSON.stringify(favMeals));
        displayFavoriteMeals();
      });

      favoritedMealsGrid.appendChild(mealCard);
    } catch (error) {
      console.error("Error fetching favorite meal details:", error);
    }
  });
}

// hide the search list when anything else being clicked other then search bar
window.addEventListener("click", (event) => {
  if (event.target.className != "uInput") {
    searchList.classList.add("displayHidden");
  }
});
