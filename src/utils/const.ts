import clear from "../assets/background/clear.png";
import cloudy from "../assets/background/cloudy.png";
import drizzle from "../assets/background/drizzle.png";
import rain from "../assets/background/rain.png";
import snow from "../assets/background/snow.png";
import atmosphere from "../assets/background/atmosphere.png";
import thunderstorm from "../assets/background/thunderstorm.png";
import brokenIcon from "../assets/icons/broken.svg";
import clearDayIcon from "../assets/icons/clear-day.svg";
import clearNightIcon from "../assets/icons/clear-night.svg";
import fewIcon from "../assets/icons/few.svg";
import mistIcon from "../assets/icons/mist.svg";
import rainIcon from "../assets/icons/rain.svg";
import scatteredIcon from "../assets/icons/scattered.svg";
import showerIcon from "../assets/icons/shower.svg";
import snowIcon from "../assets/icons/snow.svg";
import thunderstormIcon from "../assets/icons/thunderstorm.svg";

export interface WeatherStructure {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  name: string;
  dt: number;
  sys: {
    sunrise: number;
    sunset: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
}

export type WeatherCondition =
  | "cloudy"
  | "clear"
  | "drizzle"
  | "rain"
  | "snow"
  | "atmosphere"
  | "thunderstorm";

export const backgroundImages: { [key in WeatherCondition]: string } = {
  cloudy: cloudy,
  clear: clear,
  drizzle: drizzle,
  rain: rain,
  snow: snow,
  atmosphere: atmosphere,
  thunderstorm: thunderstorm,
};

export type IconTypes =
  | "01d"
  | "01n"
  | "02d"
  | "02n"
  | "03d"
  | "03n"
  | "04d"
  | "04n"
  | "09d"
  | "09n"
  | "10d"
  | "10n"
  | "11d"
  | "11n"
  | "13d"
  | "13n"
  | "50d"
  | "50n";

export const Icons: { [key in IconTypes]: string } = {
  "01d": clearDayIcon,
  "01n": clearNightIcon,
  "02d": fewIcon,
  "02n": fewIcon,
  "03d": scatteredIcon,
  "03n": scatteredIcon,
  "04d": brokenIcon,
  "04n": brokenIcon,
  "09d": showerIcon,
  "09n": showerIcon,
  "10d": rainIcon,
  "10n": rainIcon,
  "11d": thunderstormIcon,
  "11n": thunderstormIcon,
  "13d": snowIcon,
  "13n": snowIcon,
  "50d": mistIcon,
  "50n": mistIcon,
};

export interface StationsStructure {
  name: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
}
