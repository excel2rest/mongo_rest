import { Api } from '.'

let api

beforeEach(async () => {
  api = await Api.create({ data: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = api.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(api.id)
    expect(view.data).toBe(api.data)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = api.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(api.id)
    expect(view.data).toBe(api.data)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
