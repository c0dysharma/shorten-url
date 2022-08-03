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
  .get((req, res) => {
    res.status(405).send({ message: 'Bad request' })
  })

router.route('/:id/:tail?')
  .get(async (req, res) => {
    try {
      const { id, tail } = req.params;
      const doc = await Item.findOne({ 'alias': id })
      if (!doc) return res.status(404).send({ message: 'Not found' })

      if (tail) {
        if (doc.urls[tail])
          return res.redirect(doc.urls[tail])
        else return res.status(404).send({ "message": "No tail found", urls: doc.urls })
      }

      if (doc.urls['/'])
        return res.redirect(doc.urls['/'])
      else
        return res.send({ urls: doc.urls, message: "No root url found" })

    } catch (error) {
      res.status(500).send({ "message": error.message, urls: {} })
    }
  })
  .put(async (req, res) => {
    try {
      const { id } = req.params;
      const doc = await Item.findOne({ 'alias': id })
      if (!doc) return res.status(404).send({ message: 'Not found' })

      const { urls: newUrls } = req.body;
      Object.keys(newUrls).forEach(k => {
        if (doc.urls[k]) doc.urls[k] = newUrls[k] // key exists: update
        else doc.urls[k] = newUrls[k];  // add a new key value pair
      })
      const newDoc = await Item.findByIdAndUpdate(doc._id, { urls: doc.urls }, { runValidators: true, new: true })
      res.send({ urls: newDoc.urls, message: "OK" })

    } catch (error) {
      res.status(500).send({ "message": error.message, urls: {} })
    }
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    const doc = await Item.findOne({ 'alias': id })
    if (!doc) return res.status(404).send({ message: 'Not found' })

    const deletedDoc = await Item.findByIdAndDelete(doc._id)
    return res.send({ urls: deletedDoc.urls, message: "OK" })
  })

function createUrl(res) {
  let { alias, urls } = res;
  Object.keys(urls).forEach(k => {
    urls[k] = `${config.ip}/${alias}/${k}`
  })
}

export default router