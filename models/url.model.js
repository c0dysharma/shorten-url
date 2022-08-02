const mongoose = require('mongoose');
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

  }
})

module.exports = mongoose.model('item', itemSchema)