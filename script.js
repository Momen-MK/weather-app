// ==========================
// Dropdown Units Menu
// ==========================
const unitsBtn = document.querySelector(".units-btn");
const dropContainer = document.querySelector(".drop");

let dropdown = null;
let currentWeatherData = null;
let currentHourlyDayIndex = 0;

unitsBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  if (!dropdown) {
    dropdown = document.createElement("div");
    dropdown.className = "dropdown";

    dropdown.innerHTML = `
      <div class="list">
        <h3><button>${getOverallMode() === "imperial" ? unitModeText.imperial : unitModeText.metric}</button></h3>

        <ul>
          <p class="top">Temperature</p>

          <li>
          <button class="options" data-group="temperature" data-value="celsius">
          <p class="option">Celsius (°C)</p>
          <img src="assets/images/icon-checkmark.svg" alt="Selected">
          </button>
          </li>

          <li>
          <button class="options" data-group="temperature" data-value="fahrenheit">
          <p class="option">Fahrenheit (°F)</p>
          <img src="assets/images/icon-checkmark.svg" alt="Selected">
          </button>
          </li>

        </ul>
        
        <ul>
          <p class="top">Wind Speed</p>

          <li>
          <button class="options" data-group="wind" data-value="kmh">
          <p class="option">km/h</p>
          <img src="assets/images/icon-checkmark.svg" alt="Selected">
          </button>
          </li>

          <li>
          <button class="options" data-group="wind" data-value="mph">
          <p class="option">mph</p>
          <img src="assets/images/icon-checkmark.svg" alt="Selected">
          </button>
          </li>

        </ul>

        <ul class="precipitation">
          <p class="top">Precipitation</p>

          <li>
            <button class="options" data-group="precipitation" data-value="mm">
              <p class="option">Millimeters (mm)</p>
              <img src="assets/images/icon-checkmark.svg" alt="Selected">
            </button>
          </li>

          <li>
            <button class="options" data-group="precipitation" data-value="in">
              <p class="option">Inches (in)</p>
              <img src="assets/images/icon-checkmark.svg" alt="Selected">
            </button>
          </li>

        </ul>
      </div>
    `;

    dropContainer.appendChild(dropdown);

    updateDropdownSelection(dropdown);

    dropdown.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    const switchButton = dropdown.querySelector(".list h3 button");
    switchButton.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleUnitMode();
      updateDropdownSelection(dropdown);
    });

    dropdown.querySelectorAll(".options").forEach((button) => {
      button.addEventListener("click", (e) => {
        e.stopPropagation();
        setGroupUnit(button.dataset.group, button.dataset.value);
        updateDropdownSelection(dropdown);
      });
    });

  } else {
    dropdown.remove();
    dropdown = null;
  }
});

document.addEventListener("click", () => {
  if (dropdown) {
    dropdown.remove();
    dropdown = null;
  }
});


// ==========================
// Search Elements
// ==========================
const searchInput = document.querySelector(".search-bar");
const suggestionsList = document.querySelector(".suggestions");
const searchBtn = document.querySelector(".search-btn");


// ==========================
// Hourly Elements
// ==========================
const dropdownToggle = document.querySelector(".dropdown-toggle");
const dropdownMenu = document.querySelector(".dropdown-menu");
const hourlyContainer = document.querySelector(".hourly-container");


// ==========================
// Helpers
// ==========================
function setText(className, value) {
  const elements = document.querySelectorAll("." + className);
  elements.forEach(el => el.textContent = value);
}

function calcFeelsLike(tempC, humidity, windKmH) {
  if (tempC >= 27 && humidity >= 40) {
    return tempC + 0.33 * humidity - 0.70 * (windKmH / 1.6) - 4;
  }

  if (tempC <= 10 && windKmH > 4) {
    return (
      13.12 +
      0.6215 * tempC -
      11.37 * (windKmH ** 0.16) +
      0.3965 * tempC * (windKmH ** 0.16)
    );
  }

  return tempC;
}


// ==========================
// Weather Icons Mapping (Open-Meteo Codes)
// ==========================
const weatherImages = {
  0: "icon-sunny.webp",

  1: "icon-partly-cloudy.webp",
  2: "icon-partly-cloudy.webp",
  3: "icon-overcast.webp",

  45: "icon-fog.webp",
  48: "icon-fog.webp",

  51: "icon-drizzle.webp",
  53: "icon-drizzle.webp",
  55: "icon-drizzle.webp",

  61: "icon-rain.webp",
  63: "icon-rain.webp",
  65: "icon-rain.webp",

  71: "icon-snow.webp",
  73: "icon-snow.webp",
  75: "icon-snow.webp",

  80: "icon-rain.webp",
  81: "icon-rain.webp",
  82: "icon-rain.webp",

  95: "icon-storm.webp"
};

const activeUnits = {
  temperature: "celsius",
  wind: "kmh",
  precipitation: "mm"
};

const unitModeText = {
  metric: "Switch to Imperial",
  imperial: "Switch to Metric"
};

