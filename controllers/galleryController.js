const GalleryItem = require('../models/GalleryItem')
const fs = require("fs")

class galleryController {

  async getGalleryItems(req, res) {
    const style = req.query.style
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    let gallery = []
    const results = {}
    try {
      gallery = await GalleryItem.find({categories: style})
      results.resultCode = 0
      results.totalCount = gallery.length
      results.gallery = gallery.slice(startIndex, endIndex)
      res.json(results);
    } catch (e) {
      results.resultCode = 1
      results.message = e.message
      res.status(400).json(results)
      console.log(e)
    }
  }

  async deleteGalleryItem(req, res) {

    console.log(req.query)

    fs.unlink(`./uploads/gallery/${req.query.style}/${req.query.fileName}`, err => {
       if (err) console.log(err)
    })

    //console.log(res.galleryItem)
    const results = {}
    try {
      await res.galleryItem.remove();
      const newGallery = await GalleryItem.find();
      results.resultCode = 0
      results.gallery = newGallery
      res.json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(400).json(results)
    }
  }

  async addGalleryItems(req, res) {
    if (!req.body.gallery) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      })
    }

    const gallery = []
    const files = req.files
    const results = {}

    for (let key in files) {
      const fileNewName = encodeURI(Date.now() + '_' + files[key].name)
      gallery.push(fileNewName)
      await files[key].mv(`./uploads/gallery/${req.params.style}/${fileNewName}`, err => {
      })
    }

    try {
      gallery.forEach((item) => {
        const newGalleryItem = new GalleryItem({
          fileName: item.toString(),
          categories: [req.params.style]
        })
        newGalleryItem.save()
      })
      const newGallery = await GalleryItem.find();

      results.resultCode = 0
      results.gallery = newGallery
      res.json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(400).json(results)
    }
  }

}

module.exports = new galleryController();
