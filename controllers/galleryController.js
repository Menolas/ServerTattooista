const GalleryItem = require('../models/GalleryItem');

class galleryController {
  
  async getGalleryItems(req, res) {
    try {
      const galleryItems = await GalleryItem.find();
      res.json(galleryItems);
    } catch (e) {
      console.log(e);
    }
  }

  async deleteGalleryItem(req, res) {
    
    try {
      await res.galleryItem.remove();
      res.json({ message: 'galleryItem Deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async addGalleryItem(req, res) {
    const galleryItem = new GalleryItem({
      fileName: req.body.fileName
    });

    const oldCategories = [...galleryItem.categories];
    galleryItem.categories = [...oldCategories, req.body.category];
    try {
      const newGalleryItem = await galleryItem.save();
      res.status(201).json(galleryItem);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

}

module.exports = new galleryController();
