import api from "../axiosInstance";

export const createPaymentIntent = async (amount: number, userId: string, p0: { name: string; email: string; phone: string; shippingAddress: { street: string; city: string; state: string; zipCode: string; country: string; }; }) => {
  try {
      const response = await api.post('payments-service/api/v1/payments/create-payment', {
          amount,
          userId,
          name: p0.name, // Pass the full name here
          email: p0.email,
          phone: p0.phone,
          shippingAddress: p0.shippingAddress, 
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
