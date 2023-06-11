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

// Change customer status
router.patch('/status/:id', getCustomer, controller.changeCustomerStatus);

// turn customer to client

router.post('/customerToClient/:id', getCustomer, controller.customerToClient);

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
