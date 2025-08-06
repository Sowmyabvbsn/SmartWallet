// Weather service for location-based spending insights
export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  forecast: WeatherForecast[];
}

export interface WeatherForecast {
  date: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  precipitationChance: number;
}

export interface SpendingWeatherInsight {
  category: string;
  recommendation: string;
  reason: string;
  potentialSavings: number;
}

class WeatherService {
  private apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  async getCurrentWeather(city: string = 'New York'): Promise<WeatherData> {
    if (!this.apiKey) {
      return this.getMockWeatherData();
    }

    try {
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(`${this.baseUrl}/weather?q=${city}&appid=${this.apiKey}&units=metric`),
        fetch(`${this.baseUrl}/forecast?q=${city}&appid=${this.apiKey}&units=metric`)
      ]);

      if (currentResponse.ok && forecastResponse.ok) {
        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        return {
          location: currentData.name,
          temperature: Math.round(currentData.main.temp),
          condition: currentData.weather[0].main,
          humidity: currentData.main.humidity,
          windSpeed: currentData.wind.speed,
          icon: currentData.weather[0].icon,
          forecast: this.processForecastData(forecastData.list)
        };
      }
    } catch (error) {
      console.warn('Weather API failed, using mock data:', error);
    }

    return this.getMockWeatherData();
  }

  private processForecastData(forecastList: any[]): WeatherForecast[] {
    const dailyForecasts: { [key: string]: any } = {};
    
    forecastList.slice(0, 15).forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          date,
          high: item.main.temp_max,
          low: item.main.temp_min,
          condition: item.weather[0].main,
          icon: item.weather[0].icon,
          precipitationChance: item.pop * 100
        };
      } else {
        dailyForecasts[date].high = Math.max(dailyForecasts[date].high, item.main.temp_max);
        dailyForecasts[date].low = Math.min(dailyForecasts[date].low, item.main.temp_min);
      }
    });

    return Object.values(dailyForecasts).slice(0, 5).map((forecast: any) => ({
      ...forecast,
      high: Math.round(forecast.high),
      low: Math.round(forecast.low),
      precipitationChance: Math.round(forecast.precipitationChance)
    }));
  }

  private getMockWeatherData(): WeatherData {
    const conditions = ['Clear', 'Cloudy', 'Rain', 'Snow', 'Thunderstorm'];
    const icons = ['01d', '02d', '10d', '13d', '11d'];
    
    const randomCondition = Math.floor(Math.random() * conditions.length);
    
    return {
      location: 'New York',
      temperature: Math.round(Math.random() * 30 + 5), // 5-35°C
      condition: conditions[randomCondition],
      humidity: Math.round(Math.random() * 40 + 40), // 40-80%
      windSpeed: Math.round(Math.random() * 20 + 5), // 5-25 km/h
      icon: icons[randomCondition],
      forecast: Array.from({ length: 5 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        high: Math.round(Math.random() * 25 + 10),
        low: Math.round(Math.random() * 15 + 0),
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        icon: icons[Math.floor(Math.random() * icons.length)],
        precipitationChance: Math.round(Math.random() * 100)
      }))
    };
  }

  generateSpendingInsights(weather: WeatherData, userSpending: any[]): SpendingWeatherInsight[] {
    const insights: SpendingWeatherInsight[] = [];

    // Weather-based spending recommendations
    if (weather.condition === 'Rain' || weather.condition === 'Thunderstorm') {
      insights.push({
        category: 'Transportation',
        recommendation: 'Consider ride-sharing instead of walking',
        reason: `Rainy weather expected. Uber/taxi might be worth the cost to stay dry.`,
        potentialSavings: -15 // Negative means additional cost
      });

      insights.push({
        category: 'Entertainment',
        recommendation: 'Perfect weather for indoor activities',
        reason: 'Rainy day - great time for museums, movies, or indoor dining.',
        potentialSavings: 0
      });
    }

    if (weather.temperature > 25) {
      insights.push({
        category: 'Food & Dining',
        recommendation: 'Hot weather - consider cold drinks and ice cream',
        reason: `Temperature is ${weather.temperature}°C. Stay cool with refreshing treats.`,
        potentialSavings: -10
      });

      insights.push({
        category: 'Utilities',
        recommendation: 'AC usage may increase electricity costs',
        reason: 'Hot weather typically leads to higher cooling costs.',
        potentialSavings: -25
      });
    }

    if (weather.temperature < 5) {
      insights.push({
        category: 'Shopping',
        recommendation: 'Cold weather - check heating costs',
        reason: `Temperature is ${weather.temperature}°C. Heating bills may be higher.`,
        potentialSavings: -30
      });
    }

    if (weather.condition === 'Clear' && weather.temperature > 15 && weather.temperature < 25) {
      insights.push({
        category: 'Transportation',
        recommendation: 'Perfect weather for walking or cycling',
        reason: 'Beautiful weather - save money by walking instead of driving.',
        potentialSavings: 20
      });

      insights.push({
        category: 'Entertainment',
        recommendation: 'Great day for outdoor activities',
        reason: 'Perfect weather for free outdoor activities like parks and hiking.',
        potentialSavings: 50
      });
    }

    return insights;
  }

  getWeatherIcon(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }
}

export const weatherService = new WeatherService();