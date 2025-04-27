const { v4: uuidv4 } = require("uuid");
const bucket = require("../config/firebase");
const Image = require("../models/imageModel");

const images = new Map();
const uploadImage = async (file) => {
  const blob = bucket.file(`images/${Date.now()}_${file.originalname}`);
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  return new Promise((resolve, reject) => {
    blobStream.on("error", (error) => reject(error));

    blobStream.on("finish", async () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      const id = uuidv4();
      const image = new Image(id, file.originalname, publicUrl);
      images.set(id, image);
      resolve(image);
    });

    blobStream.end(file.buffer);
  });
};

const getAllImages = async () => {
  return Array.from(images.values());
};

const getImageById = async (id) => {
  return images.get(id);
};

const deleteImage = async (id) => {
  const image = images.get(id);
  if (!image) return null;

  const filePath = image.url.split(`${bucket.name}/`)[1];
  const file = bucket.file(filePath);

  await file.delete();
  images.delete(id);
  return image;
};

const updateImage = async (id, file) => {
  const oldImage = await deleteImage(id);
  if (!oldImage) return null;
  const newImage = await uploadImage(file);
  newImage.id = id; // Keep the same ID
  images.set(id, newImage);
  return newImage;
};

module.exports = {
  uploadImage,
  getAllImages,
  getImageById,
  deleteImage,
  updateImage,
};
