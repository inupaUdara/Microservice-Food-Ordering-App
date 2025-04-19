import api from "../axiosInstance";

export const getAllRestaurants = async () => {
    const response = await api.get('/users/api/v1/users/restaurants?isApproved=true');
    return response.data.restaurants;
}

export const getRestaurantById = async (id: any) => {
    const response = await api.get(`/users/api/v1/restaurants/${id}`);
    return response.data.restaurant;
}
