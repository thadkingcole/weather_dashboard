const cityName = "New York", // from user seach/city click
  apiKey = "8aeca2ffebc6962c43c0e96825f3d12b", // for openweathermap.org
  currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`; // current weather api from openweathermap.org
// let lat = 0, // latitude to be set later
//   lon = 0; // longitiude to be set later

$.ajax({
  url: currentURL, // current weather api
  method: "GET",
}).then(function (response) {
  console.log("Current Weather API", response);
  // build One Call API queryURL
  const lat = response.coord.lat,
    lon = response.coord.lon,
    part = "minutely,hourly",
    oneCallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${part}&appid=${apiKey}`;

  $.ajax({
    url: oneCallURL,
    method: "GET",
  }).then(function (response) {
    console.log("One Call API", response);
  });
});
