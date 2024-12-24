import {
  Icons,
  IconTypes,
  StationsStructure,
  WeatherCondition,
  WeatherStructure,
} from "../utils/const";
import TemperatureData from "./TemperatureData";
import WeatherMetrics from "./WeatherMetrics";
import styles from "../styles/Weather.module.scss";
import { getTimeString } from "../utils/helpers";

export default function WeatherContent({
  weatherData,
  weatherError,
  setSelectedStation,
}: {
  weatherData: WeatherStructure;
  weatherError: string;
  setSelectedStation: (station: StationsStructure) => void;
}) {
  const { main, name, weather, dt, timezone } = weatherData;

  const timeString = Object.values(weatherData)?.length
    ? getTimeString(dt, timezone)
    : "";

  const weatherCondition = weather?.[0]?.main as WeatherCondition;
  const weatherDescription = weather?.[0]?.description;
  const icon = Icons[weather?.[0]?.icon as IconTypes];

  return (
    <div className={styles.weatherContent}>
      <TemperatureData
        {...{
          main,
          name,
          timeString,
          weatherCondition,
          icon,
          weatherError,
          setSelectedStation,
        }}
      />
      <WeatherMetrics {...{ main, weatherCondition, weatherDescription }} />
    </div>
  );
}
