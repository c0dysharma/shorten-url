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
          if (!aliasNotPassed) message = 'Alias not Avaliable'
        }
      }

      const doc = await Item.create({ alias, urls })
      createUrl(doc)
      return res.send({ url: doc.urls, message })
    } catch (error) {
      res.status(500).send({ "message": error.message, urls: {} })
    }
  })
  .get((req, res)=>{
    res.status(405).send({message: 'Bad request'})
  })

router.route('/:id/:tail?')
  .get(async (req, res) => {
    try {
      const { id, tail } = req.params;
      const doc = await Item.findOne({ 'alias': id })
      if (!doc) return res.status(404).send({ message: 'Not found' })
      if (tail) return res.redirect(doc.urls[tail])

      if (doc.urls['/'])
        return res.redirect(doc.urls['/'])
      else
        return res.send({ urls: doc.urls, message: "No root url found" })

    } catch (error) {
      res.status(500).send({ "message": error.message, urls: {} })
    }
  })
  .put((req, res) => {
    // TODO: update urls
    res.send('updating urls')
  })
  .delete((req, res) => {
    // TODO: Deleting the url
    res.send('deleting the url')
  })

function createUrl(res) {
  let { alias, urls } = res;
  Object.keys(urls).forEach(k => {
    urls[k] = `${config.ip}/${alias}/${k}`
  })
}

export default router