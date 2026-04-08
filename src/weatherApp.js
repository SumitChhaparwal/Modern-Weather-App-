//adding event to search input
let searchedPlace;
function searchInput() {
  const searchInput = document.querySelector("#search");
  searchInput.addEventListener("change", (e) => {
    e.preventDefault();
    searchedPlace = e.target.value;
    getWDForHeadSec();
    console.log(searchedPlace);
  });
}
searchInput();

//callThrough onClick on btn...
async function getPlaceData() {
  try {
    let placeName = searchedPlace;
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${placeName}&count=10&language=en&format=json`;
    const response = await fetch(url);
    if (!response.ok) {
      console.log("Http Error:", response.status);
      return;
    }
    const placeData = await response.json();
    //apiData in local storage to avoid disappear & to many request through async fun() calling on global scope which automatically call when updates/page reload...
    localStorage.setItem("placeData", JSON.stringify(placeData));
    console.log(placeData);
  } catch (err) {
    console.log("Error:", err);
  }
}

// getWDForHeadSec() for Section1 -> Head-Sec
async function getWDForHeadSec() {
  try {
    await getPlaceData();
    const storedPlaceData = localStorage.getItem("placeData");
    if (!storedPlaceData) {
      console.log("storedPlaceData is not available..");
      return;
    }
    const placeData = JSON.parse(storedPlaceData);
    if (!placeData) {
      console.log("placeData is not available...");
      return;
    }
    let latitude = placeData.results[0].latitude;
    let longitude = placeData.results[0].longitude;

    if (!latitude || !longitude) {
      console.log("Error of latitude and longitude...");
      return;
    }
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,is_day,weather_code,rain&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) {
      console.log("Http Error:", response.status);
      return;
    }
    const data = await response.json();
    const strJson = JSON.stringify(data);
    localStorage.setItem("currentWeatherData", strJson);
    console.log(data);
    getForTodayFAndAirC();
    displayForHeadSec();
  } catch (err) {
    console.log("Error:", err);
  }
}
//displayForHeadSec() for Section1 -> Head-Sec
function displayForHeadSec() {
  const countryName = document.querySelector("#countryName");
  const chanceOf = document.querySelector(".chanceOf");
  const degreeC = document.querySelector(".degC");
  const weatherSymbol = document.querySelector(".weatherSymbol");
  const placeData = JSON.parse(localStorage.getItem("placeData"));
  const weatherData = JSON.parse(localStorage.getItem("currentWeatherData"));
  countryName.innerHTML = placeData.results[0].name;
  let chanceOfRain = weatherData ? weatherData.current.rain : "0";
  chanceOf.innerHTML = `Chance of rain: ${chanceOfRain}%`;
  degreeC.innerHTML = `${Math.round(weatherData.current.temperature_2m)}<span class="font-normal px-0 mx-0">°</span>`;
  if (weatherData.current.is_day) {
    console.log("day");
    if (weatherData.current.weather_code == 0) {
      weatherSymbol.innerHTML = `<img src="../assets/animated/day.svg" alt="dayWeatherImage" />`;
    } else if (
      weatherData.current.weather_code <= 3 &&
      weatherData.current.weather_code >= 1
    ) {
      weatherSymbol.innerHTML = `<img src="../assets/animated/cloudy-day-1.svg" alt="dayWeatherImage" />`;
    } else if (
      weatherData.current.weather_code === 45 ||
      weatherData.current.weather_code === 48
    ) {
      weatherSymbol.innerHTML = `<img src="../assets/animated/cloudy.svg" alt="dayWeatherImage" />`;
    } else if (weatherData.current.weather_code <= 57) {
      weatherSymbol.innerHTML = `<img src="../assets/animated/rainy-2.svg" alt="dayWeatherImage" />`;
    } else if (weatherData.current.weather_code <= 67) {
      weatherSymbol.innerHTML = `<img src="../assets/animated/rainy-6.svg" alt="dayWeatherImage" />`;
    } else if (weatherData.current.weather_code <= 77) {
      weatherSymbol.innerHTML = `<img src="../assets/animated/snowy-3.svg" alt="dayWeatherImage" />`;
    } else if (weatherData.current.weather_code <= 82) {
      weatherSymbol.innerHTML = `<img src="../assets/animated/rainy-7.svg" alt="dayWeatherImage" />`;
    } else if (weatherData.current.weather_code <= 86) {
      weatherSymbol.innerHTML = `<img src="../assets/animated/snowy-6.svg" alt="dayWeatherImage" />`;
    } else if (weatherData.current.weather_code <= 99) {
      weatherSymbol.innerHTML = `<img src="../assets/animated/thunder.svg" alt="dayWeatherImage" />`;
    }
  } else {
    console.log("night");
    if (weatherData.current.weather_code === 0) {
      weatherSymbol.innerHTML = `<img src="../assets/animated/night.svg" alt="dayWeatherImage" />`;
    } else if (
      weatherData.current.weather_code <= 3 &&
      weatherData.current.weather_code >= 1
    ) {
      weatherSymbol.innerHTML = `<img src="../assets/animated/cloudy-night-1.svg" alt="dayWeatherImage" />`;
    } else if (
      weatherData.current.weather_code === 45 ||
      weatherData.current.weather_code === 48
    ) {
      weatherSymbol.innerHTML = `<img src="../assets/animated/cloudy.svg" alt="dayWeatherImage" />`;
    } else if (weatherData.current.weather_code <= 57) {
      weatherSymbol.innerHTML = `<img src="../assets/animated/rainy-4.svg" alt="dayWeatherImage" />`;
    } else if (weatherData.current.weather_code <= 67) {
      weatherSymbol.innerHTML = `<img src="../assets/animated/rainy-6.svg" alt="dayWeatherImage" />`;
    } else if (weatherData.current.weather_code <= 77) {
      weatherSymbol.innerHTML = `<img src="../assets/animated/snowy-5.svg" alt="dayWeatherImage" />`;
    } else if (weatherData.current.weather_code <= 82) {
      weatherSymbol.innerHTML = `<img src="../assets/animated/rainy-7.svg" alt="dayWeatherImage" />`;
    } else if (weatherData.current.weather_code <= 86) {
      weatherSymbol.innerHTML = `<img src="../assets/animated/snowy-6.svg" alt="dayWeatherImage" />`;
    } else if (weatherData.current.weather_code <= 99) {
      weatherSymbol.innerHTML = `<img src="../assets/animated/thunder.svg" alt="dayWeatherImage" />`;
    }
  }
}
if (
  localStorage.getItem("placeData") &&
  localStorage.getItem("currentWeatherData")
) {
  displayForHeadSec();
}

//getForTodayFAndAirC() for section1 -> today forecast sec & air conditions sec...
async function getForTodayFAndAirC() {
  try {
    const storedPlaceData = localStorage.getItem("placeData");
    if (!storedPlaceData) {
      console.log("Place data is not available in getForTodayFAndAirC...");
      return;
    }
    const placeData = JSON.parse(storedPlaceData);
    const latitude = placeData.results[0].latitude;
    const longitude = placeData.results[0].longitude;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=,temperature_2m,weather_code,rain,apparent_temperature,wind_speed_10m,relative_humidity_2m,visibility,uv_index,is_day&timezone=auto&forecast_days=1`;
    const response = await fetch(url);
    if (!response.ok) {
      console.log("Http Error: ", response.status);
      return;
    }
    const data = await response.json();
    localStorage.setItem("hourlyWeatherData", JSON.stringify(data));
    console.log("hourlyWeatherData", data);
  } catch (err) {
    console.log("Error:", err);
  }
}

//displayForTodayF() for section1 -> today forecast sec
function displayForTodayF() {
  const hourlyWeatherData = JSON.parse(
    localStorage.getItem("hourlyWeatherData"),
  );

  if (!hourlyWeatherData) {
    console.log("hourlyWeatherData is not available..");
  }
  //selecting container element
  const currentForecast = document.querySelector("#currentF");
  const dayTimeArr = hourlyWeatherData.hourly.time;
  const now = new Date().getHours();
  //creating arr of objects for TodayForecast...
  const arrOfObjects = dayTimeArr.map((time, i) => {
    let fullTime = time.slice(11);
    let editedHour = Math.round(fullTime.slice(0, 2))+1;
    console.log(editedHour)
    return {
      dHour: editedHour,
      dTime: fullTime,
      weatherCode: hourlyWeatherData.hourly.weather_code[i],
      temperature: hourlyWeatherData.hourly.temperature_2m[i],
    };
  }).filter((ele) => ele.dHour >= now);

  console.log(arrOfObjects);

  console.log(hourlyWeatherData.hourly);
}
displayForTodayF();

//displayForAirC() for section1 -> air conditions sec
function displayForAirC() {}
