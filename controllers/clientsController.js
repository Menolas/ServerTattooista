const Client = require('../models/Client');
/* const multer = require('multer');
const path = require('path');
const uploadPath = path.join('public', Client.avatarBasePath);
const imageMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype));
  }
}); */

class clientsController {

  async getClients(req, res) {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

    try {
      const clients = await Client.find();
      results.totalCount = clients.length;
      results.resultClients = clients.slice(startIndex, endIndex);
      res.json(results)
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getClient(req, res) {
    res.send(res.client);
  }

  async addClient(req, res) {
    const fileName = req.file != null ? req.file.filename : null;
    const client = new Client({
      fullName: req.body.fullName,
      avatar: fileName,
    });

    const oldData = { ...client.contacts }
    client.contacts = { ...oldData, ...{ [req.body.contact]: req.body.contactValue }}
    try {
      const newClient = await client.save();
      res.status(201).json(newClient);
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  }

  async customerToClient(req, res) {
    const client = new Client({
      fullName: req.body.fullName,
      contacts: req.body.contacts
    });
    try {
      const newClient = await client.save();
      res.status(201).json(newClient);
    } catch (err) {
      res.status(400).json({ message: err.message })
    }
  }

  async updateClientContact(req, res) {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }

    const oldData = {...res.client.contacts}
    res.client.contacts = { ...oldData, ...{ [req.body.contactTitle]:req.body.contactFieldValue } }

    try {
      const updatedClient = await res.client.save();
      res.json(updatedClient);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async deleteClient(req, res) {
    try {
      await res.client.remove()
      res.json({ message: 'Client Deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

}

module.exports = new clientsController();
