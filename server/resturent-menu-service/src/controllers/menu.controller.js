const menuService = require("../services/menu.service");

const createMenu = async (req, res) => {
  try {
    const menuData = { ...req.body, userId: req.user.id };
    const menu = await menuService.createMenu(menuData);
    res.status(201).json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllMenus = async (req, res) => {
  try {
    const menus = await menuService.getAllMenus(req.user.id);
    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMenuById = async (req, res) => {
  try {
    const menu = await menuService.getMenuById(req.user.id, req.params.menuId);
    if (!menu) return res.status(404).json({ error: "Menu not found" });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMenu = async (req, res) => {
  try {
    const menu = await menuService.updateMenu(
      req.params.menuId,
      req.user.id,
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
    const menu = await menuService.deleteMenu(req.params.menuId, req.user.id);
    if (!menu) return res.status(404).json({ error: "Menu not found" });
    res.json(menu);
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
};
