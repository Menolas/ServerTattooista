const Customer = require('../models/Customer')
const Client = require("../models/Client");

class customerController {

  async getCustomers (req, res) {
    let page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const status = req.query.status
    const term = req.query.term
    let customers = []
    const results = {}

    try {
      if (status === 'null' && !term) {
        customers = await Customer.find().sort({createdAt: -1})
      } else if (status !== 'null' && !term) {
        customers = await Customer.find({status: status}).sort({createdAt: -1})
      } else if (status !== 'null' && term) {
        customers = await Customer.find({fullName: {$regex: term, $options: 'i'}, status: status}).sort({createdAt: -1})
      } else if (status === 'null' && term) {
        customers = await Customer.find({fullName: {$regex: term, $options: 'i'}}).sort({createdAt: -1})
      }

      results.totalCount = customers.length
      results.resultCustomers = customers.slice(startIndex, endIndex)
      res.json(results)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  }

  async createCustomer(req, res) {
    const customer = new Customer({
      fullName: req.body.name,
      message: req.body.message
    });

    const oldData = { ...customer.contacts }
    customer.contacts = { ...oldData, ...{ [req.body.contact]: req.body.contactValue }}
    const results = {}

    try {
      await customer.save()
      results.resultCode = 0
      results.customer = customer
      res.status(201).json({results})
    } catch (err) {
      results.resultCode = 1
      res.status(400).json({ message: err.message, results })
    }
  }

  async deleteCustomer(req, res) {
    const results = {}

    try {
      await res.customer.remove()
      results.resultCode = 0
      res.json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(500).json(results)
    }
  }

  async changeCustomerStatus(req, res) {
    res.customer.status = !req.body.status
    const results = {}
    try {
      await res.customer.save();
      results.status = res.customer.status
      results.resultCode = 0
      res.json(results)
    } catch (err) {
      results.resultCode = 1
      res.status(400).json({ message: err.message, results })
    }
  }

  async customerToClient(req, res) {
    const client = new Client({
      fullName: req.body.fullName,
      contacts: req.body.contacts
    })
    const results = {}

    try {
      await res.customer.remove()
      await client.save()
      results.client = client
      results.resultCode = 0
      res.status(201).json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(400).json(results)
    }
  }
}

module.exports = new customerController()
