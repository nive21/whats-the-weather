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

interface StationsStructure {
  name: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
}

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
        src={backgroundImages?.[weatherCondition] ?? cloudy}
        alt={weatherCondition}
        className={styles.backgroundImage}
      />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <WeatherContent
          {...{
            weatherData,
            locationError,
            weatherError,
            selectedStation,
            setSelectedStation,
          }}
        />
      )}
    </>
  );
}

export default App;

function WeatherContent({
  weatherData,
  locationError,
  weatherError,
  selectedStation,
  setSelectedStation,
}: {
  weatherData: WeatherStructure;
  locationError: boolean;
  weatherError: string;
  selectedStation: StationsStructure;
  setSelectedStation: (station: StationsStructure) => void;
}) {
  const { main, name, weather } = weatherData;

  const weatherCondition = weather?.[0]?.main as WeatherCondition;
  const weatherDescription = weather?.[0]?.description;

  return (
    <div className={styles.weatherContent}>
      <TemperatureData
        {...{
          main,
          name,
          locationError,
          weatherError,
          selectedStation,
          setSelectedStation,
        }}
      />
      <WeatherMetrics {...{ main, weatherCondition, weatherDescription }} />
    </div>
  );
}

function TemperatureData({
  main,
  name,
  locationError,
  weatherError,
  selectedStation,
  setSelectedStation,
}: {
  main: WeatherStructure["main"];
  name: WeatherStructure["name"];
  locationError: boolean;
  weatherError: string;
  selectedStation: StationsStructure;
  setSelectedStation: (station: StationsStructure) => void;
}) {
  return (
    <div>
      <p className={styles.tempContainer}>{main?.temp ?? "--"}°F</p>
      in{" "}
      {!locationError ? (
        name
      ) : (
        <LocationSelector {...{ selectedStation, setSelectedStation }} />
      )}
      {weatherError && <p>{weatherError}</p>}
    </div>
  );
}

function LocationSelector({
  setSelectedStation,
}: {
  setSelectedStation: (station: StationsStructure) => void;
}) {
  const [enteredLocation, setEnteredLocation] = useState("");
  const [stations, setStations] = useState([] as StationsStructure[]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchStations = async (query = "") => {
    if (!query.trim()) {
      setStations([]);
      setShowDropdown(false);
      return;
    }

    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
    );

    const data = await response.json();
    setStations(data);
    setShowDropdown(true);
  };

  const handleStationSelect = (station: StationsStructure) => {
    setSelectedStation(station);
    setEnteredLocation(station.name);
    setShowDropdown(false);
  };

  return (
    <div className={styles.locationSelector}>
      <input
        type="text"
        placeholder="Search for a city..."
        onChange={(e) => {
          setEnteredLocation(e.target.value);
          fetchStations(e.target.value);
        }}
        onFocus={() => {
          if (stations.length > 0) setShowDropdown(true);
        }}
        onBlur={() => {
          // Delay hiding dropdown to allow click event on dropdown
          setTimeout(() => setShowDropdown(false), 150);
        }}
        value={enteredLocation}
        className={styles.locationInput}
      />
      {showDropdown && (
        <ul className={styles.dropdown}>
          {stations.length ? (
            stations.map((station) => (
              <li
                key={`${station.lat}-${station.lon}`}
                onClick={() => handleStationSelect(station)}
              >
                {station.name} {station.state && `(${station.state})`} -{" "}
                {station.country}
              </li>
            ))
          ) : (
            <li>No results found</li>
          )}
        </ul>
      )}
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
        {weatherCondition}{" "}
        {weatherDescription && (
          <span style={{ textTransform: "capitalize" }}>
            ({weatherDescription})
          </span>
        )}
      </p>
      <hr />
      <p>Feels like: {main.feels_like ?? "-"}°F</p>
      <p>Min: {main.temp_min ?? "-"}°F</p>
      <p>Max: {main.temp_max ?? "-"}°F</p>
      <hr />
      <p>Pressure: {main.pressure ?? "-"} hPa</p>
      <p>Humidity: {main.humidity ?? "-"}%</p>
    </div>
  );
}
