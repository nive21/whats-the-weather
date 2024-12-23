import { useState } from "react";
import { StationsStructure } from "../utils/const";
import styles from "../styles/Weather.module.scss";
const API_KEY_2 = import.meta.env.VITE_CITIES_API_KEY;

export default function LocationSelector({
  name,
  setSelectedStation,
}: {
  name: string;
  setSelectedStation: (station: StationsStructure) => void;
}) {
  const [enteredLocation, setEnteredLocation] = useState(name);
  const [stations, setStations] = useState([] as StationsStructure[]);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchStations = async (query = "") => {
    if (!query.trim()) {
      setStations([]);
      setShowDropdown(false);
      return;
    }

    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY_2}`
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
        onFocus={(e) => {
          fetchStations(e.target.value);
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
