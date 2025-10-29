// Server-side AI client for Google AI Studio (Gemini)
// WARNING: This module should only be imported in server components or API routes

import { GoogleGenerativeAI } from '@google/generative-ai'

// Types for AI responses
export interface ShotEntry {
  camera: string
  movement: string
  duration: string
  notes: string
}

export interface StoryboardFrame {
  url: string
  caption: string
}

export interface AIGenerateRequest {
  type: 'generate' | 'storyboard' | 'shotlist' | 'rewrite' | 'summarize' | 'schedule' | 'trailer'
  prompt: string
  projectId?: string
  sceneId?: string
  context?: string
}

export interface AIGenerateResponse {
  type: string
  content: string | ShotEntry[] | StoryboardFrame[]
  model?: string
  cost_estimate?: number
}

/**
 * Initialize Gemini AI client
 * Returns null if API key is not set (for local dev with mocks)
 */
function getGeminiClient() {
  const apiKey = process.env.GOOGLE_AI_API_KEY
  
  if (!apiKey) {
    console.warn('⚠️  GOOGLE_AI_API_KEY not set. Using mock responses.')
    return null
  }

  return new GoogleGenerativeAI(apiKey)
}

/**
 * Generate text using Gemini
 */
export async function generateText(
  prompt: string,
  modelName?: string
): Promise<string> {
  const client = getGeminiClient()
  
  if (!client) {
    // Return mock response in dev
    return mockGenerateText(prompt)
  }

  // Try different model names in order of preference
  const modelsToTry = [
    modelName,
    'gemini-2.5-flash',
    'gemini-2.5-pro',
    'gemini-2.0-flash-exp',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-pro'
  ].filter(Boolean) as string[]

  let lastError: any = null

  for (const model of modelsToTry) {
    try {
      console.log(`Trying model: ${model}`)
      const modelClient = client.getGenerativeModel({ model })
      const result = await modelClient.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      console.log(`✅ Success with model: ${model}`)
      return text
    } catch (error: any) {
      console.log(`❌ Failed with model ${model}:`, error.message)
      lastError = error
      // Continue to next model
    }
  }

  console.error('All Gemini models failed:', lastError)
  throw new Error('Failed to generate text with any available model')
}

/**
 * Generate a shotlist from scene text
 */
export async function generateShotlist(sceneText: string): Promise<ShotEntry[]> {
  const client = getGeminiClient()
  
  if (!client) {
    // Return mock shotlist
    return mockShotlist()
  }

  try {
    const prompt = `Break this film scene into 4-6 shots with camera directions, movement, duration, and notes:\n\n${sceneText}\n\nReturn as JSON array: [{"camera": "Wide shot", "movement": "Static", "duration": "10s", "notes": "Establish"}]`
    
    const text = await generateText(prompt)
    
    // Parse JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    throw new Error('Failed to parse shotlist JSON')
  } catch (error) {
    console.error('Shotlist generation error:', error)
    return mockShotlist() // Fallback to mock
  }
}

/**
 * Generate storyboard frames (image generation)
 * TODO: Implement actual image generation when Gemini image models are available
 * For now, returns placeholder image URLs
 */
export async function generateStoryboard(sceneText: string, count: number = 4): Promise<StoryboardFrame[]> {
  console.log('🎨 Storyboard generation requested')
  console.log('⚠️  Image generation not yet implemented. Returning mock frames.')
  
  // TODO: Implement image generation with Gemini Pro Vision or other model
  // For now, return mock frames
  return Array.from({ length: count }, (_, i) => ({
    url: `/mock-storyboard-${i + 1}.jpg`,
    caption: `Frame ${i + 1}: ${sceneText.substring(0, 50)}...`,
  }))
}

/**
 * Summarize text
 */
export async function summarizeText(text: string, maxLength: number = 200): Promise<string> {
  const client = getGeminiClient()
  
  if (!client) {
    return `[Summary] ${text.substring(0, maxLength)}...`
  }

  try {
    const prompt = `Summarize the following in ${maxLength} characters:\n\n${text}`
    return await generateText(prompt)
  } catch (error) {
    console.error('Summarization error:', error)
    return text.substring(0, maxLength) + '...'
  }
}

/**
 * Analyze script continuity
 */
export async function analyzeScriptContinuity(script: string): Promise<string> {
  const client = getGeminiClient()
  
  if (!client) {
    return 'Mock continuity notes: Check lighting consistency across scenes. Verify character wardrobe continuity.'
  }

  try {
    const prompt = `Analyze this script for continuity errors (wardrobe, props, dialogue, timeline):\n\n${script}`
    return await generateText(prompt)
  } catch (error) {
    console.error('Continuity analysis error:', error)
    return 'Unable to analyze continuity at this time.'
  }
}

/**
 * Generate a trailer script from project
 */
export async function generateTrailer(title: string, description: string, scenes: string[]): Promise<string> {
  const client = getGeminiClient()
  
  if (!client) {
    return `[Trailer] ${title}: ${description}\n\n[Catchy tagline and exciting scenes]...`
  }

  try {
    const prompt = `Create a 30-second trailer script for:\nTitle: ${title}\n\nDescription: ${description}\n\nKey scenes: ${scenes.join(', ')}\n\nGenerate a compelling trailer script.`
    return await generateText(prompt)
  } catch (error) {
    console.error('Trailer generation error:', error)
    return '[Trailer script generation failed]'
  }
}

/**
 * Rewrite text with AI
 */
export async function rewriteText(original: string, instructions: string = 'improve clarity and flow'): Promise<string> {
  const client = getGeminiClient()
  
  if (!client) {
    return `[AI Rewrite] ${original} [Updated: ${instructions}]`
  }

  try {
    const prompt = `Rewrite the following to ${instructions}:\n\n${original}`
    return await generateText(prompt)
  } catch (error) {
    console.error('Rewrite error:', error)
    return original
  }
}

/**
 * Estimate cost for AI request (in USD)
 */
export function estimateCost(type: string, tokenCount: number): number {
  // TODO: Implement actual cost estimation based on Gemini pricing
  // Rough estimates:
  const costPer1kTokens = {
    'gemini-pro': 0.0005,
    'gemini-pro-vision': 0.001,
  }
  
  return (tokenCount / 1000) * costPer1kTokens['gemini-pro']
}

// Mock responses for local development
function mockGenerateText(prompt: string): string {
  return `[Mock AI Response]\n\n${prompt}\n\nThis is a placeholder response. Set GOOGLE_AI_API_KEY to use real AI generation.`
}

function mockShotlist(): ShotEntry[] {
  return [
    { camera: 'Wide shot', movement: 'Static', duration: '10s', notes: 'Establish location and mood' },
    { camera: 'Medium shot', movement: 'Pan', duration: '8s', notes: 'Introduce main character' },
    { camera: 'Close-up', movement: 'Static', duration: '5s', notes: 'Emotional moment' },
    { camera: 'Medium wide', movement: 'Dolly in', duration: '12s', notes: 'Climactic moment' },
  ]
}

