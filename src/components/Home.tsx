import { useEffect, useState } from "react";
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";
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

  // TODO: Make this a user setting
  const units = "imperial";

  const fetchData = async (lat: number, lon: number) => {
    setLoading(true);

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?units=${units}&lat=${lat}&lon=${lon}&appid=${API_KEY}`;
      const response = await fetch(url);
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

  // Try getting user's location the first time
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        fetchData(latitude, longitude);
      });
    }
  }, []);

  // If the user changes the station, fetch the new data
  useEffect(() => {
    if (Object.values(selectedStation)?.length) {
      fetchData(selectedStation.lat, selectedStation.lon);
    }
  }, [selectedStation]);

  const weatherCondition = weatherData?.weather?.[0]?.main as WeatherCondition;
  const isNight = !Object.values(weatherData).length
    ? false
    : weatherData.dt > weatherData.sys.sunset ||
      weatherData.dt < weatherData.sys.sunrise;

  return (
    <>
      <div className={styles.animal}>
        <Animal />
      </div>
      {isNight && <div className={styles.nightOverlay}></div>}
      <img
        src={
          backgroundImages?.[
            weatherCondition?.toLowerCase() as WeatherCondition
          ] ?? backgroundImages.clear
        }
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

export const Animal = () => {
  const { RiveComponent } = useRive({
    src: "lamb.riv",
    stateMachines: "State Machine 1",
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.Center,
    }),
    autoplay: true,
  });

  return <RiveComponent />;
};
