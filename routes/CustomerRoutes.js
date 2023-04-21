const express = require('express');
const Router = require('express');
const router = new Router();
const Customer = require('../models/Customer');
const controller = require('../controllers/customerController');
//const getCustomerMiddleware = require('../middleware/getCustomerMiddleware');

// Getting all
router.get('/', controller.getCustomers );

// Creating one
router.post('/', controller.createCustomer);

// Updating one
router.patch('/contact/:id', getCustomer, controller.contactCustomer);

// Updating one
router.patch('/unContact/:id', getCustomer, controller.unContactCustomer);

// Deleting one
router.delete('/:id', getCustomer, controller.deleteCustomer);

async function getCustomer(req, res, next) {
  let customer;
  try {
    customer = await Customer.findById(req.params.id)
    if (customer == null) {
      return res.status(404).json({ message: 'Cannot find customer' })
    }
  } catch (err) {
    return res.status(500).json({ message: err.message })
  }

  res.customer = customer
  next()
} 

module.exports = router;
