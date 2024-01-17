// import { format } from "../date-fns";
let daysContainer = document.getElementById("days");
let locationInput = document.getElementById("locationInput");
let locationCountry = document.getElementById("locationCountry");
let locationDate = document.getElementById("locationDate");
let locationCondition = document.getElementById("locationCondition");
let locationIcon = document.getElementById("currentIcon");
let temp = document.getElementById("temp");
let weatherInfo = document.querySelectorAll("#weatherInfo div span");

const daysOfWeek = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
// load the current loaction and display the weather for current location
window.addEventListener("load", getWeatherofCurrentLocation);
function getWeatherofCurrentLocation() {
  getLatAndLongOfCurrentLocation();
}
// get the weather by country name
function getWeather(location) {
  const data = null;
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      updateDate(JSON.parse(this.responseText));
    }
  });

  xhr.open(
    "GET",
    `https://weatherapi-com.p.rapidapi.com/forecast.json?q=${location}&days=3`
  );
  xhr.setRequestHeader(
    "X-RapidAPI-Key",
    "07df08c310msh0b1c3d7d9fe3bf7p108545jsn04bfba5437da"
  );
  xhr.setRequestHeader("X-RapidAPI-Host", "weatherapi-com.p.rapidapi.com");

  xhr.send(data);
}
// get country name from text input and call getWeather function
function search() {
  getWeather(locationInput.value);
}

locationInput.addEventListener("keydown", search);

function updateDate(locationData) {
  getWeatherOfCurrentDay(locationData.location, locationData.current);
  getWeatherOfThreeDays(locationData.forecast.forecastday);
}
// weather for the current day
function getWeatherOfCurrentDay(location, current) {
  locationCountry.innerHTML = `${location.name}, ${location.country}`;
  locationDate.innerHTML = formatDate(location.localtime);
  locationCondition.innerHTML = current.condition.text;
  locationIcon.setAttribute("src", current.condition.icon);
  temp.innerHTML = current.temp_c + "°";
  weatherInfo[0].innerHTML = current.wind_kph + " Km/h";
  weatherInfo[1].innerHTML = current.feelslike_c + "°";
  weatherInfo[2].innerHTML = current.humidity;
  weatherInfo[3].innerHTML = current.uv;
}
// weather for the next three days
function getWeatherOfThreeDays(days) {
  let cartona = ``;
  for (let i = 0; i < days.length; i++) {
    let dayDate = new Date(days[i].date).getDay();

    cartona += `
    <div class="col-4 col-md-3 text-center day">
    <div class="m-1 px-1 py-5 py-md-3 d-flex flex-column justify-content-center align-items-center">
            <p>${daysOfWeek[dayDate]}</p>
            <img src="${days[i].day.condition.icon}" />
            <p>${Math.floor(days[i].day.maxtemp_c)}° / ${Math.floor(
      days[i].day.mintemp_c
    )}°</p>
            </div>
          </div>
    `;
  }
  daysContainer.innerHTML = cartona;
}
// get lat and long for the current location
function getLatAndLongOfCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getNameOfCurrentLocation);
  }
}
// get the country name of the current location and send the name to getWeather function
function getNameOfCurrentLocation(position) {
  const data = null;

  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      getWeather(JSON.parse(this.responseText).location.name);
    }
  });

  xhr.open(
    "GET",
    `https://weatherapi-com.p.rapidapi.com/current.json?q=${position.coords.latitude}%2C${position.coords.longitude}`
  );
  xhr.setRequestHeader(
    "X-RapidAPI-Key",
    "07df08c310msh0b1c3d7d9fe3bf7p108545jsn04bfba5437da"
  );
  xhr.setRequestHeader("X-RapidAPI-Host", "weatherapi-com.p.rapidapi.com");

  xhr.send(data);
}
// format date
function formatDate(inputDate) {
  // Parse the input date string
  const parsedDate = new Date(inputDate);

  // Days of the week and months arrays for formatting
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get the day, month, and year components
  const dayOfWeek = daysOfWeek[parsedDate.getDay()];
  const dayOfMonth = parsedDate.getDate();
  const month = months[parsedDate.getMonth()];
  const year = parsedDate.getFullYear();

  // Add ordinal suffix to the day
  const daySuffix = getDaySuffix(dayOfMonth);
  const formattedDate = `${dayOfWeek}, ${month} ${dayOfMonth}${daySuffix}, ${year}`;

  return formattedDate;
}
// Function to get the ordinal suffix for the day
function getDaySuffix(day) {
  if (day >= 11 && day <= 13) {
    return "th";
  }
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}
