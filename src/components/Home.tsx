import { useEffect, useState } from "react";
import styles from "../styles/Weather.module.scss";
import {
  backgroundImages,
  StationsStructure,
  WeatherCondition,
  WeatherStructure,
} from "../utils/const.ts";
import WeatherContent from "./WeatherContent.tsx";

const API_KEY = import.meta.env.VITE_API_KEY;

function Home() {
  const [weatherData, setWeatherData] = useState({} as WeatherStructure);
  const [loading, setLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");

  const [selectedStation, setSelectedStation] = useState(
    {} as StationsStructure
  );
  const [locationError, setLocationError] = useState(true);

  // const [units, setUnits] = useState("imperial");
  const units = "imperial";

  useEffect(() => {
    const fetchData = async (lat: number, lon: number) => {
      setLoading(true);

      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?units=${units}&lat=${lat}&lon=${lon}&appid=${API_KEY}`;
        const response = await fetch(url);
        const data = await response.json();

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
        setLocationError(false);
        const { latitude, longitude } = position.coords;
        fetchData(latitude, longitude);
      });
    }

    if (locationError && Object.values(selectedStation)?.length) {
      fetchData(selectedStation.lat, selectedStation.lon);
    }
  }, [selectedStation, locationError]);

  const weatherCondition = weatherData?.weather?.[0]?.main as WeatherCondition;

  return (
    <>
      <img
        src={backgroundImages?.[weatherCondition] ?? backgroundImages.cloudy}
        alt={weatherCondition}
        className={styles.backgroundImage}
      />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <WeatherContent
          {...{
            weatherData,
            weatherError,
            setSelectedStation,
          }}
        />
      )}
    </>
  );
}

export default Home;
