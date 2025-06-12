import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye,
  AlertTriangle,
  Calendar,
  MapPin,
  Mic,
  Volume2
} from 'lucide-react';
import { useSpeechSynthesis, useSpeechRecognition } from 'react-speech-kit';

const WeatherUpdate = () => {
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState('London');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastSearchedLocation, setLastSearchedLocation] = useState('');

  // Speech hooks
  const { speak, cancel, speaking } = useSpeechSynthesis();
  const { listen, stop, listening } = useSpeechRecognition({
    onResult: (result) => {
      console.log("Speech Result:", result);
      setLocation(result);
    },
    onEnd: () => {
      console.log("Speech Ended. Location:", location);
      if (location.trim()) {
        fetchWeather(location);
      }
    },
  });

  // Fetch weather data from OpenWeatherMap API
  const fetchWeather = async (inputCity) => {
    if (!inputCity) return;
    if (inputCity.toLowerCase() === lastSearchedLocation.toLowerCase()) return;

    try {
      setLoading(true);
      setError('');
      setLastSearchedLocation(inputCity);

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${inputCity}&units=metric&appid=99313a139f8c66887b5253db1bce4659`
      );
      
      if (!response.ok) {
        throw new Error('City not found');
      }

      const data = await response.json();

      // Transform API data to match your component's structure
      const transformedData = {
        current: {
          temperature: Math.round(data.main.temp),
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed),
          visibility: (data.visibility / 1000).toFixed(1), // convert to km
          condition: data.weather[0].main,
          icon: mapWeatherIcon(data.weather[0].icon),
          pressure: data.main.pressure,
          feelsLike: Math.round(data.main.feels_like)
        },
        forecast: generateSampleForecast(data), // Using sample forecast for demo
        gardenAlerts: generateGardenAlerts(data)
      };

      setWeather(transformedData);
      setLoading(false);
      speakWeatherDetails(transformedData);
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // Helper function to generate sample forecast (since current API doesn't provide forecast)
  const generateSampleForecast = (currentData) => {
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'];
    const icons = ['sunny', 'partly-cloudy', 'cloudy', 'rainy'];
    
    return Array.from({ length: 5 }, (_, i) => ({
      day: ['Today', 'Tomorrow', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][i],
      high: Math.round(currentData.main.temp + (Math.random() * 5 - 2)),
      low: Math.round(currentData.main.temp - (Math.random() * 3 + 2)),
      condition: conditions[Math.floor(Math.random() * 4)],
      icon: icons[Math.floor(Math.random() * 4)],
      precipitation: Math.floor(Math.random() * 30) + (i === 2 ? 50 : 0)
    }));
  };

  // Helper function to generate garden alerts
  const generateGardenAlerts = (data) => {
    const alerts = [];
    const temp = data.main.temp;
    const humidity = data.main.humidity;
    const weatherMain = data.weather[0].main;
    
    // Rain alert
    if (weatherMain.toLowerCase().includes('rain')) {
      alerts.push({
        type: 'watering',
        message: 'Rain expected - reduce outdoor watering.',
        priority: 'medium'
      });
    }
    
    // Frost alert
    if (temp < 5) {
      alerts.push({
        type: 'frost',
        message: `Low temperatures (${Math.round(temp)}°C) - protect sensitive plants from frost.`,
        priority: 'high'
      });
    }
    
    // Heat alert
    if (temp > 30) {
      alerts.push({
        type: 'heat',
        message: `High temperatures (${Math.round(temp)}°C) - water plants early in the morning.`,
        priority: 'medium'
      });
    }
    
    // Humidity alert
    if (humidity > 80) {
      alerts.push({
        type: 'humidity',
        message: 'High humidity - watch for mold and fungal diseases.',
        priority: 'medium'
      });
    }
    
    return alerts.length > 0 ? alerts : [
      {
        type: 'all-clear',
        message: 'No significant weather alerts for your garden at this time.',
        priority: 'low'
      }
    ];
  };

  // Map OpenWeatherMap icons to your icon system
  const mapWeatherIcon = (owmIcon) => {
    if (owmIcon.includes('01')) return 'sunny';       // clear sky
    if (owmIcon.includes('02')) return 'partly-cloudy'; // few clouds
    if (owmIcon.includes('03') || owmIcon.includes('04')) return 'cloudy'; // scattered/broken clouds
    if (owmIcon.includes('09') || owmIcon.includes('10')) return 'rainy'; // rain
    if (owmIcon.includes('11')) return 'rainy';       // thunderstorm
    if (owmIcon.includes('13')) return 'rainy';       // snow
    if (owmIcon.includes('50')) return 'cloudy';      // mist/fog
    return 'sunny';
  };

  // Speak current weather conditions
  const speakWeatherDetails = (data) => {
    if (!data || speaking) return;
    
    const { current } = data;
    const message = `Current weather in ${location} is ${current.temperature} degrees Celsius, 
      with ${current.condition}. Humidity is ${current.humidity} percent, 
      and wind speed is ${current.windSpeed} meters per second.`;

    console.log("Speaking:", message);
    speak({ text: message });
  };

  // Speak 5-day forecast
  const speakForecast = () => {
    if (!weather?.forecast || speaking) return;
    
    let forecastMessage = `5-day forecast for ${location}: `;
    weather.forecast.forEach(day => {
      forecastMessage += ` ${day.day}, high of ${day.high} and low of ${day.low} degrees, 
        with ${day.condition}. `;
    });
    
    speak({ text: forecastMessage });
  };

  // Speak garden alerts
  const speakGardenAlerts = () => {
    if (!weather?.gardenAlerts || speaking) return;
    
    let alertsMessage = `Garden alerts: `;
    weather.gardenAlerts.forEach(alert => {
      alertsMessage += alert.message + '. ';
    });
    
    speak({ text: alertsMessage });
  };

  // Speak garden recommendations
  const speakGardenRecommendations = () => {
    if (speaking) return;
    
    const recommendations = [
      "Water indoor plants normally but reduce outdoor watering if rain is expected.",
      "Consider covering sensitive plants due to temperature fluctuations.",
      "Perfect weather for harvesting herbs and vegetables."
    ];
    
    const message = `Gardening recommendations: ${recommendations.join('. ')}`;
    speak({ text: message });
  };

  // Toggle voice input
  const handleVoiceInput = () => {
    if (listening) {
      stop();
    } else {
      console.log("Listening...");
      listen({ continuous: false });
    }
  };

  // Get weather icon component
  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="h-12 w-12 text-yellow-500" />;
      case 'partly-cloudy':
        return <Cloud className="h-12 w-12 text-gray-400" />;
      case 'cloudy':
        return <Cloud className="h-12 w-12 text-gray-500" />;
      case 'rainy':
        return <CloudRain className="h-12 w-12 text-blue-500" />;
      default:
        return <Sun className="h-12 w-12 text-yellow-500" />;
    }
  };

  // Garden recommendations data
  const gardenRecommendations = [
    {
      title: "Watering Schedule",
      description: weather?.current.condition.includes('Rain') 
        ? "Rain expected - reduce outdoor watering." 
        : "Normal watering recommended.",
      icon: <Droplets className="h-6 w-6 text-blue-500" />
    },
    {
      title: "Plant Protection",
      description: weather?.current.temperature < 10 
        ? "Protect sensitive plants from cold temperatures." 
        : "No special protection needed.",
      icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />
    },
    {
      title: "Harvesting",
      description: weather?.current.condition.includes('Rain') 
        ? "Harvest before the rain if possible." 
        : "Good conditions for harvesting.",
      icon: <Calendar className="h-6 w-6 text-green-500" />
    }
  ];

  // Initial data load
  useEffect(() => {
    fetchWeather(location);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-500 rounded-full">
              <Cloud className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Weather & Garden Insights
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get real-time weather updates with personalized gardening recommendations 
            to keep your plants thriving in any condition.
          </p>
        </div>

        {/* Location Search with Voice Input */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-4">
            <MapPin className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your location"
            />
            <button 
              onClick={handleVoiceInput}
              className={`p-2 rounded-md ${listening ? 'bg-red-500 animate-pulse' : 'bg-blue-500'} text-white`}
              title={listening ? "Stop listening" : "Voice input"}
            >
              <Mic className="h-5 w-5" />
            </button>
            <button 
              onClick={() => fetchWeather(location)}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Update
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Weather */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Current Weather</h2>
                  <p className="text-gray-600">{location}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => speakWeatherDetails(weather)}
                    className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                    title="Speak current weather"
                    disabled={speaking}
                  >
                    <Volume2 className={`h-5 w-5 ${speaking ? 'text-gray-400' : 'text-blue-500'}`} />
                  </button>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-gray-900">
                      {weather?.current.temperature}°C
                    </div>
                    <div className="text-gray-600">{weather?.current.condition}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Droplets className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Humidity</div>
                  <div className="font-semibold">{weather?.current.humidity}%</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Wind className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Wind Speed</div>
                  <div className="font-semibold">{weather?.current.windSpeed} m/s</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Eye className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Visibility</div>
                  <div className="font-semibold">{weather?.current.visibility} km</div>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Thermometer className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Feels Like</div>
                  <div className="font-semibold">{weather?.current.feelsLike}°C</div>
                </div>
              </div>
            </div>

            {/* 5-Day Forecast */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">5-Day Forecast</h3>
                <button 
                  onClick={speakForecast}
                  className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                  title="Speak forecast"
                  disabled={speaking}
                >
                  <Volume2 className={`h-5 w-5 ${speaking ? 'text-gray-400' : 'text-blue-500'}`} />
                </button>
              </div>
              
              <div className="space-y-4">
                {weather?.forecast.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      {getWeatherIcon(day.icon)}
                      <div>
                        <div className="font-semibold text-gray-900">{day.day}</div>
                        <div className="text-sm text-gray-600">{day.condition}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {day.high}° / {day.low}°
                      </div>
                      <div className="text-sm text-blue-600">
                        {day.precipitation}% rain
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Garden Alerts */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Garden Alerts</h3>
                <button 
                  onClick={speakGardenAlerts}
                  className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                  title="Speak alerts"
                  disabled={speaking}
                >
                  <Volume2 className={`h-5 w-5 ${speaking ? 'text-gray-400' : 'text-blue-500'}`} />
                </button>
              </div>
              
              <div className="space-y-4">
                {weather?.gardenAlerts.map((alert, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.priority === 'high' 
                        ? 'bg-red-50 border-red-500' 
                        : alert.priority === 'medium'
                        ? 'bg-yellow-50 border-yellow-500'
                        : 'bg-green-50 border-green-500'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                        alert.priority === 'high' ? 'text-red-500' : 
                        alert.priority === 'medium' ? 'text-yellow-500' : 'text-green-500'
                      }`} />
                      <p className="text-sm text-gray-700">{alert.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Garden Recommendations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Garden Recommendations</h3>
                <button 
                  onClick={speakGardenRecommendations}
                  className="p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                  title="Speak recommendations"
                  disabled={speaking}
                >
                  <Volume2 className={`h-5 w-5 ${speaking ? 'text-gray-400' : 'text-blue-500'}`} />
                </button>
              </div>
              
              <div className="space-y-4">
                {gardenRecommendations.map((rec, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {rec.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {rec.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {rec.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weather History */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Weather Summary
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Condition:</span>
                  <span className="font-semibold">{weather?.current.condition}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Feels Like:</span>
                  <span className="font-semibold">{weather?.current.feelsLike}°C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pressure:</span>
                  <span className="font-semibold">{weather?.current.pressure} hPa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-semibold">Just now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherUpdate;