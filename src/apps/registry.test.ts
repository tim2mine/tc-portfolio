import { describe, expect, it } from 'vitest'
import { appRegistry } from './registry'

describe('appRegistry', () => {
  it('has unique ids', () => {
    const ids = appRegistry.map((app) => app.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every entry has required fields', () => {
    for (const app of appRegistry) {
      expect(app.id).toBeTruthy()
      expect(app.title).toBeTruthy()
      expect(app.icon).toBeTruthy()
      expect(app.defaultSize.width).toBeGreaterThan(0)
      expect(app.defaultSize.height).toBeGreaterThan(0)
      expect(app.component).toBeTypeOf('function')
    }
  })
})
