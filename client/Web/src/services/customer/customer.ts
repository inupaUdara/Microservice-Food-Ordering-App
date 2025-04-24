import api from "../axiosInstance";

export const getAllCustomers = async () => {
    const response = await api.get('/users/api/v1/users/customers');
    return response.data.customers;
}
