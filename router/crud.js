import express from 'express'

import controllers from './crud.controllers.js';

const router = express.Router();
router.route('/create')
  .post(controllers.createPage)
  .get(controllers.createPageGet)

router.route('/:id/:tail?')
  .get(controllers.readURL)
  .put(controllers.updateURL)
  .delete(controllers.deleteURL)

export default router