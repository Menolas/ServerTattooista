const Category = require('../models/Category');

class categoryController {

  async getCategories (req, res) {
    const results = {}
    try {
      const categories = await Category.find();
      res.json(categories)
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async getActiveCategory (req, res) {
    const style = req.query.style
    const results = {}

    try {
      const activeTattooStyle = await Category.find({value: style})
      results.resultCode = 0
      results.activeTattooStyle = activeTattooStyle
      res.status(200).json(results)
    } catch (e) {
      results.resultCode = 1
      results.message = e.message
      res.status(400).json(results)
    }
  }

  async deleteCategory(req, res) {

    try {
      await res.category.remove();
      res.json({ message: 'Category Deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async addCategory(req, res) {
    const category = new Category({
      value: req.body.categoryName,
      wallPaper: req.body.wallPaper,
      description: req.body.description
    });
    try {
      const newCategory = await category.save();
      res.status(201).json(newCategory);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

}

module.exports = new categoryController();
