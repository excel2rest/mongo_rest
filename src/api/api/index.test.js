import request from 'supertest'
import { masterKey, apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Api } from '.'

const app = () => express(apiRoot, routes)

let userSession, adminSession, api

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  adminSession = signSync(admin.id)
  api = await Api.create({})
})

test('POST /apis 201 (master)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: masterKey, data: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.data).toEqual('test')
})

test('POST /apis 401 (admin)', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: adminSession })
  expect(status).toBe(401)
})

test('POST /apis 401 (user)', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('POST /apis 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /apis 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /apis 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /apis/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${api.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(api.id)
})

test('GET /apis/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${api.id}`)
  expect(status).toBe(401)
})

test('GET /apis/:id 404 (user)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: userSession })
  expect(status).toBe(404)
})

test('PUT /apis/:id 200 (master)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${api.id}`)
    .send({ access_token: masterKey, data: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(api.id)
  expect(body.data).toEqual('test')
})

test('PUT /apis/:id 401 (admin)', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${api.id}`)
    .send({ access_token: adminSession })
  expect(status).toBe(401)
})

test('PUT /apis/:id 401 (user)', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${api.id}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('PUT /apis/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${api.id}`)
  expect(status).toBe(401)
})

test('PUT /apis/:id 404 (master)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: masterKey, data: 'test' })
  expect(status).toBe(404)
})

test('DELETE /apis/:id 204 (master)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${api.id}`)
    .query({ access_token: masterKey })
  expect(status).toBe(204)
})

test('DELETE /apis/:id 401 (admin)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${api.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(401)
})

test('DELETE /apis/:id 401 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${api.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('DELETE /apis/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${api.id}`)
  expect(status).toBe(401)
})

test('DELETE /apis/:id 404 (master)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: masterKey })
  expect(status).toBe(404)
})
