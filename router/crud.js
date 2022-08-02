const express = require('express')
const router = express.Router();

router.route('/create')
  .post((req, res) => {
    // TODO: create short url
    res.send(req.body.message)
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