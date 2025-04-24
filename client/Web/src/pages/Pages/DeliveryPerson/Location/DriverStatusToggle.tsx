// src/components/DriverStatusToggle.tsx
import React, { useState, useEffect } from 'react';
import { updateDriverAvailability } from '../../../../services/driver/driver';


interface DriverStatusToggleProps {
  driverId: string;
  initialStatus: boolean;
  onStatusChange?: (newStatus: boolean) => void;
}

const DriverStatusToggle: React.FC<DriverStatusToggleProps> = ({
  driverId,
  initialStatus,
  onStatusChange,
}) => {
  const [isAvailable, setIsAvailable] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async () => {
    const newStatus = !isAvailable;
    setIsLoading(true);
    setError(null);

    try {
      await updateDriverAvailability(driverId, newStatus);
      setIsAvailable(newStatus);
      if (onStatusChange) {
        onStatusChange(newStatus);
      }
    } catch (err) {
      setError('Failed to update status. Please try again.');
      console.error('Status update error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start space-y-2">
      <div className="flex items-center">
        <span className="mr-2 text-sm font-medium text-gray-700">
          {isAvailable ? 'Available' : 'Unavailable'}
        </span>
        <button
          type="button"
          onClick={handleToggle}
          disabled={isLoading}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isAvailable ? 'bg-green-500' : 'bg-gray-200'
          } ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isAvailable ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {isLoading && (
        <p className="text-xs text-blue-600">Updating status...</p>
      )}

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

export default DriverStatusToggle;
