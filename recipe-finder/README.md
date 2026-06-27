# Recipe Finder Application

Search recipes, view ingredients & cooking instructions, and save favorites — all powered by TheMealDB API.

## Features

- Search recipes by name
- Recipe cards with image, title, category, and origin
- Detail page with ingredients and step-by-step instructions
- Favorites saved to local storage
- Loading spinner and error handling
- Load more / pagination
- Fully responsive

## How to Run

```bash
cd recipe-finder
python3 -m http.server 8080
# Open http://localhost:8080
```

## API

Uses [TheMealDB](https://www.themealdb.com/api.php) free public API (no key required).