const allUnits = {
  metric: {
    temperature: "celsius",
    wind: "kmh",
    precipitation: "mm"
  },
  imperial: {
    temperature: "fahrenheit",
    wind: "mph",
    precipitation: "in"
  }
};

function getOverallMode() {
  if (
    activeUnits.temperature === allUnits.metric.temperature &&
    activeUnits.wind === allUnits.metric.wind &&
    activeUnits.precipitation === allUnits.metric.precipitation
  ) {
    return "metric";
  }

  if (
    activeUnits.temperature === allUnits.imperial.temperature &&
    activeUnits.wind === allUnits.imperial.wind &&
    activeUnits.precipitation === allUnits.imperial.precipitation
  ) {
    return "imperial";
  }

  return "mixed";
}

function updateBodyClasses() {
  document.body.classList.toggle("temp-metric", activeUnits.temperature === "celsius");
  document.body.classList.toggle("temp-imperial", activeUnits.temperature === "fahrenheit");

  document.body.classList.toggle("wind-metric", activeUnits.wind === "kmh");
  document.body.classList.toggle("wind-imperial", activeUnits.wind === "mph");

  document.body.classList.toggle("precip-metric", activeUnits.precipitation === "mm");
  document.body.classList.toggle("precip-imperial", activeUnits.precipitation === "in");
}

function convertTemp(tempC) {
  return activeUnits.temperature === "fahrenheit"
    ? (tempC * 9) / 5 + 32
    : tempC;
}

function setAllUnits(mode) {
  Object.assign(activeUnits, allUnits[mode]);
  updateBodyClasses();
}

function setGroupUnit(group, value) {
  activeUnits[group] = value;
  updateBodyClasses();
  if (group === "temperature" && currentWeatherData) {
    renderHourly(currentWeatherData, currentHourlyDayIndex);
  }
}

function toggleUnitMode() {
  const overall = getOverallMode();
  const targetMode = overall === "imperial" ? "metric" : "imperial";
  setAllUnits(targetMode);
  if (currentWeatherData) {
    renderHourly(currentWeatherData, currentHourlyDayIndex);
  }
}

function updateDropdownSelection(dropdown) {
  const switchButton = dropdown.querySelector(".list h3 button");
  if (switchButton) {
    const overall = getOverallMode();
    switchButton.textContent = overall === "imperial" ? unitModeText.imperial : unitModeText.metric;
  }

  dropdown.querySelectorAll(".options").forEach((button) => {
    const group = button.dataset.group;
    const value = button.dataset.value;
    const isSelected = activeUnits[group] === value;
    button.classList.toggle("selected", isSelected);
  });
}

updateBodyClasses();


// ==========================
// Hourly Forecast Dropdown + Render
// ==========================
function fillDayDropdown(data) {
  dropdownMenu.innerHTML = "";

  data.daily.time.forEach((day, index) => {
    const li = document.createElement("li");

    const dayName = new Date(day).toLocaleDateString("en-US", {
      weekday: "long"
    });

    li.textContent = dayName;
    li.dataset.index = index;

    li.addEventListener("click", () => {
      currentHourlyDayIndex = index;
      dropdownToggle.innerHTML = `${dayName}<img src="assets/images/icon-dropdown.svg" alt="">`;
      dropdownMenu.classList.remove("show");
      renderHourly(data, index);
    });

    dropdownMenu.appendChild(li);
  });

  // Set initial
  if (data.daily.time.length > 0) {
    const firstDay = new Date(data.daily.time[0]).toLocaleDateString("en-US", {
      weekday: "long"
    });
    dropdownToggle.innerHTML = `${firstDay}<img src="assets/images/icon-dropdown.svg" alt="">`;
  }
}

function renderHourly(data, dayIndex) {
  hourlyContainer.innerHTML = "";

  const start = dayIndex * 8;
  const end = start + 8;

  const currentHour = new Date().getHours();

  for (let i = start; i < end; i++) {
    const time = data.hourly.time[i];
    const temp = convertTemp(data.hourly.temperature_2m[i]);
    const code = data.hourly.weathercode[i];

    const imgName = weatherImages[code] || "default.webp";

    let hour;
    if (dayIndex === 0) {
      const futureHour = (currentHour + (i - start)) % 24;
      hour = new Date(0, 0, 0, futureHour).toLocaleTimeString("en-US", {
        hour: "numeric"
      });
    } else {
      hour = new Date(time).toLocaleTimeString("en-US", {
        hour: "numeric"
      });
    }

    const div = document.createElement("div");
    div.classList.add("hour-card");

    div.innerHTML = `

      <div class = "status-time">
      <img src="assets/images/${imgName}" class="hour-icon">
      <p class="hour-time">${hour}</p>
      </div>
      
      <div>
      <p class="hour-temp">${temp.toFixed(0)}°</p>
      </div>
      
    `;

    hourlyContainer.appendChild(div);
  }
}

