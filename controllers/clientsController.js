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

  // async addClient(req, res) {
  //   const client = new Client({
  //     fullName: req.body.name,
  //     avatar: req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename,
  //     contacts: {
  //       email: req.body.email,
  //       insta: req.body.insta,
  //       phone: req.body.phone,
  //       whatsapp: req.body.whatsapp,
  //       messenger: req.body.messenger
  //     },
  //     gallery: req.body.gallery
  //   });
  //
  //   try {
  //     let newClient = await client.save();
  //     let result = newClient._id
  //     res.status(201).json({result});
  //   } catch (err) {
  //     const result = 1
  //     res.status(400).json({ message: err.message, result: result })
  //   }
  // }

  async addClient(req, res) {
    const client = new Client({
      fullName: req.body.name,
      //avatar: req.protocol + '://' + req.get('host') + '/uploads/' + req.file.filename,
      contacts: {
        email: req.body.email,
        insta: req.body.insta,
        phone: req.body.phone,
        whatsapp: req.body.whatsapp,
        messenger: req.body.messenger
      },
      gallery: req.body.gallery
    });

    try {
      let newClient = await client.save();
      let result = newClient._id
      console.log(req)

      const file = req.files.avatar
      //if (!file) return res.json({ error: 'Incorrect input name'})
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
