//adding event to search input
let searchedPlace;
//custom alert popup..
function customAlert(msg) {
  const alertMsg = document.querySelector(".alertMsg");
  const cAlert = document.querySelector(".customAlert");
  cAlert.style.display="flex";
  alertMsg.innerHTML = msg;
}
//close button of alert popup..
const crossBtn = document.querySelector(".crossBtn");
const cAlert = document.querySelector(".customAlert");
crossBtn.addEventListener("click", (ele) => {
  ele.preventDefault();
  cAlert.style.display = "none";
  console.log("close");
});

//Current Location Implementation..
//Checking browser is support current location or not..
function checkCurrentLocation() {
  const locationBtn = document.querySelector(".targetCurrentLocation");
  locationBtn.addEventListener("click", (e) => {
    e.preventDefault();
    locationBtn.style.color = "rgb(232, 206, 40)";
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error, options);
    } else {
      customAlert("Your browser doesn't support current location..");
    }
  });
}
checkCurrentLocation();

function success(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  console.log("current place latitude ", latitude);
  console.log("current place longitude ", longitude);
  getPlaceName(latitude, longitude);
}
function error() {
  customAlert(
    "Unable to retrieve your current location. Check your browser permission..",
  );
}
const options = {
  enableHighAccuracy: true,
  timeout: 20000,
  maximumAge: 0,
};

//Getting currentLocation place name..
async function getPlaceName(lat, lon) {
  try {
    if (!lat || !lon) {
      console.log("latitude and longitude are not available..");
    }
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const response = await fetch(url);
    if (!response.ok) {
      console.log("Http Error: ", response.status);
      return;
    }
    const placeData = await response.json();
    let PlaceName = placeData.localityInfo.administrative[2].name;
    if (localStorage.getItem("searchHistory")) {
      const preHistory = JSON.parse(localStorage.getItem("searchHistory"));
      preHistory.unshift(PlaceName);
      const arr = [...new Set(preHistory)];
      localStorage.setItem("searchHistory", JSON.stringify(arr));
      checkCurrentPlace();
    } else {
      const arr = [];
      arr.push(PlaceName);
      localStorage.setItem("searchHistory", JSON.stringify(arr));
      checkCurrentPlace();
    }
  } catch (err) {
    console.log("Error to get placeNameData.. ", err);
    alert("Error occurs when access your location name..");
  }
}

function checkCurrentPlace() {
  //check recentSearched term...
  //get current arrayElement element from localstorage to check condition...
  let recentPlace;
  if (localStorage.getItem("searchHistory")) {
    recentSearch = JSON.parse(localStorage.getItem("searchHistory"));
    let recentS = recentSearch[0];
    recentPlace = recentS ? recentS.trim() : "";
  }
  if (localStorage.getItem("searchHistory") && recentPlace) {
    searchedPlace = recentPlace;
    getWDForHeadSec();
    getForTodayFAndAirC();
    getForSevenDayForecast();
    console.log(searchedPlace);
    document.querySelector(".dropdownHistory").style.display = "none";
  } else {
    //if all localStorage are empty, its uses default location...
    searchedPlace = "jodhpur";
    getWDForHeadSec();
    getForTodayFAndAirC();
    getForSevenDayForecast();
    console.log(searchedPlace);
    document.querySelector(".dropdownHistory").style.display = "none";
  }
}
checkCurrentPlace();

