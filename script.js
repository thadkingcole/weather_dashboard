// Global Variables
/* global moment from moment.js*/
const apiKey = "8aeca2ffebc6962c43c0e96825f3d12b", // for openweathermap.org
  units = "imperial", // parameter to return degress F from API
  // from local storage...
  currentCity = localStorage.getItem("current"); // city to display on load
let cities = JSON.parse(localStorage.getItem("history"));
if (!cities) {
  cities = { history: [] };
}

// Functions
function updateHistory() {
  // updates the cities listed in sidebar
  // first clear history before update to prevent duplicates
  $("#history").empty();
  cities.history.forEach((city) => {
    // then create a new div with the city name name
    const cityEl = $("<div>")
      .addClass("p-2 bg-white border city-history")
      .text(city);
    // and add it to the history ID
    $("#history").append(cityEl);
  });
}

function getWeather(city) {
  const currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`; // current weather api from openweathermap.org

  // openweathermap.org Current Weather API
  $.ajax({
    url: currentURL,
    method: "GET",
  }).then(function (response) {
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

    // add city to local storage & search history
    localStorage.setItem("current", cityName);
    if (!cities.history.includes(cityName)) {
      // if cityName not in cities.history..
      cities.history.unshift(cityName);
    }
    updateHistory(); // update list of cities on sidebar
    localStorage.setItem("history", JSON.stringify(cities));

    // openweathermap.org One Call API
    $.ajax({
      url: oneCallURL,
      method: "GET",
    }).then(function (response) {
      // update city current weather data
      $("#current-temp").text(response.current.temp.toFixed(1));
      $("#current-humid").text(response.current.humidity);
      $("#wind").text(response.current.wind_speed);
      $("#UV").text(response.current.uvi);
      // color-code UV index
      if (response.current.uvi <= 5) {
        // UV is low
        $("#UV").removeClass("bg-danger bg-warning").addClass("bg-success");
      } else if (response.current.uvi >= 8) {
        // UV is high
        $("#UV").removeClass("bg-success bg-warning").addClass("bg-danger");
      } else {
        // UV is middle
        $("#UV").removeClass("bg-danger bg-success").addClass("bg-warning");
      }

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

        // add data to the forecast card
        cardEl.append($("<p>").addClass("card-title").text(date));
        cardEl.append(
          $("<img>").attr("src", iconURL).attr("alt", iconAlt).attr("width", 50)
        );
        cardEl.append($("<p>").addClass("card-text small").html(temp));
        cardEl.append($("<p>").addClass("card-text small").text(humid));

        // add forecast card to 5-day forecast div
        $("#forecast").append(cardEl);
      }
    });
  });
}

// Main
// load last viewed city from local storage
if (currentCity) {
  getWeather(currentCity);
} else {
  getWeather("Raleigh");
}

// search button event listener
$("#search").click(function (event) {
  event.preventDefault();
  getWeather($("#city").val());
});

// search history event listener
$("#history").on("click", ".city-history", function () {
  getWeather($(this).text());
});
