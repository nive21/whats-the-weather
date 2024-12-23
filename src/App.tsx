import { useEffect, useState } from "react";
import styles from "./App.module.scss";
import clear from "./assets/clear.png";
import cloudy from "./assets/cloudy.png";
import drizzle from "./assets/drizzle.png";
import rain from "./assets/rain.png";
import snow from "./assets/snow.png";
import atmosphere from "./assets/atmosphere.png";
import thunderstorm from "./assets/thunderstorm.png";

const API_KEY = import.meta.env.VITE_API_KEY;

interface WeatherStructure {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  name: string;
  weather: {
    main: string;
    description: string;
  }[];
}

const backgroundImages: { [key in WeatherCondition]: string } = {
  cloudy: cloudy,
  clear: clear,
  drizzle: drizzle,
  rain: rain,
  snow: snow,
  atmosphere: atmosphere,
  thunderstorm: thunderstorm,
};

type WeatherCondition =
  | "cloudy"
  | "clear"
  | "drizzle"
  | "rain"
  | "snow"
  | "atmosphere"
  | "thunderstorm";

function App() {
  const [weatherData, setWeatherData] = useState({} as WeatherStructure);
  const [loading, setLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");

  // const [units, setUnits] = useState("imperial");
  const units = "imperial";

  useEffect(() => {
    const fetchData = async (lat: number, lon: number) => {
      setLoading(true);

      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?units=${units}&lat=${lat}&lon=${lon}&appid=${API_KEY}`
        );

        const data = await response.json();
        console.log("data", data);

        if (!(data && data.main && data.name && data.weather)) {
          throw new Error("No data");
        }
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather data", error);
        setWeatherError("Error fetching weather data");
      } finally {
        setLoading(false);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        fetchData(latitude, longitude);
      });
    }
  }, [units]);

  const weatherCondition = weatherData?.weather?.[0]?.main as WeatherCondition;

  return (
    <>
      <img
        src={backgroundImages?.[weatherCondition] ?? cloudy}
        alt={weatherCondition}
        className={styles.backgroundImage}
      />
      {loading ? (
        <div>Loading...</div>
      ) : weatherError ? (
        <div>{weatherError}</div>
      ) : (
        <WeatherContent {...{ weatherData }} />
      )}
    </>
  );
}

export default App;

function WeatherContent({ weatherData = {} as WeatherStructure }) {
  const { main, name, weather } = weatherData;

  const weatherCondition = weather?.[0]?.main as WeatherCondition;
  const weatherDescription = weather?.[0]?.description;

  return (
    <div className={styles.weatherContent}>
      <TemperatureData {...{ main, name }} />
      <WeatherMetrics {...{ main, weatherCondition, weatherDescription }} />
    </div>
  );
}

function TemperatureData({
  main = {} as WeatherStructure["main"],
  name = "" as WeatherStructure["name"],
}) {
  return (
    <div>
      <p className={styles.tempContainer}>{main.temp}°F</p>
      in {name}
    </div>
  );
}

function WeatherMetrics({
  main = {} as WeatherStructure["main"],
  weatherCondition = "" as WeatherCondition,
  weatherDescription = "",
}) {
  return (
    <div className={styles.weatherMetrics}>
      <p>
        {weatherCondition} (
        <span style={{ textTransform: "capitalize" }}>
          {weatherDescription}
        </span>
        )
      </p>
      <hr />
      <p>Feels like: {main.feels_like}°F</p>
      <p>Min: {main.temp_min}°F</p>
      <p>Max: {main.temp_max}°F</p>
      <hr />
      <p>Pressure: {main.pressure} hPa</p>
      <p>Humidity: {main.humidity}%</p>
    </div>
  );
}
