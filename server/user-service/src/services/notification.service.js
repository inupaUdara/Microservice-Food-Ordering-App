const axios = require("axios");
const { NOTIFICATION_SERVICE_URL } = require("../config/env");

const notificationServiceApi = axios.create({
  baseURL: NOTIFICATION_SERVICE_URL,
  timeout: 5000,
});

const confirmRegistration = async (
  customerEmail,
  customerPhone,
  userName
) => {
  try {
    const response = await notificationServiceApi.post("api/v1/notifications/register", {
      customerEmail,
      customerPhone,
      userName,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error calling notification service:",
      error?.response?.data || error.message
    );
    throw new Error("Failed to send order confirmation");
  }
};

module.exports = {
  confirmRegistration,
};
