import api from "../axiosInstance";

export const getAllUserOrders = async () => {
    const response = await api.get('/orders/api/v1/orders/my-orders');
    return response.data;
}

export const getOrderById = async (id: any) => {
    const response = await api.get(`/orders/api/v1/orders/${id}`);
    return response.data;
}

export const getOrderByRestaurantId = async (id: any) => {
    const response = await api.get(`/users/api/v1/restaurants/${id}/orders`);
    return response.data.orders;
}
