import React, { useState } from 'react';
import { Layout, MapPin, Calendar, Ruler, Thermometer, Droplets, Sun, Mic } from 'lucide-react';
import { useSpeechSynthesis } from 'react-speech-kit';

const GardenPlanning = () => {
  const [selectedPlan, setSelectedPlan] = useState('vegetable');
  const [gardenSize, setGardenSize] = useState('medium');
  const [climate, setClimate] = useState('temperate');
  const [location, setLocation] = useState('');
  const { speak } = useSpeechSynthesis();

  const gardenPlans = {
    vegetable: {
      title: "Vegetable Garden",
      description: "Fresh produce right from your backyard",
      image: "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=600",
      plants: ["Tomatoes", "Lettuce", "Carrots", "Peppers", "Herbs"]
    },
    flower: {
      title: "Flower Garden",
      description: "Beautiful blooms throughout the seasons",
      image: "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=600",
      plants: ["Roses", "Tulips", "Sunflowers", "Marigolds", "Lavender"]
    },
    herb: {
      title: "Herb Garden",
      description: "Culinary herbs for cooking enthusiasts",
      image: "https://images.pexels.com/photos/4750274/pexels-photo-4750274.jpeg?auto=compress&cs=tinysrgb&w=600",
      plants: ["Basil", "Oregano", "Thyme", "Rosemary", "Mint"]
    }
  };

  const recommendations = {
    small: {
      title: "Small Garden (4x4 ft)",
      plants: 4,
      spacing: "12-18 inches apart",
      maintenance: "Low",
      cost: "$50-100"
    },
    medium: {
      title: "Medium Garden (8x8 ft)",
      plants: 12,
      spacing: "18-24 inches apart",
      maintenance: "Medium",
      cost: "$150-300"
    },
    large: {
      title: "Large Garden (12x12 ft)",
      plants: 25,
      spacing: "24-36 inches apart",
      maintenance: "High",
      cost: "$300-600"
    }
  };

  // Optional: Fetch climate zone from OpenWeatherMap
  const fetchClimateZone = async () => {
    try {
      const apiKey = '99313a139f8c66887b5253db1bce4659'; // Replace with your OpenWeatherMap API key
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`);
      const data = await res.json();
      const temp = data.main.temp;
      if (temp > 30) setClimate('tropical');
      else if (temp < 10) setClimate('cold');
      else setClimate('temperate');
    } catch (error) {
      alert('Unable to fetch weather. Please check your location.');
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-purple-500 rounded-full">
              <Layout className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Garden Planning Assistant
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Design your perfect garden with AI-powered recommendations based on your space,
            climate, and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Planning Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Plan Your Garden</h2>

              {/* Garden Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Garden Type</label>
                <div className="space-y-2">
                  {Object.entries(gardenPlans).map(([key, plan]) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="radio"
                        name="gardenType"
                        value={key}
                        checked={selectedPlan === key}
                        onChange={(e) => setSelectedPlan(e.target.value)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                      />
                      <span className="ml-2 text-gray-700">{plan.title}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Garden Size */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Ruler className="inline h-4 w-4 mr-1" />
                  Garden Size
                </label>
                <select
                  value={gardenSize}
                  onChange={(e) => setGardenSize(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="small">Small (4x4 ft)</option>
                  <option value="medium">Medium (8x8 ft)</option>
                  <option value="large">Large (12x12 ft)</option>
                </select>
              </div>

              {/* Climate */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Thermometer className="inline h-4 w-4 mr-1" />
                  Climate Zone
                </label>
                <select
                  value={climate}
                  onChange={(e) => setClimate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="tropical">Tropical</option>
                  <option value="temperate">Temperate</option>
                  <option value="arid">Arid</option>
                  <option value="cold">Cold</option>
                </select>
              </div>

              {/* Location */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter city or zip"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                onClick={fetchClimateZone}
                className="mb-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
              >
                Detect Climate
              </button>

              <button
                onClick={() => speak({ text: `You selected ${gardenPlans[selectedPlan].title}` })}
                className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
              >
                <Mic className="h-4 w-4" /> Speak Plan
              </button>
            </div>
          </div>

          {/* Garden Plan Display */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selected Plan */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img
                src={gardenPlans[selectedPlan].image}
                alt={gardenPlans[selectedPlan].title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{gardenPlans[selectedPlan].title}</h3>
                <p className="text-gray-600 mb-4">{gardenPlans[selectedPlan].description}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {gardenPlans[selectedPlan].plants.map((plant, index) => (
                    <div key={index} className="bg-green-50 p-3 rounded-lg text-center">
                      <span className="text-green-700 font-medium">{plant}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Size Recommendations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Size Recommendations</h3>
              <div className="bg-purple-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-purple-900 mb-2">{recommendations[gardenSize].title}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div><span className="text-gray-600">Plants:</span><div className="font-semibold">{recommendations[gardenSize].plants}</div></div>
                  <div><span className="text-gray-600">Spacing:</span><div className="font-semibold">{recommendations[gardenSize].spacing}</div></div>
                  <div><span className="text-gray-600">Maintenance:</span><div className="font-semibold">{recommendations[gardenSize].maintenance}</div></div>
                  <div><span className="text-gray-600">Est. Cost:</span><div className="font-semibold">{recommendations[gardenSize].cost}</div></div>
                </div>
              </div>
            </div>

            {/* Growing Conditions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Optimal Growing Conditions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-yellow-50 rounded-lg"><Sun className="h-8 w-8 text-yellow-500 mx-auto mb-2" /><h4 className="font-semibold">Sunlight</h4><p className="text-sm text-gray-600">6-8 hours daily</p></div>
                <div className="text-center p-4 bg-blue-50 rounded-lg"><Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" /><h4 className="font-semibold">Watering</h4><p className="text-sm text-gray-600">1-2 times weekly</p></div>
                <div className="text-center p-4 bg-green-50 rounded-lg"><Thermometer className="h-8 w-8 text-green-500 mx-auto mb-2" /><h4 className="font-semibold">Temperature</h4><p className="text-sm text-gray-600">65-85°F optimal</p></div>
              </div>
            </div>

            {/* Planting Calendar */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                <Calendar className="inline h-5 w-5 mr-2" /> Planting Calendar
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Spring</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Start seeds indoors</li>
                    <li>• Plant cool-season crops</li>
                    <li>• Prepare soil</li>
                  </ul>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Summer</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Transplant warm-season crops</li>
                    <li>• Mulch to retain moisture</li>
                    <li>• Regular watering</li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Fall</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Plant garlic & onions</li>
                    <li>• Harvest mature crops</li>
                    <li>• Prepare compost</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Winter</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Plan next season</li>
                    <li>• Protect perennials</li>
                    <li>• Order seeds</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
};

export default GardenPlanning;
