import api from '../axiosInstance';

export const getAllRestaurants = async () => {
    const response = await api.get('/users/api/v1/users/restaurants?isApproved=true');
    return response.data.restaurants;
};

export const getUnapprovedRestaurants = async () => {
    const response = await api.get('/users/api/v1/users/restaurants?isApproved=false');
    return response.data.restaurants;
};

export const getRestaurantById = async (id: any) => {
    const response = await api.get(`/users/api/v1/restaurants/${id}`);
    return response.data.restaurant;
};

export const getAllMenuDetailsByRestaurantId = async (restaurantId: any) => {
    try {
        const response = await api.get(`/menu/api/v1/menu/restaurant/${restaurantId}`);
        console.log('API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error in getAllMenuItems:', error);
        throw error;
    }
};

export const createMenu = async (id: any, data: any) => {
    const response = await api.post('/menu/api/v1/menu', data, {});
    return response.data;
};

export const getAllMenuItems = async (p0: string) => {
    const response = await api.get('/menu/api/v1/menu/all-menu');
    return response.data;
};

export const approveRestaurant = async (id: any, isApproved: boolean) => {
    const response = await api.put(`/users/api/v1/restaurants/approve/${id}`, { isApproved });
    return response.data.restaurant;
};
