import api from "../axiosInstance";
import axiosInstanceNoToken from "../axiosInstanceNoToken";

export const getMe = async () => {
    const response = await api.get('/users/api/v1/auth/me');
    return response.data.user;
}

export const updateMe = async (data: any) => {
    const response = await api.put('/users/api/v1/auth/profile', data);
    return response.data;
}

export const forgetPassword = async (data: any) => {
    const response = await axiosInstanceNoToken.post('/users/api/v1/auth/forgot-password', data);
    return response.data;
}

export const resetPassword = async (data: any) => {
    const response = await axiosInstanceNoToken.post('/users/api/v1/auth/reset-password', data);
    return response.data;
}
