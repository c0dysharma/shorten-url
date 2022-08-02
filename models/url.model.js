const mongoose = require('mongoose');
const { validatURL } = require('../config');
const Schema = mongoose.Schema;


const itemSchema = new Schema({
  date: {
    type: Date,
    default: Date.now()
  },
  alias: String,
  urls: {
    type: Object,
    required: true,
    validate: {
      validator: validatURL,
      message: "Not a valid url format"
    }
  }
})

module.exports = mongoose.model('item', itemSchema)