const FaqItem = require('../models/FaqItem');

class faqController {

  async getFaqItems(req, res) {
    try {
      const faqItems = await FaqItem.find();
      res.json(faqItems);
    } catch (e) {
      console.log(e);
    }
  }

  async addFaqItem(req, res) {
    const faqItem = new FaqItem({
      question: req.body.question,
      answer: req.body.answer
    });

    try {
      await faqItem.save();
      res.status(201).json(faqItem);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new faqController();
