///To Dos

//1 Create Farhenheight to Celcus interative conversion - consider doing additional research on how to turn the value into a number, maybe research how this was done
//4 Sort out the "Server would like to know your location": Maybe add in a user experience button? Or learn to automatically load something
//6 Do final changes on CSS code to make the design look nice
// If feeling confident - maybe add in a google API system for accurate time conversion
//Fix up the quote of the day

//////////////////////////////////////////////////////////////////CALLING API FUNCTIONS//////////////////////////////////////////////////////////////

//Option 1 Open Automated on page loading via detect location
function retrieveWeatherViaCoords(position) {
  let units = "metric";
  let latitude = position.coords.latitude;
  let longditude = position.coords.longitude;
  let apiKey = "692e81252347f5426b1d20da827a7848";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longditude}&units=${units}&appid=${apiKey}`;

  axios.get(apiUrl).then(displayWeatherTimeConditions);
}
navigator.geolocation.getCurrentPosition(retrieveWeatherViaCoords);

//Option 2, User Interaction - user search via forms
function retrieveWeatherViaCitySearchFunc(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  let units = "metric";
  let apiKey = "692e81252347f5426b1d20da827a7848";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(displayWeatherTimeConditions);
}
let searchForms = document.querySelector("form");
searchForms.addEventListener("submit", retrieveWeatherViaCitySearchFunc);

// Call Five Day forecast API Via Initial API call above (Option 1 or Option 2)
function retrieveFiveDayForecastViaAPI(coordinates) {
  let units = "metric";
  let apiKey = "692e81252347f5426b1d20da827a7848";
  let apiURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiURL).then(displayforecast);
}

/////////////////////////////////////////////////////////////DISPLAY FORECAST FUNCTIONS///////////////////////////////////////////////////////////

function displayWeatherTimeConditions(response) {
  //Applying refresh parts of page with weather data
  document.querySelector("#main-heading").innerHTML = response.data.name;
  document.querySelector("#currentTemp").innerHTML = `${Math.round(
    response.data.main.temp
  )}`;
  document.querySelector("#fullWeatherDescription").innerHTML = `${
    response.data.weather[0].main
  } <br /> Windspeed: ${Math.round(
    response.data.wind.speed
  )} mph <br/ > Humidity: ${Math.round(response.data.main.humidity)} %`;

  //Choose Large Weather Emojji
  document.querySelector("#largeEmoji").innerHTML = displayEmoji(
    response.data.weather[0].icon
  );

  //Withdrawing Timezone info from Api and using it to refresh the time // Note simplified version, consider importing google api to maintain
  let timezone = response.data.timezone / 3600;
  document.querySelector("#currentDate").innerHTML = formatDate(
    new Date(),
    timezone
  );

  //Extract the Co-ordinates of the city input from the API and use to call the 5 day forecast
  retrieveFiveDayForecastViaAPI(response.data.coord);
}

function displayforecast(response) {
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

/////////////////////////////////////////////////////////////// TIME AND DATE FUNCTIONS////////////////////////////////////////////////////////////

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

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000); //UNIX timestamp, convert from seconds to milliseconds by *1000, function 'Date' then converts to physical date.
  let day = date.getDay(); //Returns the number of an array
  let days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

  return days[day];
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

/////////////////////////////////////////////////////////Quote of the Day API and Call////////////////////////////////
////Copied from Codepen // https://codepen.io/deepakdk619/pen/eYJYmNL
const api = "https://api.quotable.io/random";

const quote = document.getElementById("quote");
const author = document.getElementById("author");

getQuote();

function getQuote() {
  fetch(api)
    .then((res) => res.json())
    .then((data) => {
      quote.innerHTML = `"${data.content}"`;
      author.innerHTML = `- ${data.author}`;
    });
}
