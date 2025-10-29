import { NextRequest, NextResponse } from 'next/server'
import { generateText, generateShotlist, generateStoryboard, summarizeText, rewriteText } from '@/lib/aiClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { type, prompt, context, projectId, sceneId } = await req.json()

    if (!type || !prompt) {
      return NextResponse.json(
        { error: 'Missing required fields: type, prompt' },
        { status: 400 }
      )
    }

    // TODO: Add rate limiting here
    // TODO: Add authentication check
    // TODO: Log request to ai_requests table

    let result: string | any

    switch (type) {
      case 'generate':
      case 'scene':
        result = await generateText(
          context 
            ? `Context: ${context}\n\nUser prompt: ${prompt}`
            : prompt
        )
        break

      case 'shotlist':
        if (!context) {
          return NextResponse.json(
            { error: 'Shotlist generation requires context (scene text)' },
            { status: 400 }
          )
        }
        result = await generateShotlist(context)
        break

      case 'storyboard':
        if (!context) {
          return NextResponse.json(
            { error: 'Storyboard generation requires context (scene text)' },
            { status: 400 }
          )
        }
        result = await generateStoryboard(context, 4)
        break

      case 'summarize':
        if (!context) {
          return NextResponse.json(
            { error: 'Summarization requires context' },
            { status: 400 }
          )
        }
        result = await summarizeText(context)
        break

      case 'rewrite':
        if (!context) {
          return NextResponse.json(
            { error: 'Rewrite requires context' },
            { status: 400 }
          )
        }
        result = await rewriteText(context, prompt)
        break

      default:
        return NextResponse.json(
          { error: `Unknown type: ${type}` },
          { status: 400 }
        )
    }

    // TODO: Persist request and response to ai_requests table
    // TODO: Add cost estimation
    // TODO: Store generated images (storyboard) to Supabase Storage

    return NextResponse.json({
      type,
      content: result,
      model: process.env.GOOGLE_AI_API_KEY ? 'gemini-pro' : 'mock',
      generated_at: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('AI generation error:', error)
    return NextResponse.json(
      { error: error.message || 'AI generation failed' },
      { status: 500 }
    )
  }
}

