import { success, notFound } from '../../services/response/'
import xlsx from 'node-xlsx'
import { Api } from '.'

export const create = ({ bodymen: { body } }, res, next) =>
  Api.create(body)
    .then((api) => api.view(true))
    .then(success(res, 201))
    .catch(err => res.status(400).json(err))

export const index = ({ query, params: { tenant }, querymen: { select, cursor } }, res, next) => {
  console.log(query)
  for (let i in query){
    query[`data.${i}`] = query[i]
    delete query[i]
  }
  query.tenant = tenant
  return Api.count(query)
    .then(count => Api.find(query, select, cursor)
      .then((apis) => ({
        count,
        rows: apis.map((api) => api.view().data),
        page_size: apis.length
      }))
    )
    .then(success(res))
    .catch(next)
}

export const show = ({ params }, res, next) =>
  Api.findById(params.id)
    .then(notFound(res))
    .then((api) => api ? api.view() : null)
    .then(success(res))
    .catch(err => res.status(400).json(err))

export const update = ({ bodymen: { body }, params }, res, next) =>
  Api.findById(params.id)
    .then(notFound(res))
    .then((api) => api ? Object.assign(api, body).save() : null)
    .then((api) => api ? api.view(true) : null)
    .then(success(res))
    .catch(err => res.status(400).json(err))

export const destroy = ({ params }, res, next) =>
  Api.findById(params.id)
    .then(notFound(res))
    .then((api) => api ? api.remove() : null)
    .then(success(res, 204))
    .catch(err => res.status(400).json(err))

export const upload = ({ files, params: { tenant } }, res, next) => {
  Api.remove({ tenant }).then(del => {
    let rows = xlsx.parse(files.file.data)[0].data
    let headers = rows.shift()
    let objs = rows.map(row => headers.reduce((result, item, index) => {
      result[item] = row[index] 
      return result
    }, {}))
    return Api.create(objs.map(data => { return { data, tenant } }))
  })
  .then(success(res, 200))
  .catch(err => {
    console.log(err)
    res.status(400).json(err)
  })
}
  
  

  