function startHourlySection(data) {
  fillDayDropdown(data);

  // show first day by default
  renderHourly(data, 0);

  dropdownToggle.addEventListener("click", () => {
    dropdownMenu.classList.toggle("show");
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".custom-dropdown")) {
      dropdownMenu.classList.remove("show");
    }
  });
}


// ==========================
// Render Weather
// ==========================
function renderWeather(data) {
  const windKmH = data.current_weather.windspeed;
  const windMph = windKmH * 0.621371;

  const tempC = data.current_weather.temperature;
  const tempF = (tempC * 9) / 5 + 32;

  const humidity = data.hourly.relativehumidity_2m[0];
  const humidityUnit = data.hourly_units.relativehumidity_2m;

  const feelsLikeC = calcFeelsLike(tempC, humidity, windKmH);
  const feelsLikeF = (feelsLikeC * 9/5) + 32;

  const precipitation = data.hourly.precipitation[0];
  const precipitationUnit = data.hourly_units.precipitation;
  const precipitationIn = precipitation * 0.0393701;

  const time = data.daily.time[0];
  const formatted = new Date(time).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  currentWeatherData = data;
  setText("location", data.timezone.replace("/", ","));
  setText("tempC", `${tempC.toFixed(0)}°`);
  setText("tempF", `${tempF.toFixed(0)}°`);
  setText("humidity", `${humidity}${humidityUnit}`);

  setText("feelsC", `${Math.round(feelsLikeC)}°`);
  setText("feelsF", `${Math.round(feelsLikeF)}°`);

  setText("km", `${windKmH.toFixed(0)} km/h`);
  setText("mph", `${windMph.toFixed(0)} mph`);

  setText("time", formatted);

  setText("Precipitation", `${precipitation.toFixed(1)} ${precipitationUnit}`);
  setText("PrecipitationIn", `${precipitationIn.toFixed(2)} in`);

  // ==========================
  // Current Weather Icon
  // ==========================
  const icon = document.querySelector(".weather-icon");
  const code = data.current_weather.weathercode;
  const imgName = weatherImages[code] || "icon-sunny.webp";

  icon.src = `assets/images/${imgName}`;

  // ==========================
  // Render 7 Days
  // ==========================
  const dailyContainer = document.querySelector(".daily-container");
  dailyContainer.innerHTML = "";

  data.daily.time.forEach((day, i) => {
    const dateObj = new Date(day);

    const dayName = dateObj.toLocaleDateString("en-US", {
      weekday: "short"
    });

    const maxC = data.daily.temperature_2m_max[i];
    const minC = data.daily.temperature_2m_min[i];

    const maxF = (maxC * 9/5) + 32;
    const minF = (minC * 9/5) + 32;

    const code = data.daily.weathercode[i];
    const imgName = weatherImages[code] || "default.webp";

    const div = document.createElement("div");
    div.className = "daily-day";

    div.innerHTML = `
      <h3>${dayName}</h3>
      <img src="assets/images/${imgName}" alt="weather icon" />

      <div class="celsius">
        <p>${maxC.toFixed(0)}°</p>
        <p>${minC.toFixed(0)}°</p>
      </div>

      <div class="fahrenheit">
        <p>${maxF.toFixed(0)}°</p>
        <p>${minF.toFixed(0)}°</p>
      </div>
    `;

    dailyContainer.appendChild(div);
  });

  // ==========================
  // Start Hourly Dropdown System
  // ==========================
  startHourlySection(data);
}


// ==========================
// Fetch Weather
// ==========================
function showLoadingState() {
  document.body.classList.add("loading");
}

function hideLoadingState() {
  document.body.classList.remove("loading");
}

function fetchWeather(lat, lon) {
  showLoadingState();

  fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,precipitation,weathercode&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto`
  )
    .then(res => {
      if (!res.ok) throw new Error("Network response not ok");
      return res.json();
    })
    .then(data => {
      renderWeather(data);
      hideLoadingState();
    })
    .catch(err => {
      console.log("ERROR:", err);
      hideLoadingState();
    });
}


// ==========================
// Suggestions (4 cities)
// ==========================
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();

  if (!query) {
    suggestionsList.innerHTML = "";
    return;
  }

  fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=4`)
    .then(res => res.json())
    .then(data => {
      suggestionsList.innerHTML = "";

      if (!data.results) return;

      data.results.forEach(place => {
        const li = document.createElement("li");
        li.textContent = `${place.name}, ${place.country}`;

        li.addEventListener("click", () => {
          searchInput.value = place.name;
          suggestionsList.innerHTML = "";
          fetchWeather(place.latitude, place.longitude);
        });

        suggestionsList.appendChild(li);
      });
    });
});


// ==========================
// Search Button
// ==========================
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (!query) return;

  suggestionsList.innerHTML = "";

  fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=1`)
    .then(res => res.json())
    .then(data => {
      if (!data.results) return;

      const place = data.results[0];
      fetchWeather(place.latitude, place.longitude);
    });
});


// ==========================
// Enter Key Search
// ==========================
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});


// ==========================
// Default City
// ==========================
fetchWeather(31.95, 35.91);