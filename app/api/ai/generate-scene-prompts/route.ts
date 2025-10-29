import { NextRequest, NextResponse } from 'next/server'
import { generateText } from '@/lib/aiClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Generate image and video prompts for a specific scene
 * POST /api/ai/generate-scene-prompts
 */
export async function POST(req: NextRequest) {
  try {
    const { 
      sceneNumber, 
      sceneTitle, 
      sceneDescription, 
      location, 
      timeOfDay, 
      characters,
      projectId 
    } = await req.json()

    console.log(`🎬 Generating prompts for Scene ${sceneNumber}: ${sceneTitle}`)

    if (!sceneTitle || !sceneDescription) {
      return NextResponse.json(
        { error: 'Missing required fields: sceneTitle, sceneDescription' },
        { status: 400 }
      )
    }

    // Build context for the scene
    const sceneContext = `
Scene ${sceneNumber}: ${sceneTitle}
Description: ${sceneDescription}
${location ? `Location: ${location}` : ''}
${timeOfDay ? `Time of Day: ${timeOfDay}` : ''}
${characters && characters.length > 0 ? `Characters: ${characters.join(', ')}` : ''}
`

    const prompt = `You are a professional cinematographer and AI prompt engineer. Generate highly detailed prompts for this film scene:

${sceneContext}

Generate TWO prompts:

1. IMAGE GENERATION PROMPT (for DALL-E, Midjourney, or Stable Diffusion):
   - Describe the visual composition, lighting, camera angle, mood
   - Include specific details about characters, setting, atmosphere
   - Use cinematic terminology
   - 2-3 sentences, highly descriptive

2. VIDEO GENERATION PROMPT (for RunwayML, Pika, or similar):
   - Describe camera movement, action, pacing
   - Include visual style, motion, transitions
   - Specify duration and key moments
   - 2-3 sentences, action-focused

Respond in JSON format:
{
  "imagePrompt": "Detailed image generation prompt here...",
  "videoPrompt": "Detailed video generation prompt here..."
}

Make the prompts specific to THIS scene, not generic.`

    // Generate prompts using AI
    const response = await generateText(prompt)
    console.log('🤖 AI Response:', response)

    // Parse JSON from response
    let prompts
    try {
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/) || response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const jsonStr = jsonMatch[1] || jsonMatch[0]
        prompts = JSON.parse(jsonStr)
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('Failed to parse AI response, creating fallback prompts')
      
      // Fallback prompts based on scene details
      prompts = {
        imagePrompt: `Cinematic ${timeOfDay || 'daytime'} shot of ${sceneTitle.toLowerCase()}, ${location || 'interior scene'}, ${sceneDescription.substring(0, 100)}. Professional film production, dramatic lighting, ${characters && characters.length > 0 ? `featuring ${characters.join(' and ')}` : 'character-driven composition'}, wide angle lens, high detail, 4K quality`,
        videoPrompt: `${timeOfDay || 'Daytime'} video sequence: ${sceneTitle}, ${sceneDescription.substring(0, 100)}. Smooth camera movement, ${location ? `establishing ${location}` : 'interior tracking shot'}, professional cinematography, natural motion, 24fps, cinematic color grading, ${characters && characters.length > 0 ? `focusing on ${characters[0]}` : 'atmospheric establishing shot'}`
      }
    }

    console.log('✅ Prompts generated successfully')

    // TODO: Save prompts to database
    // TODO: Track AI usage

    return NextResponse.json({
      imagePrompt: prompts.imagePrompt || prompts.image_prompt || 'Image prompt not available',
      videoPrompt: prompts.videoPrompt || prompts.video_prompt || 'Video prompt not available',
      sceneNumber,
      sceneTitle
    })
  } catch (error: any) {
    console.error('❌ Scene prompt generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate prompts' },
      { status: 500 }
    )
  }
}
