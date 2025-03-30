const express = require("express");
const {
  createMenu,
  getAllMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
  getMenuByCategory,
} = require("../controllers/menu.controller.js");
const authenticateToken = require("../middlewares/auth.middleware.js");

const router = express.Router();

router.post("/", authenticateToken, createMenu);
router.get("/all-menu", authenticateToken, getAllMenus);
router.get("/:menuId", authenticateToken, getMenuById);
router.patch("/:menuId", authenticateToken, updateMenu);
router.delete("/:menuId", authenticateToken, deleteMenu);
router.get("/category/:category", authenticateToken, getMenuByCategory);

module.exports = router;
