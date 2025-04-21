const menuService = require("../services/menu.service");

const createMenu = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("User ID:", userId);
    const menuData = { ...req.body, userId };
    const menu = await menuService.createMenu(menuData);
    res.status(201).json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllMenus = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("req.user:", req.user);
    const menus = await menuService.getAllMenus(userId);
    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMenuById = async (req, res) => {
  try {
    const userId = req.user.id;
    const menu = await menuService.getMenuById(userId, req.params.menuId);
    if (!menu) return res.status(404).json({ error: "Menu not found" });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMenu = async (req, res) => {
  try {
    const userId = req.user.id;
    const menu = await menuService.updateMenu(
      req.params.menuId,
      userId,
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
    const userId = req.user.id;
    const menu = await menuService.deleteMenu(req.params.menuId, userId);
    if (!menu) return res.status(404).json({ error: "Menu not found" });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMenuByCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    const menus = await menuService.getMenuByCategory(
      userId,
      req.params.category
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
};
