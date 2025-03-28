const haversine = require('haversine-distance');

/**
 * Calculates estimated delivery time based on distance and vehicle speed.
 * @param {Array} pickupCoordinates - [longitude, latitude] of the restaurant.
 * @param {Array} deliveryCoordinates - [longitude, latitude] of the delivery location.
 * @param {String} vehicleType - Type of the driver's vehicle.
 * @returns {Number} - Estimated delivery time in minutes.
 */
function calculateEstimatedTime(pickupCoordinates, deliveryCoordinates, vehicleType) {
    // ✅ 1. Define average speeds (km/h) for different vehicles
    const vehicleSpeeds = {
        "bike": 20,  // 20 km/h (Average bike speed)
        "scooter": 30, // 30 km/h (Faster than a bike)
        "car": 40,  // 40 km/h (Average car speed in city traffic)
        "truck": 25 // 25 km/h (Slow for heavy vehicles)
    };

    // ✅ 2. Validate vehicleType and set default speed (Bike if unknown)
    const speed = vehicleSpeeds[vehicleType] || vehicleSpeeds["bike"];

    // ✅ 3. Calculate the distance between two points using Haversine formula
    const distanceMeters = haversine(
        { latitude: pickupCoordinates[1], longitude: pickupCoordinates[0] }, 
        { latitude: deliveryCoordinates[1], longitude: deliveryCoordinates[0] }
    );

    const distanceKm = distanceMeters / 1000; // Convert meters to kilometers

    // ✅ 4. Calculate estimated time (Time = Distance / Speed) and return in minutes
    const estimatedTimeMinutes = (distanceKm / speed) * 60;

    return Math.ceil(estimatedTimeMinutes); // Round up to nearest minute
}

module.exports = { calculateEstimatedTime };