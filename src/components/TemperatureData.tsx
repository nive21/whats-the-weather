import {
  StationsStructure,
  WeatherCondition,
  WeatherStructure,
} from "../utils/const";
import LocationSelector from "./LocationSelector";
import styles from "../styles/Weather.module.scss";
export default function TemperatureData({
  main,
  name,
  weatherCondition,
  icon,
  weatherError,
  setSelectedStation,
}: {
  main: WeatherStructure["main"];
  name: WeatherStructure["name"];
  weatherCondition: WeatherCondition;
  icon: string;
  weatherError: string;
  setSelectedStation: (station: StationsStructure) => void;
}) {
  return (
    <div>
      <p className={styles.tempContainer}>
        {main?.temp ?? "--"}°F <img src={icon} alt={weatherCondition} />
      </p>
      in{"  "}
      <LocationSelector {...{ name, setSelectedStation }} />
      {weatherError && <p>{weatherError}</p>}
    </div>
  );
}
