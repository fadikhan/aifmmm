import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Update scenes for a project
 * POST /api/scenes
 */
export async function POST(req: NextRequest) {
  try {
    const { projectId, scenes } = await req.json()

    if (!projectId || !scenes) {
      return NextResponse.json(
        { error: 'Missing projectId or scenes' },
        { status: 400 }
      )
    }

    console.log('💾 Saving scenes for project:', projectId, 'Count:', scenes.length)

    // Delete existing scenes for this project
    await supabase
      .from('scenes')
      .delete()
      .eq('project_id', projectId)

    // Insert new scenes
    const scenesToInsert = scenes.map((scene: any, index: number) => ({
      project_id: projectId,
      title: scene.title,
      content: scene.content,
      order_index: scene.order_index !== undefined ? scene.order_index : index,
      created_at: scene.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))

    const { data, error } = await supabase
      .from('scenes')
      .insert(scenesToInsert)
      .select()

    if (error) throw error

    console.log('✅ Saved', data.length, 'scenes')

    return NextResponse.json({ success: true, scenes: data })
  } catch (error: any) {
    console.error('❌ Save scenes error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save scenes' },
      { status: 500 }
    )
  }
}