function searchInput() {
  const searchInput = document.querySelector("#search");
  const dropdownHistory = document.querySelector(".dropdownHistory");
  const vELement = document.querySelector(".validation");
  searchInput.addEventListener("change", (e) => {
    e.preventDefault();
    searchedPlace = e.target.value;
    // Input Validation...
    //valid fun()
    function ok(element, msg) {
      element.innerHTML = msg;
    }
    //invalid fun()
    function error(element, msg) {
      element.innerText = msg;
    }
    const searchPlace = searchedPlace.trim();

    function validateInput() {
      if (searchedPlace.trim() === "") {
        dropdownHistory.style.display = "none";
        vELement.className = "invalid";
        error(vELement, "*Please fill out this field..");
        //close slide after delay
        setTimeout(() => {
          vELement.style.display = "none";
        }, 3000);
        return false;
      } else if (!/^[a-zA-Z\s]+$/.test(searchPlace)) {
        vELement.style.display = "block";
        dropdownHistory.style.display = "none";
        vELement.className = "invalid";
        error(vELement, "Invalid place name is entered..");
        setTimeout(() => {
          vELement.style.display = "none";
        }, 3000);
        return false;
      } else if (searchPlace.length < 4) {
        vELement.style.display = "block";
        dropdownHistory.style.display = "none";
        vELement.className = "invalid";
        error(vELement, "*Please enter proper name of the place..");
        setTimeout(() => {
          vELement.style.display = "none";
        }, 3000);
        return false;
      } else if (searchPlace.length > 30) {
        vELement.style.display = "block";
        dropdownHistory.style.display = "none";
        vELement.className = "invalid";
        error(vELement, "*Place name must be under 40 character..");
        setTimeout(() => {
          vELement.style.display = "none";
        }, 3000);
        return false;
      } else {
        vELement.style.display = "block";
        dropdownHistory.style.display = "none";
        vELement.className = "valid";
        ok(vELement, "Place name is valid!");
        setTimeout(() => {
          vELement.style.display = "none";
        }, 2000);
        return true;
      }
    }
    validateInput();

    const searchHistoryArr = [];
    if (validateInput()) {
      searchHistoryArr.unshift(searchedPlace);
      if (!localStorage.getItem("searchHistory")) {
        localStorage.setItem("searchHistory", JSON.stringify(searchHistoryArr));
      } else {
        const historyArr = JSON.parse(localStorage.getItem("searchHistory"));
        const newHistoryArr = [...searchHistoryArr, ...historyArr];
        localStorage.setItem("searchHistory", JSON.stringify(newHistoryArr));
      }
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      return;
    }
    localStorage.removeItem("hourlyWeatherData");
    localStorage.removeItem("arrOfObjectsHWD");
    localStorage.removeItem("7DaysForecast");
    getWDForHeadSec();
    getForTodayFAndAirC();
    getForSevenDayForecast();
    // window.location.reload();
    console.log(searchedPlace);
  });
}
searchInput();

