import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { master, token } from '../../services/passport'
import { create, index, show, update, destroy, upload } from './controller'
import { schema } from './model'
import fileUpload from 'express-fileupload'
export Api, { schema } from './model'

const router = new Router()
const { data } = schema.tree

/**
 * @api {post} /apis Create api
 * @apiName CreateApi
 * @apiGroup Api
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam data Api's data.
 * @apiSuccess {Object} api Api's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Api not found.
 * @apiError 401 master access only.
 */
router.post('/',
  master(),
  body({ data }),
  create)

/**
 * @api {get} /apis Retrieve apis
 * @apiName RetrieveApis
 * @apiGroup Api
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of apis.
 * @apiSuccess {Object[]} rows List of apis.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/:tenant',
  token({ required: false }),
  query(),
  index)

/**
 * @api {get} /apis/:id Retrieve api
 * @apiName RetrieveApi
 * @apiGroup Api
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} api Api's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Api not found.
 * @apiError 401 user access only.
 */
router.get('/:id',
  token({ required: true }),
  show)

/**
 * @api {put} /apis/:id Update api
 * @apiName UpdateApi
 * @apiGroup Api
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam data Api's data.
 * @apiSuccess {Object} api Api's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Api not found.
 * @apiError 401 master access only.
 */
router.put('/:id',
  master(),
  body({ data }),
  update)

/**
 * @api {delete} /apis/:id Delete api
 * @apiName DeleteApi
 * @apiGroup Api
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Api not found.
 * @apiError 401 master access only.
 */
router.delete('/:id',
  master(),
  destroy)


/**
 * @api {post} /apis Upload api
 * @apiName UploadApi
 * @apiGroup Api
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam file Api's file.
 * @apiSuccess {Object} api Api's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Api not found.
 * @apiError 401 master access only.
 */
router.post('/upload/:tenant',
master(),
fileUpload(),
body({ data }),
upload)


export default router
