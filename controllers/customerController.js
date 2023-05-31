const Customer = require('../models/Customer');

class customerController {

  async getCustomers (req, res) {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

    try {
      const customers = await Customer.find();
      results.totalCount = customers.length;
      results.resultCustomers = customers.slice(startIndex, endIndex);
      res.json(results)
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async createCustomer(req, res) {
    const customer = new Customer({
      fullName: req.body.name,
      message: req.body.message
    });

    const oldData = { ...customer.contacts }
    customer.contacts = { ...oldData, ...{ [req.body.contact]: req.body.contactValue }}

    try {
      await customer.save();
      const result = 0
      res.status(201).json({result});
    } catch (err) {
      const result = 1
      res.status(400).json({ message: err.message, result })
    }
  }

  async deleteCustomer(req, res) {

    try {
      await res.customer.remove();
      const result = 0
      res.json(result)
    } catch (err) {
      const result = 1
      res.status(500).json({ message: err.message, result });
    }
  }

  async contactCustomer(req, res) {
    res.customer.status = true;
    try {
      await res.customer.save();
      const result = 0
      res.json(result)
    } catch (err) {
      const result = 1
      res.status(400).json({ message: err.message, result });
    }
  }

  async unContactCustomer(req, res) {
    res.customer.status = false;
    try {
      await res.customer.save();
      const result = 0
      res.json(result)
    } catch (err) {
      const result = 1
      res.status(400).json({ message: err.message, result: result });
    }
  }

}

module.exports = new customerController();
