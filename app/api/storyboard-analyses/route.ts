import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Save storyboard analysis
 * POST /api/storyboard-analyses
 */
export async function POST(req: NextRequest) {
  try {
    const { projectId, filename, fileUrl, overallDescription, scenes, metadata } = await req.json()

    console.log('💾 Saving storyboard analysis:', { projectId, filename, sceneCount: scenes?.length })

    if (!projectId || !filename || !scenes) {
      return NextResponse.json(
        { error: 'Missing required fields: projectId, filename, scenes' },
        { status: 400 }
      )
    }

    // TODO: Add authentication check

    // Check if analysis already exists for this project
    const { data: existing } = await supabase
      .from('storyboard_analyses')
      .select('id')
      .eq('project_id', projectId)
      .single()

    let result

    if (existing) {
      // Update existing analysis
      const { data, error } = await supabase
        .from('storyboard_analyses')
        .update({
          filename,
          file_url: fileUrl,
          overall_description: overallDescription,
          scenes,
          metadata,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      result = data
      console.log('✅ Updated existing analysis')
    } else {
      // Create new analysis
      const { data, error } = await supabase
        .from('storyboard_analyses')
        .insert({
          project_id: projectId,
          filename,
          file_url: fileUrl,
          overall_description: overallDescription,
          scenes,
          metadata
        })
        .select()
        .single()

      if (error) throw error
      result = data
      console.log('✅ Created new analysis')
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('❌ Save analysis error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save analysis' },
      { status: 500 }
    )
  }
}

/**
 * Get storyboard analysis for a project
 * GET /api/storyboard-analyses?project_id=xxx
 */
export async function GET(req: NextRequest) {
  try {
    const projectId = req.nextUrl.searchParams.get('project_id')

    if (!projectId) {
      return NextResponse.json(
        { error: 'Missing project_id' },
        { status: 400 }
      )
    }

    console.log('📥 Loading storyboard analysis for project:', projectId)

    // TODO: Add authentication and authorization

    const { data, error } = await supabase
      .from('storyboard_analyses')
      .select('*')
      .eq('project_id', projectId)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No analysis found
        return NextResponse.json(null)
      }
      throw error
    }

    console.log('✅ Loaded analysis:', data?.filename)

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('❌ Load analysis error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to load analysis' },
      { status: 500 }
    )
  }
}
