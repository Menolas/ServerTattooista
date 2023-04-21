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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/customers', customerRouter);
app.use('/clients', clientRouter);

app.post('/clients', limiter, async (req, res) => {
  //console.log("REQUEST BODY !!!!!!!!" + req.body.files[0].name);
  const fileName = req.body.files != null ? req.body.files[0].name : null;
  const client = new Client({
    fullName: req.body.name,
    avatar: fileName,
    contacts:{
      email: req.body.email,
      phone: req.body.phone,
    },
  });

  try {
    if (req.body.files && req.body.files[0]) {
      [req.body.files].flat().map((file) => {
        file.mv("./uploads/avatars" + file.name);
      });
    }

    fs.writeFile("./uploads/data.json", JSON.stringify(req.body), "utf8", () => {
      // res.send({
      //   status: true,
      //   message: "Data is uploaded",
      // });
      console.log("File is uploaded");
    });
    const newClient = await client.save();
    res.status(201).json(newClient);
  } catch (err) {
    if (client.avatar != null) {
      removeAvatar(client.avatar);
    }
    console.log('!!!!!' + err);
    res.status(400).json({ message: err.message })
  }
});


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


