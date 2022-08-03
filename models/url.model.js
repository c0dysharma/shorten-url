import mongoose from 'mongoose';
import config from '../config.js'
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
      validator: config.validatURL,
      message: "Not a valid url format"
    }
  }
})

export default mongoose.model('item', itemSchema)