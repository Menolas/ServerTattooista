const Client = require('../models/Client');

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

  async editClient(req, res) {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }

    res.client.fullName = req.body.name,
    res.client.contacts.email = req.body.email
    res.client.contacts.insta = req.body.insta
    res.client.contacts.phone = req.body.phone
    res.client.contacts.whatsapp = req.body.whatsapp
    res.client.contacts.messenger = req.body.messenger

    try {
      const updatedClient = await res.client.save();
      let result = updatedClient._id
      if (req.files.avatar) {
        const file = req.files.avatar
        const newFileName = encodeURI(Date.now() + '_' + file.name)
        await file.mv(`./uploads/${result}/${newFileName}`, err => {
          res.client.avatar = newFileName
          res.client.save();
        });
      }

      res.json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async updateClientGallery(req, res) {
    if (!req.files) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }

    const files = req.files
    console.log(files)
    const oldData = [...res.client.gallery]
    //res.client.gallery = [...oldData, ...files]

    try {
      const updatedClient = await res.client.save();
      res.json(updatedClient);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  async addClient(req, res) {
    const client = new Client({
      fullName: req.body.name,
      contacts: {
        email: req.body.email,
        insta: req.body.insta,
        phone: req.body.phone,
        whatsapp: req.body.whatsapp,
        messenger: req.body.messenger
      }
    });

    try {
      let newClient = await client.save();
      let result = newClient._id

      const file = req.files.avatar
      if (!file) return res.json({ error: 'Incorrect input name'})
      const newFileName = encodeURI(Date.now() + '_' + file.name)
      await file.mv(`./uploads/${result}/${newFileName}`, err => {
        client.avatar = newFileName
        client.save();
      });

      res.status(201).json({result});
    } catch (err) {
      const result = 1
      res.status(400).json({ message: err.message, result: result })
    }
  }

  async customerToClient(req, res) {
    const client = new Client({
      fullName: req.body.fullName,
      contacts: req.body.contacts
    });
    try {
      await client.save();
      const result = 0
      res.status(201).json({result: result});
    } catch (err) {
      const result = 1
      res.status(400).json({ message: err.message, result: result })
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
      const result = 0
      res.json({result: result})
    } catch (err) {
      const result = 1
      res.status(500).json({ message: err.message, result: result });
    }
  }

}

module.exports = new clientsController();
