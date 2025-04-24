import api from '../axiosInstance';

export const getAllRestaurants = async () => {
    const response = await api.get('/users/api/v1/users/restaurants?isApproved=true');
    return response.data.restaurants;
};

export const getRestaurantById = async (id: any) => {
    const response = await api.get(`/users/api/v1/restaurants/${id}`);
    return response.data.restaurant;
};

export const createMenu = async (id: any, data: any) => {
    const response = await api.post('/menu/api/v1/menu', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getAllMenuItems = async () => {
    const response = await api.get('/menu/api/v1/menu/all-menu');
    return response.data;
};
