import express from 'express'
import { customAlphabet } from 'nanoid/async'
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 5)

import Item from '../models/url.model.js'
import config from '../config.js'

const router = express.Router();
router.route('/create')
  .post(async (req, res) => {
    try {
      let { alias, urls } = req.body;
      let message = 'OK';
      const aliasNotPassed = !alias

      if (aliasNotPassed) alias = await nanoid();
      else {
        const found = await Item.findOne({ alias })
        if (found) {
          alias = await nanoid();
          if(!aliasNotPassed) message = 'Alias not Avaliable'
        }
      }

      const doc = await Item.create({ alias, urls })
      createUrl(doc)
      return res.send({ url: doc.urls, message })
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

function createUrl(res){
  let { alias, urls} = res;
  Object.keys(urls).forEach(k=>{
    urls[k] = `${config.ip}/${alias}${k}`
  })
}

export default router