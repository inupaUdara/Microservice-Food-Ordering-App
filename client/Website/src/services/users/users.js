import api from '../axiosInstance';

export const getAllUsers = async () => {
    const response = await api.get('/users/api/v1/users');
    return response.data.users;
}

export const getAllDeliveryPersons = async () => {
    const response = await api.get('/users/api/v1/users/delivery-persons');
    return response.data.deliveryPersons;
}

export const getAllRestaurants = async () => {
    const response = await api.get('/users/api/v1/users/restaurants?isApproved=true');
    return response.data.restaurants;
}

export const getRestaurantById = async (id) => {
    const response = await api.get(`/users/api/v1/restaurants/${id}`);
    return response.data.restaurant;
}