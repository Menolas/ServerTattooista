const express = require('express')
const Router = require('express')
const router = new Router()
const GalleryItem = require('../models/GalleryItem')
const controller = require('../controllers/galleryController')

//getting all gallery items
router.get('/', controller.getGalleryItems)

//adding gallery items
router.post('/:style', controller.addGalleryItems)

// Deleting one gallery item
router.delete('/:id', getGalleryItem, controller.deleteGalleryItem)

async function getGalleryItem(req, res, next) {
  let galleryItem
  try {
    galleryItem = await GalleryItem.findById(req.params.id)
    if (galleryItem == null) {
      return res.status(404).json({ message: 'Cannot find galleryItem' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.galleryItem = galleryItem
  next();
}

module.exports = router
