import { customAlphabet } from 'nanoid/async'
const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 5)
import 'dotenv/config'

import Item from '../models/url.model.js'

// changes longUrl to shortUrl with alias
function createUrl(res) {
  let newOb = JSON.parse(JSON.stringify(res)); // deep copy
  let { alias, urls } = newOb;

  // create urls only if alias and url is there
  if (alias && urls) {
    Object.keys(urls).forEach(tail => {
      if (tail != '/') urls[tail] = `${process.env.SERVER_URL}/${alias}/${tail}`
      else urls[tail] = `${process.env.SERVER_URL}/${alias}`
    })
    return newOb;
  } return null;
}
const controllers = {
  createPage: async (req, res) => {
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
      const newOb = createUrl(doc)
      if (newOb)
        return res.send({ urls: newOb.urls, message })
      else
        throw Error('Some Alias or Url is missing.')

    } catch (error) {
      res.status(500).send({ "message": error.message, urls: {} })
    }
  },
  createPageGet: async (req, res) => {
    try {
      const docs = await Item.find({});
      res.status(200).send({ data: docs })
    } catch (error) {
      res.status(500).send({ "message": error.message, urls: {} })
    }
  },
  readURL: async (req, res) => {
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
  },
  updateURL: async (req, res) => {
    try {
      const { id } = req.params;
      const doc = await Item.findOne({ 'alias': id })
      if (!doc) return res.status(404).send({ message: 'Not found' })

      const { urls: newUrls } = req.body;
      const newDoc = await Item.findByIdAndUpdate(doc._id, { urls: newUrls }, { runValidators: true, new: true })
      res.send({ urls: newDoc.urls, message: "OK" })

    } catch (error) {
      res.status(500).send({ "message": error.message, urls: {} })
    }
  },
  deleteURL: async (req, res) => {
    try {
      const { id } = req.params;
      const doc = await Item.findOne({ 'alias': id })
      if (!doc) return res.status(404).send({ message: 'Not found' })

      const deletedDoc = await Item.findByIdAndDelete(doc._id)
      return res.send({ urls: deletedDoc.urls, message: "OK" })
    } catch (error) {
      res.status(500).send({ "message": error.message, urls: {} })
    }
  }
}

export default controllers