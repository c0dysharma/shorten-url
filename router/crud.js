import express from 'express'
import { nanoid } from 'nanoid/async'

import Item from '../models/url.model.js'

const router = express.Router();
router.route('/create')
  .post(async (req, res) => {
    try {
      let { alias, urls } = req.body;
      let message = 'OK';

      if (!alias) alias = await nanoid(10);

      else {
        const found = await Item.findOne({ alias })
        if (found) {
          alias = await nanoid(10);
          message = 'Alias not Avaliable'
        }

        const doc = await Item.create({ alias, urls })
        return res.send({ url: doc.urls, message })
      }
    } catch (e) {
      res.status(500).send({ "message": e.message, urls:{} })
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

export default router