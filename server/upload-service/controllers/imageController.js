const imageService = require("../services/imageService");

const upload = async (req, res) => {
  try {
    const image = await imageService.uploadImage(req.file);
    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAll = async (req, res) => {
  const images = await imageService.getAllImages();
  res.json(images);
};

const getOne = async (req, res) => {
  const image = await imageService.getImageById(req.params.id);
  if (!image) {
    return res.status(404).json({ message: "Image not found" });
  }
  res.json(image);
};

const remove = async (req, res) => {
  const image = await imageService.deleteImage(req.params.id);
  if (!image) {
    return res.status(404).json({ message: "Image not found" });
  }
  res.json({ message: "Image deleted" });
};

const update = async (req, res) => {
  try {
    const image = await imageService.updateImage(req.params.id, req.file);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.json(image);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  upload,
  getAll,
  getOne,
  remove,
  update,
};
