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
      .attr("data-city", city)
      .addClass("text-muted p-2 bg-white border city-history")
      .text(city);
    // add delete button
    cityEl.append(
      $("<span>")
        .addClass(
          "text-danger px-1 float-right border border-danger rounded city-delete"
        )
        .html("&times;")
    );
    // and add it to the history ID
    $("#history").append(cityEl);
  });
  // save cities to localstorage
  localStorage.setItem("history", JSON.stringify(cities));
}

function deleteCity(city) {
  const delIndex = cities.history.indexOf(city);
  cities.history.splice(delIndex, 1);
  updateHistory();
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
      todaysDate = moment.unix(response.dt).format("MM/DD/YYYY"),
      currentIconURL = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`,
      currentIconAlt = response.weather[0].description;
    let cityName = response.name;

    if (city.includes(",")) {
      const stateCountry = city.split(",");
      for (let i = 1; i < stateCountry.length; i++) {
        cityName += `, ${stateCountry[i].trim().toUpperCase()}`;
      }
    }
    // display city name, date, & weather icon in main section header
    $("#city-name").text(`${cityName} (${todaysDate})`);
    $("#city-name").append(
      $("<img>")
        .attr("src", currentIconURL)
        .attr("alt", currentIconAlt)
        .attr("width", 75)
    );

    // add city to local storage & search history
    localStorage.setItem("current", cityName);
    if (!cities.history.includes(cityName)) {
      // if cityName not in cities.history..
      cities.history.unshift(cityName);
    }
    updateHistory(); // update list of cities on sidebar

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
          date = moment.unix(data.dt).format("MM/DD/YY"),
          iconURL = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
          iconAlt = data.weather[0].description,
          temp = `Temp: ${data.temp.day.toFixed(1)} &deg;F`,
          humid = `Humidity: ${data.humidity}%`,
          // display that data on forecast card
          cardEl = $("<div>").addClass(
            "card bg-primary text-light p-2 m-2 mx-md-auto"
          );

        // add data to the forecast card
        cardEl.append($("<p>").addClass("card-text text-center").text(date));
        cardEl.append(
          $("<img>")
            .attr("src", iconURL)
            .attr("alt", iconAlt)
            .attr("width", 50)
            .addClass("mx-auto d-block")
        );
        cardEl.append(
          $("<p>").addClass("card-text text-center small").html(temp)
        );
        cardEl.append(
          $("<p>").addClass("card-text text-center small").text(humid)
        );

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
  getWeather("Raleigh, NC, US");
}
// show helpful toast
$(document).ready(function () {
  $(".toast").toast("show");
});

// add event listeners
// search button event listener
$("#search").click(function (event) {
  event.preventDefault();
  // get user input
  const cityForm = $("#city").val(),
    stateForm = $("#state").val(),
    countryForm = $("#country").val();
  let search4city = cityForm;

  if (stateForm) {
    search4city = `${cityForm}, ${stateForm}, US`;
  } else if (countryForm) {
    search4city = `${cityForm}, ${countryForm}`;
  }

  getWeather(search4city);
  // clear search fields
  $("#city").val("");
  $("#state").val("");
  $("#country").val("");
});

// search history event listener
$("#history").on("click", ".city-history", function () {
  getWeather($(this).attr("data-city"));
});

// search history delete event listener
$("#history").on("click", ".city-delete", function (event) {
  event.stopPropagation();
  deleteCity($(this).parent().attr("data-city"));
});
