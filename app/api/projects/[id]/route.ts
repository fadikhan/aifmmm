import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // TODO: Add authentication and access control

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single()

    if (projectError) throw projectError

    // Fetch related data
    const [scenes, blocks, tasks] = await Promise.all([
      supabase
        .from('scenes')
        .select('*')
        .eq('project_id', id)
        .order('order_index'),
      supabase
        .from('project_blocks')
        .select('*')
        .eq('project_id', id)
        .order('order_index'),
      supabase
        .from('tasks')
        .select('*')
        .eq('project_id', id)
        .order('created_at'),
    ])

    return NextResponse.json({
      ...project,
      scenes: scenes.data || [],
      blocks: blocks.data || [],
      tasks: tasks.data || [],
    })
  } catch (error: any) {
    console.error('Project fetch error:', error)
    return NextResponse.json(
      { error: 'Project not found' },
      { status: 404 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await req.json()

    // TODO: Add authentication and authorization

    const { data, error } = await supabase
      .from('projects')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Project update error:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // TODO: Add authentication and authorization

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Project deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}

