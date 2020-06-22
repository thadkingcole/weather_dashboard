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
      // update city current weather data
      $("#current-temp").text(response.current.temp.toFixed(1));
      $("#current-humid").text(response.current.humidity);
      $("#wind").text(response.current.wind_speed);
      $("#UV").text(response.current.uvi);
      // update 5-day forecast for city
      $("#forecast").empty(); // removes currently displayed 5-day forcast
      for (let i = 1; i <= 5; i++) {
        // start at 1 because 5 day forecast starts with tomorrow
        // get daily data from response
        const data = response.daily[i],
          date = moment.unix(data.dt).format("MM/DD/YYYY"),
          iconURL = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
          iconAlt = data.weather[0].description,
          temp = `Temp: ${data.temp.day.toFixed(1)} &deg;F`,
          humid = `Humidity: ${data.humidity}%`,
          // display that data on forecast card
          cardEl = $("<div>").addClass("card bg-primary text-light p-2");

        cardEl.append($("<p>").addClass("card-title").text(date));
        cardEl.append($("<img>").attr("src", iconURL).attr("alt", iconAlt).attr("width", 50));
        cardEl.append($("<p>").addClass("card-text small").html(temp));
        cardEl.append($("<p>").addClass("card-text small").text(humid));

        $("#forecast").append(cardEl);
      }
    });
  });
}
