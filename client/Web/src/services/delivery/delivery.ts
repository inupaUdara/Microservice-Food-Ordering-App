import api from "../axiosInstance";

export const getDeliveryByDriverId = async (id: any) => {
    const response = await api.get(`/deliveries/api/v1/deliveries/driver/${id}`);
    return response.data;
}

export const getDeliveryByOrderId = async (id:any) => {
        const response = await api.get(`/deliveries/api/v1/deliveries/order/${id}`);
        return response.data;
}

export const updateDeliveryStatus = async (id: any, status: string, location?: any) => {
    const response = await api.patch(`/deliveries/api/v1/deliveries/${id}/status`, { status, location });
    return response.data;
}


