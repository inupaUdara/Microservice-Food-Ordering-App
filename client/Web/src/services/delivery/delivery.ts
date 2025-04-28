import api from "../axiosInstance";

export const getDeliveryByDriverId = async (id: any) => {
    const response = await api.get(`/deliveries/api/v1/deliveries/driver/${id}`);
    return response.data;
}
