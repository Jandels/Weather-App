///To Dos

//1 Create Farhenheight to Celcus interative conversion - consider doing additional research on how to turn the value into a number, maybe research how this was done
//2 Import and API for a time response and 5 day forecast
//3 Ensure the forecast loads along with emojis for the next 5 days
//4 Sort out the "Server would like to know your location": Maybe add in a user experience button? Or learn to automatically load something
//5 Issue with the automated detecting of location - cannot use 5 day weather forecast with the co-ordinates.
//6 Do final changes on CSS code to make the design look nice

//////////////////////Change Temperature Metric /////////////////////////
function metricTempChange() {
  let reading = document.querySelector(".tempMetricChange");
  if (reading.innerHTML === "<sup><strong>°F</strong> | °C</sup>") {
    let celciusToFarenh = document.querySelector(".tempMetricChange");
    celciusToFarenh.innerHTML = "<sup><strong>°C</strong> | °F</sup>";
    let changeToCelcius = document.querySelector("#currentTemp");
    changeToCelcius.innerHTML = "C Temp";
  } else {
    let celciusToFarenh = document.querySelector(".tempMetricChange");
    celciusToFarenh.innerHTML = "<sup><strong>°F</strong> | °C</sup>";
    let changeToFarenh = document.querySelector("#currentTemp");
    changeToFarenh.innerHTML = "F Temp";
  }
}

let tempChange = document.querySelector("#tempMetricChange");
tempChange.addEventListener("click", metricTempChange);

//////////////Autoload Location and Display City in Search/////////////////////////////

//Option 1 Open Automated on page loading
function retrieveWeatherViaCoords(position) {
  let latitude = position.coords.latitude;
  let longditude = position.coords.longitude;
  let apiKey = "692e81252347f5426b1d20da827a7848";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longditude}&units=metric&appid=${apiKey}`;

  axios.get(apiUrl).then(displayWeatherTimeConditions);
}

//Option 2, User Interaction and search via forms
function citySearchFunc(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  let units = "metric";
  let apiKey = "692e81252347f5426b1d20da827a7848";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayWeatherTimeConditions);
}

function displayWeatherTimeConditions(response) {
  //Applying API Data to refresh parts of page
  document.querySelector("#main-heading").innerHTML = response.data.name;
  document.querySelector("#currentTemp").innerHTML = `${Math.round(
    response.data.main.temp
  )}`;
  document.querySelector("#fullWeatherDescription").innerHTML = `${
    response.data.weather[0].main
  } <br /> Windspeed: ${Math.round(
    response.data.wind.speed
  )} mph <br/ > Humidity: ${Math.round(response.data.main.humidity)} %`;

  //Applying the settings for various Emojis
  let runEmoji = displayEmoji(response.data.weather[0].icon);

  //Withdrawing Timezone info from Api and using it to refresh the time // Note simplified version, maybe consider importing google api to maintain
  let timezone = response.data.timezone / 3600;
  //console.log(`Timezone UTC change ${timezone}`); // how many hours to subtract off the UTC time
  document.querySelector(".currentDate").innerHTML = formatDate(
    new Date(),
    timezone
  );

  //Extract the Co-ordinates of the city input from the API and use to call the 5 day forecast
  displayFiveDayForecastConditions(response.data.coord);
}

function displayFiveDayForecastConditions(coordinates) {
  let units = "metric";
  let apiKey = "692e81252347f5426b1d20da827a7848";
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiURL).then(displayforecast);
}

function displayforecast(response) {
  console.log(response.data);

  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#future-day-forecast");

  let forecastHTML = `<div class = "row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6 && index > 0) {
      forecastHTML =
        forecastHTML +
        `<dl class="row">
            <dt class="col-sm-8">
              ${formatDay(forecastDay.dt)} <br />
              <small class="text-muted"
                ><span class="weather-forecast-temp-min"> ${Math.round(
                  forecastDay.temp.min
                )} °</span
                ><span class="weather-forecast-temp-max">/ ${Math.round(
                  forecastDay.temp.max
                )} °</span></small
              >
            </dt>
            <dt class="col-sm-4 smallEmoji">${displayEmoji(
              forecastDay.weather[0].icon
            )}</dt>
            </dl>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

  return days[day];
}

function displayEmoji(icon) {
  if (icon === "01d" || icon === "01n") {
    return "☀";
  } else if (icon === "02d" || icon === "02n") {
    return "⛅";
  } else if (icon === "03d" || icon === "03n") {
    return "☁";
  } else if (icon === "04d" || icon === "04n") {
    return "☁";
  } else if (icon === "09d" || icon === "09n") {
    return "🌧";
  } else if (icon === "10d" || icon === "10n") {
    return "🌦";
  } else if (icon === "11d" || icon === "11n") {
    return "⛈";
  } else if (icon === "13d" || icon === "13n") {
    return "❄";
  } else if (icon === "50d" || icon === "50n") {
    return "🌫";
  } else {
    return "Error - check Code";
  }
}

//Automated loading of weather conditions via detect location
navigator.geolocation.getCurrentPosition(retrieveWeatherViaCoords);

let searchForms = document.querySelector("form");
searchForms.addEventListener("submit", citySearchFunc);

///////////////////////// TIME AND DATE FUNCTIONS////////////////////////////

//////////////AMPM Function Credit: https://stackoverflow.com/questions/8888491/how-do-you-display-javascript-datetime-in-12-hour-am-pm-format"
function formatAMPM(date, utcOffset) {
  let hours = Math.round(date.getUTCHours() + utcOffset); //Note there is an error here - if a city is 30 minutes off, it will display time off by 30 minutes
  let minutes = date.getUTCMinutes();
  let ampm = hours >= 12 ? "pm" : "am"; // Shortend version of an IF function, is hours > 12? Yes (true) -> PM, No (false) -> AM
  hours = hours % 12; // Remainder see also Modulo Operation https://www.mathsisfun.com/definitions/modulo-operation.html#:~:text=The%20modulo%20(or%20%22modulus%22,dividing%20one%20number%20by%20another.&text=It%20is%20like%20we%20aren,just%20where%20we%20end%20up.
  hours = hours ? hours : 12; // the hour '0' should be '12' // Hours? = Is Hours 0 or not? Will return true or false
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

function formatDate(now, utcOffset) {
  //////////////////////////////Arrays Days and Months///////////////////////////////

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let months = [
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

  ///////////////////////////////////////////////////////////////////////

  let minute = now.getMinutes();
  let hour = now.getHours();
  let date = now.getDate();
  let day = days[now.getDay()];
  let month = months[now.getMonth()];
  let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let utcHours = now.getUTCHours();
  let utcminutes = now.getUTCMinutes();

  return ` ${formatAMPM(now, utcOffset)} <br /> ${day}, ${month} ${date}`;
}
