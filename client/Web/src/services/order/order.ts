import api from '../axiosInstance';

export const getAllUserOrders = async () => {
    const response = await api.get('/orders/api/v1/orders/my-orders');
    return response.data;
};

export const getOrderById = async (id: any) => {
    const response = await api.get(`/orders/api/v1/orders/${id}`);
    return response.data;
};

export const createOrder = async (data: any) => {
    const response = await api.post('/orders/api/v1/orders', data, {});
    return response.data;
};

export const getOrderByRestaurantId = async () => {
    const response = await api.get('/orders/api/v1/orders/restaurant');
    return response.data;
};

export const updateOrderStatus = async (orderId: any, status: any) => {
    console.log('Sending request to update status:', { orderId, status });
    const response = await api.patch(`/orders/api/v1/orders/${orderId}`, status, {});
    console.log('API response:', response);
    return response.data;
};

export const getOutForDeliveryStats = async () => {
    const response = await api.get('/orders/api/v1/orders/restaurant/stats/out-for-delivery');
    return response.data;
};

export const getItemsSoldByRestaurant = async () => {
    const response = await api.get('/orders/api/v1/orders/restaurant/items-sold-out-for-delivery');
    return response.data;
};
