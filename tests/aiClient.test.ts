import { generateText, mockGenerateText } from '../lib/aiClient'

// Mock environment
const originalEnv = process.env

beforeEach(() => {
  jest.resetModules()
  process.env = { ...originalEnv }
})

afterAll(() => {
  process.env = originalEnv
})

describe('AI Client', () => {
  describe('generateText', () => {
    it('returns mock response when API key is not set', async () => {
      delete process.env.GOOGLE_AI_API_KEY
      
      const result = await generateText('Test prompt')
      
      expect(result).toContain('[Mock AI Response]')
      expect(result).toContain('Test prompt')
    })

    it('handles missing API key gracefully', async () => {
      process.env.GOOGLE_AI_API_KEY = ''
      
      const result = await generateText('Test')
      
      expect(result).toContain('[Mock AI Response]')
    })
  })

  describe('mockGenerateText', () => {
    it('returns mock response with prompt', () => {
      const result = mockGenerateText('Custom prompt')
      
      expect(result).toContain('[Mock AI Response]')
      expect(result).toContain('Custom prompt')
    })
  })
})

