import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object

interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object

class Weather {
  city: string;
  country: string;
  date: string;
  description: string;
  humidity: number;
  icon: string;
  temp: number;
  wind: number;
  constructor(
    city: string,
    country: string,
    date: string,
    description: string,
    humidity: number,
    icon: string,
    temp: number,
    wind: number
  ) {
    this.city = city;
    this.country = country;
    this.date = date;
    this.description = description;
    this.humidity = humidity;
    this.icon = icon;
    this.temp = temp;
    this.wind = wind;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string = process.env.BASE_URL || '';
  private apiKey: string = process.env.API_KEY || '';
  private cityName: string = '';
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const response = await fetch(query);
    return response.json();
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };
  }
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `${this.baseURL}/geocode/v1/json?q=${this.cityName}&key=${this.apiKey}`;
  }
  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { lat, lon } = coordinates;
    return `${this.baseURL}/weather/1.0/report.json?product=current&latitude=${lat}&longitude=${lon}&key=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    const query = this.buildWeatherQuery(coordinates);
    const response = await fetch(query);
    return response.json();
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const { city, country, date, description, humidity, icon, temp, wind } = response.data.current_condition[0];
    return new Weather(city, country, date, description, humidity, icon, temp, wind);
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const forecastArray = weatherData.map((day) => {
      const { date, description, icon, temp_max, temp_min } = day;
      return { date, description, icon, temp_max, temp_min };
    });
    return forecastArray;
  }
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastArray = this.buildForecastArray(currentWeather, weatherData.data.weather);
    return { currentWeather, forecastArray };
  }
}

export default new WeatherService();
