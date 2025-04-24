const Menu = require("../models/menu.model.js");
const mongoose = require("mongoose");

const createMenu = async (menuData) => {
  try {
    const menu = new Menu(menuData);
    return await menu.save();
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllMenus = async (restaurantId) => {
  try {
    const objectId = new mongoose.Types.ObjectId(restaurantId);
    const menus = await Menu.find({ restaurantId: objectId }).sort({
      createdAt: -1,
    });
    return menus;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getMenuById = async (restaurantId, menuId) => {
  try {
    const menu = await Menu.findOne({ _id: menuId, restaurantId });
    if (!menu) throw new Error("Menu not found");
    return menu;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateMenu = async (menuId, restaurantId, updateData) => {
  try {
    const allowedUpdates = [
      "name",
      "description",
      "category",
      "price",
      "image",
      "availability",
      "ingredients",
      "dietaryTags",
      "customizations",
      "preparationTime",
      "isVeg",
      "spicyLevel",
    ];

    const updates = Object.keys(updateData);
    const isValidUpdate = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidUpdate) throw new Error("Invalid updates!");

    const menu = await Menu.findOneAndUpdate(
      { _id: menuId, restaurantId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!menu) throw new Error("Menu not found");

    return menu;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteMenu = async (menuId, restaurantId) => {
  try {
    const menu = await Menu.findOneAndDelete({ _id: menuId, restaurantId });
    if (!menu) throw new Error("Menu not found");
    return menu;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getMenuByCategory = async (restaurantId, category) => {
  try {
    const menus = await Menu.find({ restaurantId, category });
    return menus;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllMenuDetailsByRestaurantId = async (restaurantId) => {
  try {
    const objectId = new mongoose.Types.ObjectId(restaurantId);
    const menus = await Menu.find({ restaurantId: objectId }).sort({
      createdAt: -1,
    });

    return menus;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createMenu,
  getAllMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
  getMenuByCategory,
  getAllMenuDetailsByRestaurantId,
};
