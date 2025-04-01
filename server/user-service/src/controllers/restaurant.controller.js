const restaurantService = require("../services/restaurant.service.js");

const approveOfRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    if (typeof isApproved !== "boolean") {
      return res
        .status(400)
        .json({ success: false, message: "isApproved must be a boolean" });
    }

    const result = await restaurantService.approveRestaurant(id, isApproved);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getRestaurantById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const restaurant = await restaurantService.getRestaurantById(id);
    res.status(200).json({ success: true, restaurant });
  } catch (error) {
    next(error);
  }
}
module.exports = { approveOfRestaurant, getRestaurantById };
