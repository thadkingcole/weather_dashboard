// Global Variables
/* global moment from moment.js*/
const apiKey = "8aeca2ffebc6962c43c0e96825f3d12b", // for openweathermap.org
  units = "imperial"; // parameter to return degress F from API

// Functions
function getWeather(city) {
  const currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`; // current weather api from openweathermap.org

  // openweathermap.org Current Weather API
  $.ajax({
    url: currentURL,
    method: "GET",
  }).then(function (response) {
    console.log("Current Weather API", response);
    const lat = response.coord.lat, // latitude for One Call API
      lon = response.coord.lon, // longitude for One Call API
      parts = "minutely,hourly", // parts to exclude in One Call API
      oneCallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&exclude=${parts}&appid=${apiKey}`,
      cityName = response.name,
      todaysDate = moment.unix(response.dt).format("MM/DD/YYYY"),
      currentIconURL = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`,
      currentIconAlt = response.weather[0].description;

    // display city name, date, & weather icon in main section header
    $("#city-name").text(`${cityName} (${todaysDate})`);
    $("#city-name").append(
      $("<img>").attr("src", currentIconURL).attr("alt", currentIconAlt)
    );

    // openweathermap.org One Call API
    $.ajax({
      url: oneCallURL,
      method: "GET",
    }).then(function (response) {
      console.log("One Call API", response);
      // update rest of page with city weather data
      // ...
    });
  });
}
