import api from "../axiosInstance";

export const getAllDrivers = async () => {
    const response = await api.get('/users/api/v1/users/delivery-persons');
    return response.data.deliveryPersons;
}
