const cityName = "New York",
  apiKey = "8aeca2ffebc6962c43c0e96825f3d12b",
  queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

$.ajax({
  url: queryURL,
  method: "GET"
}).then(function(response) {
  console.log(response);
})