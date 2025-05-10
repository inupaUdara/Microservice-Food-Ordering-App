import api from "../axiosInstance";

export const getAllStats = async () => {
    const response = await api.get('/users/api/v1/users/stats');
    return response.data;
}

export const getOrderStats = async () => {
    const response = await api.get('/orders/api/v1/orders/stats');
    return response.data;
}