//callThrough onClick on btn...
async function getPlaceData() {
  try {
    let placeName = searchedPlace.replace("district", "");

    console.log("----------------", placeName);
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${placeName.replace(" ", "")}&count=10&language=en&format=json`;
    const response = await fetch(url);
    if (!response.ok) {
      console.log("Http Error:", response.status);
      return;
    }
    const placeD = await response.json();
    console.log("*********************", placeD);
    if (!placeD.results) {
      console.log("place data is not available..");
      return;
    }
    //apiData in local storage to avoid disappear & to many request through async fun() calling on global scope which automatically call when updates/page reload...
    localStorage.setItem("placeData", JSON.stringify(placeD));
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
    displayForHeadSec();
  } catch (err) {
    console.log("Error:", err);
  }
}

function toDecideWSymbol(isDay, weatherCode) {
  if (isDay) {
    console.log("day");
    if (weatherCode == 0) {
      return `<img src="../assets/animated/day.svg" alt="dayWeatherImage" />`;
    } else if (weatherCode <= 3 && weatherCode >= 1) {
      return `<img src="../assets/animated/cloudy-day-1.svg" alt="dayWeatherImage" />`;
    } else if (weatherCode === 45 || weatherCode === 48) {
      return `<img src="../assets/animated/cloudy.svg" alt="dayWeatherImage" />`;
    } else if (weatherCode <= 57) {
      return `<img src="../assets/animated/rainy-2.svg" alt="dayWeatherImage" />`;
    } else if (weatherCode <= 67) {
      return `<img src="../assets/animated/rainy-6.svg" alt="dayWeatherImage" />`;
    } else if (weatherCode <= 77) {
      return `<img src="../assets/animated/snowy-3.svg" alt="dayWeatherImage" />`;
    } else if (weatherCode <= 82) {
      return `<img src="../assets/animated/rainy-7.svg" alt="dayWeatherImage" />`;
    } else if (weatherCode <= 86) {
      return `<img src="../assets/animated/snowy-6.svg" alt="dayWeatherImage" />`;
    } else if (weatherCode <= 99) {
      return `<img src="../assets/animated/thunder.svg" alt="dayWeatherImage" />`;
    }
  } else {
    console.log("night");
    if (weatherCode === 0) {
      return `<img src="../assets/animated/night.svg" alt="dayWeatherImage" />`;
    } else if (weatherCode <= 3 && weatherCode >= 1) {
      return `<img src="../assets/animated/cloudy-night-1.svg" alt="dayWeatherImage" />`;
    } else if (weatherCode === 45 || weatherCode === 48) {
      return `<img src="../assets/animated/cloudy.svg" alt="dayWeatherImage" />`;
    } else if (weatherCode <= 57) {
      return `<img src="../assets/animated/rainy-4.svg" alt="dayWeatherImage" />`;
    } else if (weatherCode <= 67) {
      return `<img src="../assets/animated/rainy-6.svg" alt="dayWeatherImage" />`;
    } else if (weatherCode <= 77) {
      return `<img src="../assets/animated/snowy-5.svg" alt="dayWeatherImage" />`;
    } else if (weatherCode <= 82) {
      return `<img src="../assets/animated/rainy-7.svg" alt="dayWeatherImage" />`;
    } else if (weatherCode <= 86) {
      return `<img src="../assets/animated/snowy-6.svg" alt="dayWeatherImage" />`;
    } else if (weatherCode <= 99) {
      return `<img src="../assets/animated/thunder.svg" alt="dayWeatherImage" />`;
    }
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
  countryName.style.textTransform = "capitalize";
  let chanceOfRain = weatherData ? weatherData.current.weather_code : "0";
  chanceOf.innerHTML = `Chance of rain: ${chanceOfRain}%`;
  const currentTemp = Math.round(weatherData.current.temperature_2m);
  degreeC.innerHTML = `${currentTemp < 39 ? `${currentTemp}<span class="font-normal px-0 mx-0">°</span>` : `${currentTemp}<span class="font-normal px-0 mx-0">°</span> <i class="tempAlert fi fi-tr-high-temperature-alert"></i>`}`;
  //fun which decide img according to weather condition..
  const finalSymbol = toDecideWSymbol(
    weatherData.current.is_day,
    weatherData.current.weather_code,
  );
  weatherSymbol.innerHTML = finalSymbol;
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
    await getWDForHeadSec();
    const storedPlaceData = localStorage.getItem("placeData");
    if (!storedPlaceData) {
      console.log("Place data is not available in getForTodayFAndAirC...");
      return;
    }
    let placeData = JSON.parse(storedPlaceData);
    const latitude = placeData.results[0].latitude;
    const longitude = placeData.results[0].longitude;
    if (!latitude || !longitude) {
      console.log("Latitude and Longitude are not defined..");
      return;
    }
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=,temperature_2m,weather_code,rain,apparent_temperature,wind_speed_10m,relative_humidity_2m,visibility,uv_index,is_day&timezone=auto&forecast_days=1`;
    const response = await fetch(url);
    if (!response.ok) {
      console.log("Http Error: ", response.status);
      return;
    }
    const data = await response.json();
    localStorage.setItem("hourlyWeatherData", JSON.stringify(data));
    console.log("hourlyWeatherData", data);
    displayForTodayF();
    displayForAirC();
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
  const currentWeatherData = JSON.parse(
    localStorage.getItem("currentWeatherData"),
  );
  //selecting container element
  const currentForecast = document.querySelector("#currentF");
  const dayTimeArr = hourlyWeatherData.hourly.time;
  const etimezone = hourlyWeatherData.timezone;
  console.log(etimezone);

  const currentHour = currentWeatherData.current.time.slice(11, 13);
  const now = Number(currentHour);
  //creating arr of objects for TodayForecast...
  const arrOfObjects = dayTimeArr
    .map((time, i) => {
      let editHour = time.slice(11);
      let editedHour = Math.round(editHour.slice(0, 2));
      let fullTime = editedHour % 12 || 12;
      console.log(fullTime);
      return {
        dHour: editedHour,
        dTime: fullTime,
        weatherCode: hourlyWeatherData.hourly.weather_code[i],
        temperature: hourlyWeatherData.hourly.temperature_2m[i],
        isDay: hourlyWeatherData.hourly.is_day[i],
        realFeel: hourlyWeatherData.hourly.apparent_temperature[i],
        uvIndex: hourlyWeatherData.hourly.uv_index[i],
        windSpeed: hourlyWeatherData.hourly.wind_speed_10m[i],
        chanceOfRain: currentWeatherData.current.weather_code,
        humidity: hourlyWeatherData.hourly.relative_humidity_2m[i],
        visibility: hourlyWeatherData.hourly.visibility[i],
      };
    })
    .filter((ele) => ele.dHour >= now);
  //changing first element of arrofobjs from now..
  arrOfObjects[0].dTime = "Now";
  arrOfObjects[0].weatherCode = currentWeatherData.current.weather_code;
  arrOfObjects[0].temperature = currentWeatherData.current.temperature_2m;
  console.log("Arr", arrOfObjects);
  if (arrOfObjects) {
    localStorage.setItem("arrOfObjectsHWD", JSON.stringify(arrOfObjects));
  }
  //apply mapping...
  const newArrOfObj = arrOfObjects.map((item) => {
    return `
      <div class="dayTime flex flex-col items-center">
        <div class="cTime text-xs font-semibold">${item.dTime === "Now" ? "Now" : item.dTime + `:00 ${item.dHour >= 12 ? "PM" : "AM"}`}</div>
        <div class="cSymbol">
         ${toDecideWSymbol(item.isDay, item.weatherCode).replace("animated", "static")}
        </div>
        <div class="cTemp text-md font-semibold">${item.temperature > 0 ? Math.round(item.temperature) : item.temperature}°</div>
      </div>
      `;
  });
  currentForecast.innerHTML = newArrOfObj.join("");
  console.log(hourlyWeatherData.hourly);
}
if (localStorage.getItem("hourlyWeatherData")) {
  displayForTodayF();
}

//displayForAirC() for section1 -> air conditions sec
function displayForAirC() {
  const arrOfObjects = JSON.parse(localStorage.getItem("arrOfObjectsHWD"));
  console.log("ArrOfObjs", arrOfObjects);
  const wcElement = document.querySelector(".wConditions");
  wcElement.innerHTML = `
  <div class="wType shadow-xl">
                <div class="col1"><i class="fi fi-sr-heat"></i></div>
                <div class="col2">
                  <div class="name">Real Feel</div>
                  <div class="measure">${arrOfObjects[0].realFeel}°</div>
                </div>
              </div>
              <div class="wType shadow-xl">
                <div class="col1"><i class="fi fi-br-brightness"></i></div>
                <div class="col2">
                  <div class="name">UV Index</div>
                  <div class="measure">${arrOfObjects[0].uvIndex}</div>
                </div>
              </div>
              <div class="wType shadow-xl">
                <div class="col1"><i class="fi fi-bs-wind"></i></div>
                <div class="col2">
                  <div class="name">Wind Speed</div>
                  <div class="measure">${arrOfObjects[0].windSpeed} km/h</div>
                </div>
              </div>
              <div class="wType shadow-xl">
                <div class="col1"><i class="fi fi-bs-raindrops"></i></div>
                <div class="col2">
                  <div class="name">Chance of rain</div>
                  <div class="measure">${arrOfObjects[0].chanceOfRain}%</div>
                </div>
              </div>
              <div class="wType shadow-xl">
                <div class="col1"><i class="fi fi-bs-umbrella"></i></div>
                <div class="col2">
                  <div class="name">Humidity</div>
                  <div class="measure">${arrOfObjects[0].humidity}%</div>
                </div>
              </div>
              <div class="wType">
                <div class="col1"><i class="fi fi-rs-eye"></i></div>
                <div class="col2">
                  <div class="name">Visibility</div>
                  <div class="measure">${arrOfObjects[0].visibility / 1000} km</div>
                </div>
              </div>
  `;
}
if (localStorage.getItem("arrOfObjectsHWD")) {
  displayForAirC();
}

//getfunc() for section2 -> seven days forecast sec...
async function getForSevenDayForecast() {
  try {
    await getForTodayFAndAirC();
    const placeData = JSON.parse(localStorage.getItem("placeData"));
    if (!placeData) {
      console.log("place data is not available...");
      return;
    }
    const latitude = placeData.results[0].latitude;
    const longitude = placeData.results[0].longitude;

    if (!latitude || !longitude) {
      console.log("latitude and longitude of place are not defined...");
      return;
    }
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_min,temperature_2m_max&models=geosphere_seamless,best_match&timezone=auto&forecast_days=7`;

    const response = await fetch(url);
    if (!response.ok) {
      console.log("Http Error:", response.status);
      return;
    }
    const data = await response.json();
    console.log("7DaysForecast Data", data);
    localStorage.setItem("7DaysForecast", JSON.stringify(data));
    displayDaysForecast();
  } catch (err) {
    console.log("Error:", err);
  }
}
if (localStorage.getItem("placeData")) {
  getForSevenDayForecast();
}

//fun() to check weatherConditionofday
function checkWCOfDay(weatherCode) {
  if (weatherCode == 0) {
    return `Sunny`;
  } else if (weatherCode <= 3 && weatherCode >= 1) {
    return `Cloudy`;
  } else if (weatherCode === 45 || weatherCode === 48) {
    return `Fog`;
  } else if (weatherCode <= 67 || weatherCode <= 57) {
    return `Rainy`;
  } else if (weatherCode <= 77) {
    return `Snowy`;
  } else if (weatherCode <= 82) {
    return `Rainfall`;
  } else if (weatherCode <= 86) {
    return `Snowy`;
  } else if (weatherCode <= 99) {
    return `Thunder`;
  }
}
//func() for display seven days forecast...
function displayDaysForecast() {
  const daysForecast = JSON.parse(localStorage.getItem("7DaysForecast"));
  const forecastElement = document.querySelector(".sevenDayForecast");
  if (!daysForecast) {
    console.log("seven days forecast data is not available");
    return;
  }
  const timeArr = daysForecast.daily.time;
  console.log(timeArr);
  const newArray = timeArr.map((time, i) => {
    const date = new Date(time);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    console.log(dayName);
    return {
      day: dayName,
      weatherCode: daysForecast.daily.weather_code_best_match[i],
      max_temp: Math.round(daysForecast.daily.temperature_2m_max_best_match[i]),
      min_temp: Math.round(daysForecast.daily.temperature_2m_min_best_match[i]),
    };
  });
  newArray[0].day = "Today";

  const finalDaysForecast = newArray
    .map((item) => {
      return `
      <div class="day">
              <div class="dayName">${item.day}</div>
              <div class="dayWType">
                <div class="icon">
                  ${toDecideWSymbol(1, item.weatherCode).slice().replace("animated", "static")}
                </div>
                <div class="name">${checkWCOfDay(item.weatherCode)}</div>
              </div>
              <div class="temp">
                <span class="f">${item.max_temp}</span
                ><span class="s text-gray-300">/${item.min_temp}</span>
              </div>
       </div>
      `;
    })
    .join("");
  forecastElement.innerHTML = finalDaysForecast;
}
if (localStorage.getItem("7DaysForecast")) {
  displayDaysForecast();
}

//displaySearchTerm() fun... to display weatherData of searchTerm when click on a recent search option...
function displaySearchTerm() {
  const dropdownHistory = document.querySelector(".dropdownHistory");
  const historyArr = JSON.parse(localStorage.getItem("searchHistory"));
  dropdownHistory.addEventListener("mousedown", (e) => {
    // const currentP = e.target.value;
    if (e.target.classList.contains("dropdownItem")) {
      let currentP = e.target.innerText;
      historyArr.unshift(currentP);
      //using new set() method get array with unique values..
      const uniqueValueArr = [...new Set(historyArr)];
      localStorage.setItem("searchHistory", JSON.stringify(uniqueValueArr));
      searchedPlace = e.target.innerText;
      localStorage.removeItem("hourlyWeatherData");
      localStorage.removeItem("arrOfObjectsHWD");
      localStorage.removeItem("7DaysForecast");
      checkCurrentPlace();
      // getWDForHeadSec();
      // getForTodayFAndAirC();
      // getForSevenDayForecast();
      window.location.reload();
    }
  });
}
//This fun() called in below...

//Fun() to store search term in localStorage...

//Search History...
function searchHistoryFun() {
  const sInput = document.querySelector("#search");
  const dropdownHistory = document.querySelector(".dropdownHistory");
  if (!localStorage.getItem("searchHistory")) {
    return;
  }
  const searchHistoryArr = JSON.parse(
    localStorage.getItem("searchHistory"),
  ).slice(0, 6);
  const finalSearchHistory = searchHistoryArr
    .map((item) => {
      return `
   <div class="dropdownItem py-1 px-2 rounded-sm">
    ${item}
    </div>
  `;
    })
    .join("");
  dropdownHistory.innerHTML = finalSearchHistory;
  //ByDefault its display is none...
  dropdownHistory.style.display = "none";
  //Disappear when element loose foucs...
  sInput.addEventListener("blur", () => {
    dropdownHistory.style.display = "none";
  });

  //Appear when get focus...
  sInput.addEventListener("focus", () => {
    dropdownHistory.style.display = "block";
  });
  displaySearchTerm();
}
searchHistoryFun();
