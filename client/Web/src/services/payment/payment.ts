import api from "../axiosInstance";

export const createPaymentIntent = async (amount: number, userId: string) => {
    try {
      const response = await api.post('payments-service/api/v1/payments/create-payment', {
        amount,
        userId
      });

      if (response.status !== 200 || !response.data.clientSecret) {
        throw new Error(response.data.message || 'Invalid response from server');
      }

      return response;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      throw new Error(message || 'Failed to create payment intent');
    }
  };
