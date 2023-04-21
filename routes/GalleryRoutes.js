const express = require('express');
const Router = require('express');
const router = new Router();
const GalleryItem = require('../models/GalleryItem');
const controller = require('../controllers/galleryController');

//getting all gallery items
router.get('/', controller.getGalleryItems);

// Deleting one gallery item
router.delete('/:id', getGalleryItem, controller.deleteGalleryItem);

// Creating one gallery item

router.post('/', controller.addGalleryItem);

async function getGalleryItem(req, res, next) {
  let galleryItem;
  try {
    galleryItem = await GalleryItem.findById(req.params.id);
    if (galleryItem == null) {
      return res.status(404).json({ message: 'Cannot find galleryItem' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.customer = customer;
  next();
} 

module.exports = router;
