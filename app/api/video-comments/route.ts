import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Save video comment
 * POST /api/video-comments
 */
export async function POST(req: NextRequest) {
  try {
    const { assetId, projectId, userName, userColor, timestampSeconds, commentText } = await req.json()

    console.log('💬 Saving video comment:', { assetId, userName, timestamp: timestampSeconds })

    if (!assetId || !projectId || !userName || !commentText) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('video_comments')
      .insert({
        asset_id: assetId,
        project_id: projectId,
        user_name: userName,
        user_color: userColor,
        timestamp_seconds: timestampSeconds,
        comment_text: commentText
      })
      .select()
      .single()

    if (error) throw error

    console.log('✅ Comment saved')

    return NextResponse.json({
      id: data.id,
      timestamp: data.timestamp_seconds,
      text: data.comment_text,
      author: data.user_name,
      authorColor: data.user_color,
      createdAt: data.created_at
    })
  } catch (error: any) {
    console.error('❌ Save comment error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save comment' },
      { status: 500 }
    )
  }
}

/**
 * Get video comments
 * GET /api/video-comments?asset_id=xxx
 */
export async function GET(req: NextRequest) {
  try {
    const assetId = req.nextUrl.searchParams.get('asset_id')

    if (!assetId) {
      return NextResponse.json(
        { error: 'Missing asset_id' },
        { status: 400 }
      )
    }

    console.log('📥 Loading comments for asset:', assetId)

    const { data, error } = await supabase
      .from('video_comments')
      .select('*')
      .eq('asset_id', assetId)
      .order('timestamp_seconds', { ascending: true })

    if (error) throw error

    console.log('✅ Loaded comments:', data?.length || 0)

    const comments = data?.map(comment => ({
      id: comment.id,
      timestamp: comment.timestamp_seconds,
      text: comment.comment_text,
      author: comment.user_name,
      authorColor: comment.user_color,
      createdAt: comment.created_at
    }))

    return NextResponse.json(comments || [])
  } catch (error: any) {
    console.error('❌ Load comments error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to load comments' },
      { status: 500 }
    )
  }
}
