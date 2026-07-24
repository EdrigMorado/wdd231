const currentWeather = document.querySelector("#currentWeather");
const forecastContainer = document.querySelector("#forecast");

const API_KEY = "9c05c022e1bc7f85d6771d8e7627fa5e";

const latitude = 19.4326;
const longitude = -99.1332;
const units = "metric";

const WEATHER_URL =
  `https://api.openweathermap.org/data/2.5/weather` +
  `?lat=${latitude}` +
  `&lon=${longitude}` +
  `&units=${units}` +
  `&appid=${API_KEY}`;

const FORECAST_URL =
  `https://api.openweathermap.org/data/2.5/forecast` +
  `?lat=${latitude}` +
  `&lon=${longitude}` +
  `&units=${units}` +
  `&appid=${API_KEY}`;

function capitalizeWords(text) {
  return text
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function displayCurrentWeather(data) {
  const temperature = Math.round(data.main.temp);
  const description = capitalizeWords(
    data.weather[0].description
  );

  currentWeather.innerHTML = `
    <p class="current-temperature">
      ${temperature}&deg;C
    </p>

    <div>
      <p class="weather-description">
        ${description}
      </p>

      <p class="weather-location">
        Mexico City, Mexico
      </p>
    </div>
  `;
}

function getThreeDayForecast(forecastData) {
  const timezoneOffset = forecastData.city.timezone;
  const forecastsByDate = new Map();

  forecastData.list.forEach((forecast) => {
    const localDate = new Date(
      (forecast.dt + timezoneOffset) * 1000
    );

    const dateKey = localDate
      .toISOString()
      .split("T")[0];

    const localHour = localDate.getUTCHours();
    const distanceFromNoon = Math.abs(localHour - 12);

    const savedForecast = forecastsByDate.get(dateKey);

    if (
      !savedForecast ||
      distanceFromNoon < savedForecast.distanceFromNoon
    ) {
      forecastsByDate.set(dateKey, {
        forecast,
        localDate,
        distanceFromNoon
      });
    }
  });

  const currentLocalDate = new Date(
    Date.now() + timezoneOffset * 1000
  )
    .toISOString()
    .split("T")[0];

  return Array.from(forecastsByDate.entries())
    .filter(([dateKey]) => {
      return dateKey > currentLocalDate;
    })
    .slice(0, 3)
    .map(([, value]) => {
      return value;
    });
}

function displayForecast(forecastData) {
  const threeDayForecast =
    getThreeDayForecast(forecastData);

  forecastContainer.innerHTML = "";

  threeDayForecast.forEach(({ forecast, localDate }) => {
    const forecastCard =
      document.createElement("article");

    forecastCard.classList.add("forecast-card");

    const dayLabel = new Intl.DateTimeFormat(
      "en-US",
      {
        weekday: "long",
        month: "short",
        day: "numeric",
        timeZone: "UTC"
      }
    ).format(localDate);

    const temperature = Math.round(
      forecast.main.temp
    );

    const description = capitalizeWords(
      forecast.weather[0].description
    );

    forecastCard.innerHTML = `
      <h4>${dayLabel}</h4>

      <p class="forecast-temperature">
        ${temperature}&deg;C
      </p>

      <p>${description}</p>
    `;

    forecastContainer.appendChild(forecastCard);
  });
}

async function getWeather() {
  if (!currentWeather || !forecastContainer) {
    console.error(
      "The current weather or forecast container is missing."
    );
    return;
  }

  if (
    !API_KEY ||
    API_KEY === "PASTE_YOUR_API_KEY_HERE"
  ) {
    currentWeather.innerHTML = `
      <p class="weather-error">
        Add your OpenWeather API key in
        <strong>scripts/weather.js</strong>.
      </p>
    `;

    forecastContainer.innerHTML = `
      <p class="weather-error">
        The forecast cannot load without an API key.
      </p>
    `;

    return;
  }

  try {
    const currentResponse = await fetch(WEATHER_URL);

    if (!currentResponse.ok) {
      const errorData = await currentResponse.json();

      throw new Error(
        `Current weather error ${currentResponse.status}: ` +
        `${errorData.message}`
      );
    }

    const forecastResponse = await fetch(FORECAST_URL);

    if (!forecastResponse.ok) {
      const errorData = await forecastResponse.json();

      throw new Error(
        `Forecast error ${forecastResponse.status}: ` +
        `${errorData.message}`
      );
    }

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    displayCurrentWeather(currentData);
    displayForecast(forecastData);
  } catch (error) {
    currentWeather.innerHTML = `
      <p class="weather-error">
        Weather information is temporarily unavailable.
      </p>
    `;

    forecastContainer.innerHTML = `
      <p class="weather-error">
        The three-day forecast could not be loaded.
      </p>
    `;

    console.error("OpenWeather error:", error);
  }
}

getWeather();