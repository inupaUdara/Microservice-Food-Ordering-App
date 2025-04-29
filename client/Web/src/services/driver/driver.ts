import api from "../axiosInstance";

export const getAllDrivers = async () => {
    const response = await api.get('/users/api/v1/users/delivery-persons');
    return response.data.deliveryPersons;
}


export const updateDriverLocation = async (driverId: string, latitude: number, longitude: number) => {
  try {
    const response = await api.put(`/users/api/v1/drivers/update-location`, {
      driverId,
      latitude,
      longitude
    });
    return response.data;
  } catch (error) {
    console.error('Error updating driver location:', error);
    throw error;
  }
};

export const updateDriverAvailability = async (driverId: string, isAvailable: boolean) => {
    try {
      const response = await api.put(`/users/api/v1/drivers/update-status`, {
        driverId,
        isAvailable
      });
      return response.data;
    } catch (error) {
      console.error('Error updating driver status:', error);
      throw error;
    }
  };

export const assignDriverToDelivery = async (orderId: string, restaurantLocation:any,deliveryLocation:any) => {
    try {
        const response = await api.post(`/deliveries/api/v1/deliveries/assign`, {
            orderId,
            restaurantLocation,
            deliveryLocation
        });
        return response.data;
    } catch (error) {
        console.error('Error assigning driver to delivery:', error);
        throw error;
    }
}

