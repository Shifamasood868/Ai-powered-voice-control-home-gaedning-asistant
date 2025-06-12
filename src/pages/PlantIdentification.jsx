import React, { useState, useRef } from 'react';
import { Camera, Upload, Leaf, Search, Star, Clock } from 'lucide-react';

const PlantIdentification = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setAnalyzing(true);
    
    try {
      // Convert base64 to blob for sending to API
      const blob = await fetch(selectedImage).then(r => r.blob());
      const formData = new FormData();
      formData.append('file', blob, 'plant.jpg');
      
      const response = await fetch('http://localhost:4000/api/analyze', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Analysis failed');
      }
      
      const data = await response.json();
      setResult({
        ...data.plant_info,
        original_image: data.original_image,
        result_image: data.result_image,
        confidence: Math.round(data.detections[0]?.confidence * 100)
      });
    } catch (error) {
      console.error('Error analyzing image:', error);
      alert('Error analyzing image. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const recentIdentifications = [
    {
      name: "Fiddle Leaf Fig",
      image: "https://images.pexels.com/photos/6208086/pexels-photo-6208086.jpeg",
      confidence: 94,
      time: "2 hours ago"
    },
    {
      name: "Snake Plant",
      image: "https://images.pexels.com/photos/8084205/pexels-photo-8084205.jpeg",
      confidence: 98,
      time: "5 hours ago"
    },
    {
      name: "Pothos",
      image: "https://images.pexels.com/photos/7194915/pexels-photo-7194915.jpeg",
      confidence: 92,
      time: "1 day ago"
    }
  ];

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-500 rounded-full">
              <Camera className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Plant Identification
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take a photo or upload an image of any plant, and our advanced AI will identify it 
            and provide detailed care instructions instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Upload Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Identify Your Plant
              </h2>

              {/* Image Upload/Display */}
              <div className="mb-6">
                {selectedImage ? (
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Selected plant"
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                    />
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-green-400 transition-colors">
                    <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      Upload a photo of your plant for identification
                    </p>
                    <p className="text-sm text-gray-500 mb-6">
                      Supports JPG, PNG, and HEIC formats
                    </p>
                  </div>
                )}
              </div>

              {/* Upload Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Upload className="h-5 w-5" />
                  <span>Upload from Gallery</span>
                </button>
                
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center justify-center space-x-2 border border-green-500 text-green-500 px-6 py-3 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <Camera className="h-5 w-5" />
                  <span>Take Photo</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {/* Analyze Button */}
              {selectedImage && (
                <button
                  onClick={analyzeImage}
                  disabled={analyzing}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {analyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5" />
                      <span>Identify Plant</span>
                    </>
                  )}
                </button>
              )}

              {/* Results */}
              {result && (
                <div className="mt-8 space-y-6">
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {result.name}
                      </h3>
                      <div className="flex items-center space-x-1 bg-green-100 px-3 py-1 rounded-full">
                        <Star className="h-4 w-4 text-green-600" />
                        <span className="text-green-600 font-semibold">{result.confidence}%</span>
                      </div>
                    </div>

                    
                     
                      <div>
                        <img 
                          src={result.result_image} 
                          alt="Analysis Result" 
                          className="w-full object-cover rounded-lg shadow"
                        />
                        <p className="text-center text-sm text-gray-500 mt-2">Analysis Result</p>
                      </div>
                    


                    {result.description && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                        <p className="text-gray-600 leading-relaxed">{result.description}</p>
                      </div>
                    )}

                    {result.tips && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Care Tips</h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          {result.tips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {result.toxicity && (
                      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <h4 className="font-semibold text-red-800 mb-2">⚠️ Safety Information</h4>
                        <p className="text-red-700">{result.toxicity}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Identifications */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Recent Identifications
              </h3>
              
              <div className="space-y-4">
                {recentIdentifications.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{item.confidence}% match</span>
                        <Clock className="h-3 w-3" />
                        <span>{item.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Pro Tips for Better Results
              </h3>
              
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 font-bold">•</span>
                  <span>Take photos in good natural lighting</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 font-bold">•</span>
                  <span>Focus on leaves, flowers, or distinctive features</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 font-bold">•</span>
                  <span>Avoid blurry or low-resolution images</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 font-bold">•</span>
                  <span>Include the whole plant when possible</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantIdentification;