const Client = require('../models/Client')
//const Customer = require("../models/Customer");

class clientsController {

  async getClients(req, res) {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    let clients = []
    const term = req.query.term
    const gallery = req.query.gallery
    const results = {}

    try {
      if (gallery === 'any' && !term) {
        clients = await Client.find().sort({createdAt: -1})
      } else if (gallery === '1' && !term) {
        clients = await Client.find({$where: "this.gallery.length > 0"}).sort({createdAt: -1})
      } else if (gallery === '0' && !term) {
        clients = await Client.find({$where: "this.gallery.length < 1"}).sort({createdAt: -1})
      } else if (gallery === 'any' && term) {
        clients = await Client.find({fullName: {$regex: term, $options: 'i'}}).sort({createdAt: -1})
      } else if (gallery === '1' && term) {
        clients = await Client.find({$where: "this.gallery.length > 0", fullName: {$regex: term, $options: 'i'}}).sort({createdAt: -1})
      } else if (gallery === '0' && term) {
        clients = await Client.find({$where: "this.gallery.length < 1", fullName: {$regex: term, $options: 'i'}}).sort({createdAt: -1})
      }

      results.totalCount = clients.length
      results.resultClients = clients.slice(startIndex, endIndex)
      res.json(results)
    } catch (err) {
      res.status(500).json({ message: err.message })
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

    res.client.fullName = req.body.name
    res.client.contacts.email = req.body.email
    res.client.contacts.insta = req.body.insta
    res.client.contacts.phone = req.body.phone
    res.client.contacts.whatsapp = req.body.whatsapp
    res.client.contacts.messenger = req.body.messenger

    const results = {}

    try {
      const updatedClient = await res.client.save()
      results.client = updatedClient
      results.resultCode = 0
      if (req.files && req.files.avatar) {
        const file = req.files.avatar
        const newFileName = encodeURI(Date.now() + '_' + file.name)
        await file.mv(`./uploads/${updatedClient._id}/${newFileName}`, err => {
          res.client.avatar = newFileName
          res.client.save()
        });
      }
      res.json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(400).json(results)
    }
  }

  async updateClientGallery(req, res) {
    if (!req.body.gallery) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      })
    }

    let newGallery = []
    const files = req.files
    for (let key in files) {
      const fileNewName = encodeURI(Date.now() + '_' + files[key].name)
      newGallery.push(fileNewName)
      await files[key].mv(`./uploads/doneTattooGallery/${res.client._id}/${fileNewName}`, err => {
        //newGallery.push(fileNewName)
      })
    }

    const oldData = [...res.client.gallery]
    res.client.gallery = [...oldData, ...newGallery]

    try {
      const updatedClient = await res.client.save()
      const results = {}
      results.client = updatedClient
      results.resultCode = 0
      res.json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(400).json(results)
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
    })

    const results = {}

    try {
      let newClient = await client.save()
      if (req.files && req.files.avatar) {
        const file = req.files.avatar
        if (!file) return res.json({error: 'Incorrect input name'})
        const newFileName = encodeURI(Date.now() + '_' + file.name)
        await file.mv(`./uploads/${newClient._id}/${newFileName}`, err => {
          client.avatar = newFileName
          client.save()
        })
      }
      results.resultCode = 0
      results.client = newClient
      res.status(201).json(results)
    } catch (err) {
      results.resultCode = 1
      res.status(400).json(results)
    }
  }

  //   const oldData = {...res.client.contacts}
  //   res.client.contacts = { ...oldData, ...{ [req.body.contactTitle]:req.body.contactFieldValue } }

  async deleteClient(req, res) {
    const results = {}

    try {
      await res.client.remove()
      results.resultCode = 0
      res.json(results)
    } catch (err) {
      results.resultCode = 1
      results.message = err.message
      res.status(500).json(results)
    }
  }

}

module.exports = new clientsController();
