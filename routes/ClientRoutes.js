const express = require('express');
const router = express.Router();
const path = require('path');
const Client = require('../models/Client');
const controller = require('../controllers/clientsController');
//const multer = require('multer');

// const storage = multer.diskStorage(
//   {
//     destination: (req, file, cb) => {
//       cb(null, './uploads');
//     },
//     filename: (req, file, cb) => {
//       cb(
//           null,
//           new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname
//       );
//     }
//   });
//
// const fileFilter = (req, file, cb) => {
//   if (
//       file.mimetype === 'image/png' ||
//       file.mimetype === 'image/jpg' ||
//       file.mimetype === 'image/jpeg' ||
//       file.mimetype === 'image/web'
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

//const upload = multer({ storage: storage, fileFilter: fileFilter });

// Getting all
router.get('/', controller.getClients);

// Getting one
router.get('/:id', getClient, controller.getClient);

// Creating one

//router.post('/', upload.single('avatar'), controller.addClient);

router.post('/', controller.addClient);

// update client avatar

router.post('/updateGallery/:id', getClient, controller.updateClientGallery);

// Deleting one
router.delete('/:id', getClient, controller.deleteClient);

// adding a client from customers

//router.post('/customerToClient', controller.customerToClient);

// edit client

router.post('/edit/:id', getClient, controller.editClient);

// function removeAvatar(fileName) {
//   fs.unlink(path.join(uploadPath, fileName), err => {
//     if (err) console.log(err)
//   })
// }

async function getClient(req, res, next) {
  let client;
  try {
    client = await Client.findById(req.params.id);
    if (client == null) {
      return res.status(404).json({ message: 'Cannot find client' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.client = client;
  next();
}

module.exports = router;
