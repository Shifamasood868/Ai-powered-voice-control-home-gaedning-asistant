import React, { useState, useEffect } from 'react';
import { Calendar, Bell, Plus, Droplets, Sun, Scissors, Leaf, Mail } from 'lucide-react';

const PlantCareReminder = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const [newPlant, setNewPlant] = useState({
    name: '',
    location: '',
    wateringFrequency: 7,
    imageUrl: '',
    imageFile: null,
    notifications: false,
    userEmail: ''
  });

  const API_URL = 'http://localhost:5000/api/plantreminder';

  useEffect(() => {
    fetchPlants();
  }, []);

  const fetchPlants = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      if (data.success) {
        setPlants(data.data);
      }
    } catch (err) {
      console.error('Error fetching plants:', err);
    } finally {
      setLoading(false);
    }
  };

  const getDaysUntilWatering = (nextWatering) => {
    const next = new Date(nextWatering);
    const now = new Date();
    const diffTime = next - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleWaterPlant = async (plantId) => {
    try {
      const response = await fetch(`${API_URL}/${plantId}/water`, {
        method: 'PUT'
      });
      const data = await response.json();
      if (data.success) {
        setPlants(plants.map(plant => 
          plant._id === plantId ? data.data : plant
        ));
      }
    } catch (err) {
      console.error('Error watering plant:', err);
    }
  };

  const addNewPlant = async () => {
    const formData = new FormData();
    formData.append('name', newPlant.name);
    formData.append('location', newPlant.location);
    formData.append('wateringFrequency', newPlant.wateringFrequency);
    formData.append('notifications', notificationsEnabled);
    formData.append('userEmail', userEmail);
    
    if (newPlant.imageFile) {
      formData.append('image', newPlant.imageFile);
    } else if (newPlant.imageUrl) {
      formData.append('imageUrl', newPlant.imageUrl);
    } else {
      alert('Please provide either an image file or URL');
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      if (data.success) {
        setPlants([...plants, data.data]);
        setNewPlant({ 
          name: '', 
          location: '', 
          wateringFrequency: 7, 
          imageUrl: '',
          imageFile: null,
          notifications: false
        });
        setUserEmail('');
        setNotificationsEnabled(false);
        setShowAddForm(false);
      }
    } catch (err) {
      console.error('Error adding plant:', err);
    }
  };

  const deletePlant = async (plantId) => {
    if (!window.confirm('Are you sure you want to delete this plant?')) return;
    
    try {
      const response = await fetch(`${API_URL}/${plantId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        setPlants(plants.filter(plant => plant._id !== plantId));
      }
    } catch (err) {
      console.error('Error deleting plant:', err);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewPlant({
        ...newPlant,
        imageFile: e.target.files[0],
        imageUrl: ''
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-500 rounded-full">
              <Leaf className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Plant Care Reminders
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Never forget to water your plants again. Set up personalized care schedules 
            and get timely reminders for all your green friends.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{plants.length}</div>
            <div className="text-gray-600">Total Plants</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-red-500 mb-2">
              {plants.filter(p => getDaysUntilWatering(p.nextWatering) <= 0).length}
            </div>
            <div className="text-gray-600">Need Water Today</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-yellow-500 mb-2">
              {plants.filter(p => getDaysUntilWatering(p.nextWatering) === 1).length}
            </div>
            <div className="text-gray-600">Due Tomorrow</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">
              {plants.filter(p => p.notifications).length}
            </div>
            <div className="text-gray-600">Active Reminders</div>
          </div>
        </div>

        {/* Add Plant Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors shadow-lg"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Plant</span>
          </button>
        </div>

        {/* Add Plant Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Plant</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plant Name
                </label>
                <input
                  type="text"
                  value={newPlant.name}
                  onChange={(e) => setNewPlant({...newPlant, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Monstera Deliciosa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={newPlant.location}
                  onChange={(e) => setNewPlant({...newPlant, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Living Room"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Watering Frequency (days)
                </label>
                <select
                  value={newPlant.wateringFrequency}
                  onChange={(e) => setNewPlant({...newPlant, wateringFrequency: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value={3}>Every 3 days</option>
                  <option value={7}>Every week</option>
                  <option value={10}>Every 10 days</option>
                  <option value={14}>Every 2 weeks</option>
                  <option value={30}>Every month</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plant Image
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                    {newPlant.imageFile && (
                      <p className="text-xs text-gray-500 mt-1">
                        Selected: {newPlant.imageFile.name}
                      </p>
                    )}
                  </div>
                  <div className="text-gray-500 text-sm">OR</div>
                  <div className="flex-1">
                    <input
                      type="url"
                      value={newPlant.imageUrl}
                      onChange={(e) => setNewPlant({
                        ...newPlant,
                        imageUrl: e.target.value,
                        imageFile: null
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Image URL"
                    />
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Notifications
                </label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={notificationsEnabled}
                      onChange={(e) => setNotificationsEnabled(e.target.checked)}
                      className="form-checkbox h-5 w-5 text-green-500 rounded"
                    />
                    <span className="ml-2 text-gray-700">Enable email reminders</span>
                  </label>
                </div>
              </div>

              {notificationsEnabled && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="your@email.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    We'll send reminders when your plants need care
                  </p>
                </div>
              )}
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={addNewPlant}
                disabled={!newPlant.name || !newPlant.location || (!newPlant.imageUrl && !newPlant.imageFile)}
                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                Add Plant
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewPlant({ 
                    name: '', 
                    location: '', 
                    wateringFrequency: 7, 
                    imageUrl: '',
                    imageFile: null,
                    notifications: false
                  });
                  setUserEmail('');
                  setNotificationsEnabled(false);
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Plants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plants.map((plant) => {
            const daysUntil = getDaysUntilWatering(plant.nextWatering);
            const isOverdue = daysUntil < 0;
            const isDueToday = daysUntil === 0;
            const isDueTomorrow = daysUntil === 1;

            return (
              <div key={plant._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src={plant.imageUrl.startsWith('/uploads/') 
                      ? `http://localhost:5000${plant.imageUrl}`
                      : plant.imageUrl}
                    alt={plant.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.pexels.com/photos/6208086/pexels-photo-6208086.jpeg?auto=compress&cs=tinysrgb&w=300';
                    }}
                  />
                  {(isOverdue || isDueToday) && (
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
                      isOverdue ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white'
                    }`}>
                      {isOverdue ? 'OVERDUE' : 'DUE TODAY'}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{plant.name}</h3>
                    <div className="flex space-x-2">
                      {plant.notifications && plant.userEmail && (
                        <Mail className="h-5 w-5 text-blue-500" title={`Notifications sent to ${plant.userEmail}`} />
                      )}
                      <button 
                        onClick={() => deletePlant(plant._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">{plant.location}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Next Watering:</span>
                      <span className={`text-sm font-medium ${
                        isOverdue ? 'text-red-600' : 
                        isDueToday ? 'text-yellow-600' : 
                        isDueTomorrow ? 'text-orange-600' : 
                        'text-green-600'
                      }`}>
                        {isOverdue ? `${Math.abs(daysUntil)} days overdue` :
                         isDueToday ? 'Today' :
                         isDueTomorrow ? 'Tomorrow' :
                         `In ${daysUntil} days`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Watered:</span>
                      <span className="text-sm text-gray-800">
                        {new Date(plant.lastWatered).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center p-2 bg-blue-50 rounded-lg">
                      <Droplets className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                      <span className="text-xs text-gray-600">{plant.careSchedule.watering}</span>
                    </div>
                    <div className="text-center p-2 bg-yellow-50 rounded-lg">
                      <Sun className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
                      <span className="text-xs text-gray-600">{plant.careSchedule.fertilizing}</span>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <Scissors className="h-5 w-5 text-green-500 mx-auto mb-1" />
                      <span className="text-xs text-gray-600">{plant.careSchedule.pruning}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleWaterPlant(plant._id)}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Droplets className="h-4 w-4" />
                    <span>Mark as Watered</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {plants.length === 0 && !loading && (
          <div className="text-center py-12">
            <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No plants added yet
            </h3>
            <p className="text-gray-600 mb-6">
              Add your first plant to start receiving care reminders
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
            >
              Add Your First Plant
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantCareReminder;