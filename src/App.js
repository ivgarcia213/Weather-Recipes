import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const RECIPE_API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";

const App = () => {
  const [city, setCity] = useState("New York City"); // Default city
  const [temperature, setTemperature] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch weather data using WeatherAPI
  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        // Step 1: Fetch weather data from WeatherAPI using city
        const weatherRes = await axios.get(
          `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${city}&aqi=no`
        );

        console.log("Weather API Response:", weatherRes.data); // Debug log for the weather response

        const temp = weatherRes.data.current.temp_f; // Get the temperature in Fahrenheit
        setTemperature(temp);

        // Step 2: Fetch recipes based on the temperature
        fetchRecipes(temp);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Unable to fetch data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  // Fetch recipes based on temperature
  const fetchRecipes = async (temp) => {
    try {
      let recipeType = "";
      if (temp > 60) {
        recipeType = "salad"; // Hot weather, suggest cold foods
      } else {
        recipeType = "soup"; // Cold weather, suggest warm foods
      }

      const response = await axios.get(`${RECIPE_API_URL}${recipeType}`);
      setRecipes(response.data.meals);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Recipe and Weather App</h1>

        <div className="input-container">
          <input
            type="text"
            value={city}
            onChange={handleCityChange}
            placeholder="Enter a city"
          />
          <button onClick={() => setCity(city)}>Get Weather and Recipes</button>
        </div>

        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          <div>
            {error && <p className="error">{error}</p>}
            <h2>Current Weather in {city}</h2>
            {temperature !== null && <p>Temperature: {temperature}°F</p>}

            <h2>Suggested Recipes</h2>
            <div className="recipes-container">
              {recipes.length === 0 ? (
                <p>No recipes found.</p>
              ) : (
                <ul>
                  {recipes.map((recipe) => (
                    <li key={recipe.idMeal} className="recipe-card">
                      <a
                        href={`https://www.themealdb.com/meal/${recipe.idMeal}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {recipe.strMeal}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
