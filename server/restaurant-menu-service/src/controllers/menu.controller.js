const menuService = require("../services/menu.service");

const createMenu = async (req, res) => {
  try {
    const restaurantId = req.user.restaurantId;
    const menuData = { ...req.body, restaurantId };
    const menu = await menuService.createMenu(menuData);
    res.status(201).json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllMenus = async (req, res) => {
  try {
    const restaurantId = req.user.restaurantId;
    const menus = await menuService.getAllMenus(restaurantId);
    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMenuById = async (req, res) => {
  try {
    const restaurantId = req.user.restaurantId;
    const menu = await menuService.getMenuById(restaurantId, req.params.menuId);
    if (!menu) return res.status(404).json({ error: "Menu not found" });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMenu = async (req, res) => {
  try {
    const restaurantId = req.user.restaurantId;
    const menu = await menuService.updateMenu(
      req.params.menuId,
      restaurantId,
      req.body
    );
    if (!menu) return res.status(404).json({ error: "Menu not found" });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteMenu = async (req, res) => {
  try {
    const restaurantId = req.user.restaurantId;
    const menu = await menuService.deleteMenu(req.params.menuId, restaurantId);
    if (!menu) return res.status(404).json({ error: "Menu not found" });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMenuByCategory = async (req, res) => {
  try {
    const restaurantId = req.user.restaurantId;
    const menus = await menuService.getMenuByCategory(
      restaurantId,
      req.params.category
    );
    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllMenuDetailsByRestaurantId = async (req, res) => {
  try {
    const restaurantId = req.user.restaurantId;
    const menus = await menuService.getAllMenuDetailsByRestaurantId(
      restaurantId
    );
    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
