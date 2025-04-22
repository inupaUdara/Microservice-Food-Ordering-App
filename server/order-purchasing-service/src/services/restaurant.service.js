// utils/httpClient.js
const axios = require('axios');
const { USER_SERVICE_URL } = require('../config/env');

const restaurantServiceClient = axios.create({
  baseURL: USER_SERVICE_URL,
});


module.exports = {
  restaurantServiceClient
};