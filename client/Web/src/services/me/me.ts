import api from "../axiosInstance";

export const getMe = async () => {
    const response = await api.get('/users/api/v1/auth/me');
    return response.data.user;
}

export const updateMe = async (data: any) => {
    const response = await api.put('/users/api/v1/auth/profile', data);
    return response.data;
}
