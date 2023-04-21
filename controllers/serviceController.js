const Service = require('../models/Service');

class serviceController {

  async getServices(req, res) {
    try {
      const services = await Service.find();
      res.json(services);
    } catch (e) {
      console.log(e);
    }
  }

  async addService(req, res) {
    const service = new Service({
      title: req.body.title,
      imgUrl: req.body.imgUrl,
      conditions: req.body.conditions
    });

    try {
      const newService = await service.save();
      res.status(201).json(newService);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new serviceController();
