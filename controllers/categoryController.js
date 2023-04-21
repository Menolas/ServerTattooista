const Category = require('../models/Category');

class categoryController {

  async getCategories (req, res) {

    try {
      const categories = await Category.find();
      res.json(categories)
    } catch (err) {
      res.status(500).json({ message: err.message });
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
