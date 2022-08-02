const express = require('express')
const router = express.Router();

const Item = require('../models/url.model')

router.route('/create')
  .post(async (req, res) => {
    // TODO: create short url
    try {
      const doc = await Item.create(req.body);
      res.send(doc)
    } catch (e) {
      res.send({ "message": e.message })
    }
  })

router.route('/:id')
  .get((req, res) => {
    // TODO: redirect to long url
    res.send('redirect to long url')
  })
  .put((req, res) => {
    // TODO: update urls
    res.send('updating urls')
  })
  .delete((req, res) => {
    // TODO: Deleting the url
    res.send('deleting the url')
  })

module.exports = router