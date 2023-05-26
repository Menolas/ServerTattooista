const express = require('express');
const router = express.Router();
const path = require('path');
const Client = require('../models/Client');
const controller = require('../controllers/clientsController');
//const multer = require('multer');
// const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
// const uploadPath = path.join('public', Client.avatarBasePath);
// const upload = multer({
//   dest: uploadPath,
//   fileFilter: (req, file, callback) => {
//     callback(null, imageMimeTypes.includes(file.mimetype))
//   }
// });

// Getting all
router.get('/', controller.getClients);

// Getting one
router.get('/:id', getClient, controller.getClient);

// Creating one

router.post('/', controller.addClient);

// uploading avatar
router.post('/avatar', (req, res) => {
  if (!req.files) {
    return res.status(400).json({msg: 'No file uploaded'})
  }

  const file = req.files.file

  if (!file) return res.json({ error: 'Incorrect input name'})

  const newFileName = encodeURI(Date.now() + '_' + file.name)

  file.mv(`${__dirname}/uploads/avatars/${newFileName}`, err => {
    if (err) {
      console.error(err)
      return res.status(500).send(err)
    }
    const result = `avatars/${newFileName}`
    res.status(201).json({result: result});
  })
});

// update client avatar

router.post('updateAvatar/:id', getClient, controller.updateClientAvatar);

// update client contact

router.post('/updateContact/:id', getClient, controller.updateClientContact);

// Deleting one
router.delete('/:id', getClient, controller.deleteClient);

// adding a client from customers

router.post('/customerToClient', controller.customerToClient);

function removeAvatar(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err => {
    if (err) console.log(err)
  })
}

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
