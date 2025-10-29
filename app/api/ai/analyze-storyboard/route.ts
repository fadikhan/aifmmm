import { NextRequest, NextResponse } from 'next/server'
import { generateText } from '@/lib/aiClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Analyze storyboard and generate AI prompts
 * POST /api/ai/analyze-storyboard
 */
export async function POST(req: NextRequest) {
  try {
    const { imageUrl, filename, fileType, projectId } = await req.json()

    console.log('🎨 Analyzing storyboard:', { filename, fileType })

    if (!filename) {
      return NextResponse.json(
        { error: 'Missing required field: filename' },
        { status: 400 }
      )
    }

    // TODO: Add authentication check
    // TODO: Add rate limiting

    // For images, we can analyze visually (future: use Gemini Vision)
    // For now, generate based on filename and context
    const isImage = fileType?.startsWith('image/')
    const isPDF = fileType?.includes('pdf')
    const isDoc = filename.endsWith('.docx')

    let analysisPrompt = ''

    if (isImage) {
      analysisPrompt = `You are analyzing a storyboard image for a film project. The file is named "${filename}".
      
Based on typical storyboard conventions, generate:
1. A detailed scene description (2-3 sentences)
2. An image generation prompt optimized for DALL-E or Stable Diffusion
3. A video generation prompt optimized for RunwayML or Pika
4. Metadata including tone, mood, and visual style

Respond in JSON format:
{
  "sceneDescription": "...",
  "imagePrompt": "...",
  "videoPrompt": "...",
  "metadata": {
    "tones": ["cinematic", "moody"],
    "mood": "...",
    "visualStyle": "..."
  }
}`
    } else if (isPDF || isDoc) {
      analysisPrompt = `You are analyzing a complete film script document named "${filename}".

Your task is to break down this script into 10-15 distinct scenes.

Generate:
1. A comprehensive overview of the full story (2-3 sentences)
2. A list of 10-15 individual scenes with:
   - Scene number (1, 2, 3, etc.)
   - Scene title (short, descriptive)
   - Brief description (1-2 sentences about what happens)
   - Location (where it takes place)
   - Time of day (morning, afternoon, evening, night, etc.)
   - Key characters involved (list of character names)

Respond in JSON format:
{
  "sceneDescription": "Overall story summary...",
  "scenes": [
    {
      "number": 1,
      "title": "Opening Scene Title",
      "description": "What happens in this scene...",
      "location": "Location name",
      "timeOfDay": "Time of day",
      "characters": ["Character 1", "Character 2"]
    }
  ],
  "metadata": {
    "tones": ["dramatic", "suspenseful"],
    "mood": "overall mood",
    "visualStyle": "visual style description",
    "totalScenes": 10
  }
}

IMPORTANT: 
- Generate 10-15 scenes minimum
- Each scene should be distinct and sequential
- Do NOT generate image/video prompts yet (those will be generated per scene later)`
    } else {
      analysisPrompt = `Generate a creative scene description and AI prompts for a storyboard file named "${filename}".`
    }

    // Generate analysis using AI
    const response = await generateText(analysisPrompt)

    console.log('🤖 AI Response:', response)

    // Try to parse JSON from response
    let analysis
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0]
        analysis = JSON.parse(jsonStr)
      } else {
        // If no JSON found, create a structured response
        analysis = {
          sceneDescription: response.split('\n')[0] || 'A cinematic scene captured in this storyboard.',
          imagePrompt: `Cinematic storyboard frame, ${filename}, professional film production, detailed composition, dramatic lighting`,
          videoPrompt: `Cinematic video sequence based on ${filename}, smooth camera movement, professional cinematography, 4K quality`,
          metadata: {
            tones: ['cinematic', 'professional'],
            mood: 'dramatic',
            visualStyle: 'realistic'
          }
        }
      }
    } catch (parseError) {
      console.error('Failed to parse AI response, using fallback')
      // Fallback response
      analysis = {
        sceneDescription: `A storyboard scene from ${filename}. This frame captures a key moment in the narrative with careful composition and visual storytelling.`,
        imagePrompt: `Professional storyboard illustration, ${filename.replace(/\.[^/.]+$/, '')}, cinematic composition, detailed sketch, film production quality, dramatic lighting, wide angle`,
        videoPrompt: `Cinematic video sequence, ${filename.replace(/\.[^/.]+$/, '')}, smooth camera movement, professional cinematography, establishing shot, 24fps, film grain, color graded`,
        metadata: {
          tones: ['cinematic', 'dramatic', 'professional'],
          mood: 'engaging',
          visualStyle: 'realistic film production'
        }
      }
    }

    // Format the response
    const result = {
      sceneDescription: analysis.sceneDescription || analysis.description || 'Scene description not available',
      scenes: analysis.scenes || [], // Array of individual scenes
      prompts: {
        imagePrompt: analysis.imagePrompt || analysis.image_prompt || 'Image prompt not available',
        videoPrompt: analysis.videoPrompt || analysis.video_prompt || 'Video prompt not available',
        metadata: analysis.metadata || {
          tones: ['cinematic'],
          mood: 'dramatic',
          visualStyle: 'realistic'
        }
      }
    }

    console.log('✅ Analysis complete')

    // TODO: Save analysis to database
    // TODO: Track AI usage

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('❌ Storyboard analysis error:', error)
    return NextResponse.json(
      { error: error.message || 'Analysis failed' },
      { status: 500 }
    )
  }
}
