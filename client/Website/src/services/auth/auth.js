import api from '../axiosInstance';

export const register = async (userData) => {
  const response = await api.post('/users/api/v1/auth/sign-up', userData);
  localStorage.setItem('token', response.data.token);
  return response.data.user;
};

export const login = async (credentials) => {
  const response = await api.post('/users/api/v1/auth/sign-in', credentials);
  localStorage.setItem('token', response.data.token);
  const user = response.data.user;
  localStorage.setItem('role', response.data.user.role);
  console.log('User:', user);
  return response.data.user;


};

// export const logout = () => {
//   localStorage.removeItem('token');
// };

export const getCurrentUser = async () => {
  const response = await api.get('/users/api/v1/auth/me');
  return response.data;
};