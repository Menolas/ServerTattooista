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

  async addClient(req, res) {
    const client = new Client({
      fullName: req.body.values.name,
      avatar: req.body.avatar,
      contacts: {
        email: req.body.values.email,
        insta: req.body.values.insta,
        phone: req.body.values.phone,
        whatsapp: req.body.values.whatsapp,
        messenger: req.body.values.messenger
      },
      gallery: req.body.gallery
    });

    try {
      let newClient = await client.save();
      let result = newClient._id
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

  async uploadClientAvatar(req, res) {
    if (!req.files) {
      return res.status(400).json({msg: 'No file uploaded'})
    }

    const file = req.files.file

    if (!file) return res.json({ error: 'Incorrect input name'})

    const newFileName = encodeURI(Date.now() + '_' + file.name)

    file.mv(`./uploads/avatars/${newFileName}`, err => {
      if (err) {
        console.error(err)
        return res.status(500).send(err)
      }
      const result = `avatars/${newFileName}`
      res.status(201).json({result: result});
    })
  }

  async updateClientAvatar(req, res) {
    console.log("!!!!!!!!!!+++++++++++++++++++")
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }

    console.log(res.client + "!!!!!!!!!!!")
    //res.client.avatar = req.body.avatar;

    try {
      console.log(req.body + "try!!!!!!!!!!")
      //const updatedClient = await res.client.save();
      //res.json(updatedClient);
    } catch (err) {
      res.status(400).json({ message: err.message });
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
