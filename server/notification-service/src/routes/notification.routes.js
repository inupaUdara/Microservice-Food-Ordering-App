const express = require("express");
const {
  confirmOrder,
  confirmRegistration,
  confirmOrderCompletion,
  cancelOrder,
  confirmRestaurantRegistration,
  resetPasswordToken,
  notifyOrderReceived,
} = require("../controllers/confirmation.controller");

const {
    saveNotification, getNotifications
  } = require('../controllers/notificationLog.controller');
  

const router = express.Router();

router.post("/confirm", confirmOrder);
router.post("/complete", confirmOrderCompletion);
router.post("/register", confirmRegistration);
router.post("/reset-password", resetPasswordToken);
router.post("/cancel", cancelOrder);
router.post("/register-restaurant", confirmRestaurantRegistration);
router.post("/order-received", notifyOrderReceived);


router.post('/log', saveNotification);         
router.get('/log', getNotifications);          
module.exports = router;
