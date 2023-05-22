require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const morgan = require("morgan");
const PORT = process.env.PORT || 3030;
const Client = require('./models/Client');

const customerRouter = require('./routes/CustomerRoutes');
const clientRouter = require('./routes/ClientRoutes');
const authRouter = require('./routes/AuthRoutes');
const galleryRouter = require('./routes/GalleryRoutes');
const categoryRouter = require('./routes/CategoryRoutes');
const faqRouter = require('./routes/FaqRoutes');
const serviceRouter = require('./routes/ServiceRoutes');
const rateLimit = require("express-rate-limit");

app.use(cors());
app.use(express.json());
app.use(fileUpload({createParentPath: true,}));
app.use('/avatars', express.static(__dirname + '/routes/uploads/avatars'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/customers', customerRouter);
app.use('/clients', clientRouter);
app.use('/auth', authRouter);
app.use('/gallery', galleryRouter);
app.use('/category', categoryRouter);
app.use('/faq', faqRouter);
app.use('/services/', serviceRouter);

const start = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
    const db = mongoose.connection;
    db.on('error', (error) => console.error(error));
    db.once('open', () => console.log('Connected to Database'));
    app.listen(PORT, () => console.log('Server started!'));
  } catch (e) {
    console.log(e);
  }
}

start();


