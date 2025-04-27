import api from '../axiosInstance';

interface Coordinates {
    lat: number;
    lng: number;
}

export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number }> => {
    {
        try {
            // For demo purposes, we'll use a mock response if no API key is available
            if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
                console.warn('No API key found, using mock geocoding data');
                // Return mock coordinates (these could be random or fixed values)
                return mockGeocode(address);
            }

            const response = await api('/orders/api/v1/orders/geocode', {
                params: {
                    address,
                },
            });

            if (response.data.status === 'OK') {
                const { lat, lng } = response.data.results[0].geometry.location;
                return { lat, lng };
            } else {
                console.error('Geocoding error:', response.data.status);
                throw new Error(`Address geocoding failed: ${response.data.status}`);
            }
        } catch (error) {
            console.error('Geocoding service error:', error);
            throw new Error('Could not convert address to coordinates');
        }
    }
};

/**
 * Calculates distance between two points using the Haversine formula
 * (Great-circle distance between two points on a sphere)
 */
export const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    // Earth's radius in kilometers
    const R = 6371;

    // Convert degrees to radians
    const toRad = (value: number) => (value * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers

    return distance;
};

/**
 * Calculates delivery fee based on distance
 */
export const calculateFee = (distanceKm: number): number => {
    if (distanceKm < 1) return 5; // Under 1km
    if (distanceKm < 5) return 8; // 1-5km
    if (distanceKm < 10) return 12; // 5-10km
    return 15; // Over 10km
};

const mockGeocode = (address: string): Coordinates => {
    // Generate deterministic but different coordinates based on the address string
    // This is only for demonstration and testing purposes
    let hash = 0;
    for (let i = 0; i < address.length; i++) {
        hash = (hash << 5) - hash + address.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }

    // Use the hash to generate coordinates within a reasonable range
    // Centered around (0, 0) with small variations
    const lat = (hash % 1000) / 10000;
    const lng = ((hash >> 10) % 1000) / 10000;

    return { lat, lng };
};
