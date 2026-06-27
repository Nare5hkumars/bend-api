const API_BASE = "https://www.themealdb.com/api/json/v1/1";
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const recipeGrid = document.getElementById("recipeGrid");
const loader = document.getElementById("loader");
const statusMsg = document.getElementById("statusMsg");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const detailView = document.getElementById("detailView");
const detailContent = document.getElementById("detailContent");
const backBtn = document.getElementById("backBtn");
const content = document.getElementById("content");
const favModal = document.getElementById("favModal");
const favList = document.getElementById("favList");
const closeModal = document.getElementById("closeModal");
const favToggle = document.getElementById("favToggle");

let allRecipes = [];
let displayedCount = 0;
const PAGE_SIZE = 8;
let currentQuery = "";

function getFavorites() {
  return JSON.parse(localStorage.getItem("recipeFavs") || "[]");
}

function saveFavorites(favs) {
  localStorage.setItem("recipeFavs", JSON.stringify(favs));
}

function toggleFavorite(id, title, thumb) {
  let favs = getFavorites();
  const idx = favs.findIndex(f => f.id === id);
  if (idx > -1) {
    favs.splice(idx, 1);
  } else {
    favs.push({ id, title, thumb });
  }
  saveFavorites(favs);
  updateFavButtons(id);
}

function isFavorite(id) {
  return getFavorites().some(f => f.id === id);
}

function updateFavButtons(id) {
  document.querySelectorAll(`.fav-btn[data-id="${id}"]`).forEach(btn => {
    btn.classList.toggle("active", isFavorite(id));
    btn.textContent = isFavorite(id) ? "♥" : "♡";
  });
}

function showLoader() { loader.classList.remove("hidden"); }
function hideLoader() { loader.classList.add("hidden"); }

function showStatus(msg) { statusMsg.textContent = msg; }
function hideStatus() { statusMsg.textContent = ""; }

async function fetchRecipes(query) {
  showLoader();
  hideStatus();
  try {
    const res = await fetch(`${API_BASE}/search.php?s=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error("Network error");
    const data = await res.json();
    return data.meals || [];
  } catch (err) {
    showStatus("Failed to fetch recipes. Check your connection.");
    return [];
  } finally {
    hideLoader();
  }
}

async function fetchRecipeById(id) {
  showLoader();
  try {
    const res = await fetch(`${API_BASE}/lookup.php?i=${id}`);
    const data = await res.json();
    return data.meals ? data.meals[0] : null;
  } catch {
    return null;
  } finally {
    hideLoader();
  }
}

function createRecipeCard(meal) {
  const card = document.createElement("div");
  card.className = "recipe-card";

  const img = document.createElement("img");
  img.src = meal.strMealThumb + "/preview";
  img.alt = meal.strMeal;
  img.loading = "lazy";

  const body = document.createElement("div");
  body.className = "card-body";

  const title = document.createElement("h3");
  title.textContent = meal.strMeal;

  const cat = document.createElement("p");
  cat.className = "category";
  cat.textContent = [meal.strCategory, meal.strArea].filter(Boolean).join(" · ");

  const favBtn = document.createElement("button");
  favBtn.className = "fav-btn" + (isFavorite(meal.idMeal) ? " active" : "");
  favBtn.dataset.id = meal.idMeal;
  favBtn.textContent = isFavorite(meal.idMeal) ? "♥" : "♡";
  favBtn.addEventListener("click", e => {
    e.stopPropagation();
    toggleFavorite(meal.idMeal, meal.strMeal, meal.strMealThumb + "/preview");
  });

  body.append(title, cat);
  card.append(img, body, favBtn);

  card.addEventListener("click", () => showDetail(meal.idMeal));
  return card;
}

function renderCards(meals, append = false) {
  if (!append) {
    recipeGrid.innerHTML = "";
    displayedCount = 0;
  }

  const toShow = meals.slice(displayedCount, displayedCount + PAGE_SIZE);
  toShow.forEach(meal => recipeGrid.appendChild(createRecipeCard(meal)));
  displayedCount += toShow.length;

  if (displayedCount >= meals.length) {
    loadMoreBtn.classList.add("hidden");
  } else {
    loadMoreBtn.classList.remove("hidden");
  }
}

async function handleSearch(query) {
  query = query.trim();
  if (!query) {
    showStatus("Please enter a search term.");
    return;
  }

  currentQuery = query;
  allRecipes = await fetchRecipes(query);
  if (allRecipes.length === 0) {
    showStatus("No recipes found. Try a different search.");
    recipeGrid.innerHTML = "";
    loadMoreBtn.classList.add("hidden");
    return;
  }
  hideStatus();
  renderCards(allRecipes);
}

async function showDetail(id) {
  const meal = await fetchRecipeById(id);
  if (!meal) {
    showStatus("Could not load recipe details.");
    return;
  }

  content.classList.add("hidden");
  detailView.classList.remove("hidden");

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ing && ing.trim()) ingredients.push(`${measure ? measure + " " : ""}${ing}`);
  }

  detailContent.innerHTML = `
    <div class="detail-header">
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <div class="detail-info">
        <h2>${meal.strMeal}</h2>
        <p><strong>Category:</strong> ${meal.strCategory || "N/A"}</p>
        <p><strong>Area:</strong> ${meal.strArea || "N/A"}</p>
        <button class="fav-btn ${isFavorite(meal.idMeal) ? "active" : ""}" data-id="${meal.idMeal}"
          onclick="event.stopPropagation();toggleFavorite('${meal.idMeal}','${meal.strMeal.replace(/'/g, "\\'")}','${meal.strMealThumb}/preview')">
          ${isFavorite(meal.idMeal) ? "♥" : "♡"} ${isFavorite(meal.idMeal) ? "Saved" : "Save"}
        </button>
      </div>
    </div>
    <div class="detail-section">
      <h3>Ingredients</h3>
      <ul>${ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
    </div>
    <div class="detail-section">
      <h3>Instructions</h3>
      <p class="instructions">${meal.strInstructions}</p>
    </div>
  `;
}

backBtn.addEventListener("click", () => {
  detailView.classList.add("hidden");
  content.classList.remove("hidden");
});

searchBtn.addEventListener("click", () => handleSearch(searchInput.value));
searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") handleSearch(searchInput.value);
});

loadMoreBtn.addEventListener("click", () => renderCards(allRecipes, true));

closeModal.addEventListener("click", () => favModal.classList.add("hidden"));
favModal.addEventListener("click", e => {
  if (e.target === favModal) favModal.classList.add("hidden");
});

favToggle.addEventListener("click", () => {
  const favs = getFavorites();
  favList.innerHTML = "";
  if (favs.length === 0) {
    favList.innerHTML = "<p style='color:#888'>No favorites yet.</p>";
  } else {
    favs.forEach(f => {
      const item = document.createElement("div");
      item.className = "fav-item";
      item.innerHTML = `
        <img src="${f.thumb}" alt="${f.title}">
        <span>${f.title}</span>
        <button class="remove-fav" data-id="${f.id}">✕</button>
      `;
      item.querySelector(".remove-fav").addEventListener("click", e => {
        e.stopPropagation();
        toggleFavorite(f.id, f.title, f.thumb);
        favModal.classList.add("hidden");
      });
      item.addEventListener("click", () => {
        favModal.classList.add("hidden");
        showDetail(f.id);
      });
      favList.appendChild(item);
    });
  }
  favModal.classList.remove("hidden");
});
