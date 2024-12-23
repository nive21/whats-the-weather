import { WeatherCondition, WeatherStructure } from "../utils/const";
import styles from "../styles/Weather.module.scss";
export default function WeatherMetrics({
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
