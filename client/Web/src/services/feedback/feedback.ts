import api from '../axiosInstance';

export const getFeedbacksByRestaurantId = async (restaurantId: string) => {
    try {
        const response = await api.get(`/feedback-service/api/v1/feedback/restaurant/${restaurantId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        throw error;
    }
}
