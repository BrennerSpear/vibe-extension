import defaultTargets, { Target } from '../defaultTargets'

describe('defaultTargets', () => {
  it('should have valid targets', () => {
    expect(defaultTargets).toBeDefined()
    expect(Array.isArray(defaultTargets)).toBe(true)
    expect(defaultTargets.length).toBeGreaterThan(0)

    defaultTargets.forEach((target: Target) => {
      expect(target).toHaveProperty('name')
      expect(target).toHaveProperty('url')
      expect(target).toHaveProperty('inputSelector')
      expect(target.url).toMatch(/^https?:\/\//)
    })
  })
})
