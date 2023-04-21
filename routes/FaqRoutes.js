const express = require('express');
const Router = require('express');
const router = new Router();
const FaqItem = require('../models/FaqItem');
const controller = require('../controllers/faqController');

// getting all items

router.get('/', controller.getFaqItems);

// adding faq item

router.post('/', controller.addFaqItem);

module.exports = router;
