const express = require("express");
const axios = require("axios");
const app = express();

app.set("view engine", "pug");
app.use(express.static("public"));

const apiKey = "b567885e8896fdbcf7f5eae2db8ec293";

app.get("/", (req, res) => {
  res.render("index", { weather: null, forecast: null, error: null, unit: 'metric' });
});

app.get("/weather", async (req, res) => {
  const city = req.query.city;
  const unit = req.query.unit || 'metric';

  if (!city) {
    return res.render("index", { weather: null, forecast: null, error: "City name is required", unit });
  }

  try {
    const [currentResponse, forecastResponse] = await Promise.all([
      axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`),
      axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`)

    ]);

    const weather = currentResponse.data;
    const forecast = forecastResponse.data;

    res.render("index", { weather, forecast, error: null, unit });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.render("index", { weather: null, forecast: null, error: "City not found", unit });
    } else {
      res.render("index", { weather: null, forecast: null, error: "Something went wrong, please try again", unit });
    }
  }
});

app.get("/forecast", async (req, res) => {
  const city = req.query.city;
  const unit = req.query.unit || 'metric';
  const apiKey = "b567885e8896fdbcf7f5eae2db8ec293";

  try {
    if (!city) {
      return res.render("forecast", { forecast: null });
    }

    const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${unit}`);

    const forecast = forecastResponse.data;

    res.render("forecast", { forecast, unit });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.render("forecast", { forecast: null, error: "City not found" });
    } else {
      res.render("forecast", { forecast: null, error: "Something went wrong, please try again" });
    }
  }
});


app.get("/weathermap", (req, res) => {
  res.render("weathermap");
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
