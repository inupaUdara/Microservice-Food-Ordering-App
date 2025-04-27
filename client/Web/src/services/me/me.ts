import api from "../axiosInstance";

export const getMe = async () => {
    const response = await api.get('/users/api/v1/auth/me');
    return response.data.user;
}
