// src/components/DriverLocationUpdater.tsx
import React, { useState, useEffect } from 'react';
import { updateDriverLocation } from '../../../../services/driver/driver';


interface Location {
  latitude: number;
  longitude: number;
}

interface DriverLocationUpdaterProps {
  driverId: string;
  updateInterval?: number; // in milliseconds
}

const DriverLocationUpdater = ({
  driverId,
  updateInterval = 30000, // Default to 30 seconds
}: DriverLocationUpdaterProps) => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);

  // Get current location
  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(newLocation);
        setError(null);
      },
      (err) => {
        setError(`Unable to retrieve your location: ${err.message}`);
      },
      { enableHighAccuracy: true }
    );
  };

  // Update location to server
  const updateLocationToServer = async (lat: number, lng: number) => {
    try {
      await updateDriverLocation(driverId, lat, lng);
      console.log('Location updated successfully');
    } catch (err) {
      console.error('Failed to update location:', err);
    }
  };

  // Initial location fetch and interval setup
  useEffect(() => {
    if (!isActive) return;

    getLocation();

    const intervalId = setInterval(() => {
      getLocation();
    }, updateInterval);

    return () => clearInterval(intervalId);
  }, [isActive, updateInterval]);

  // Update to server whenever location changes
  useEffect(() => {
    if (location && isActive) {
      updateLocationToServer(location.latitude, location.longitude);
    }
  }, [location, isActive]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Location Tracking</h2>
        <button
          onClick={() => setIsActive(!isActive)}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            isActive
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {isActive ? 'Stop Tracking' : 'Start Tracking'}
        </button>
      </div>

      {location ? (
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">Latitude:</span> {location.latitude.toFixed(6)}
          </p>
          <p className="text-sm">
            <span className="font-medium">Longitude:</span> {location.longitude.toFixed(6)}
          </p>
          <p className="text-sm text-green-600">
            {isActive ? 'Location is being updated periodically' : 'Location tracking is paused'}
          </p>
        </div>
      ) : (
        <p className="text-sm text-gray-500">Acquiring location...</p>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default DriverLocationUpdater;
