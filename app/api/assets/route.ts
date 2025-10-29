import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * List assets for a project
 * GET /api/assets?project_id=xxx&type=video
 */
export async function GET(req: NextRequest) {
  try {
    const projectId = req.nextUrl.searchParams.get('project_id')
    const type = req.nextUrl.searchParams.get('type')

    if (!projectId) {
      return NextResponse.json(
        { error: 'Missing project_id' },
        { status: 400 }
      )
    }

    console.log('📥 Fetching assets:', { projectId, type })

    // TODO: Add authentication and authorization

    let query = supabase
      .from('assets')
      .select('*')
      .eq('project_id', projectId)

    // Filter by type if provided
    if (type) {
      query = query.eq('type', type)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Fetch error:', error)
      throw error
    }

    console.log('✅ Found assets:', data?.length || 0)
    console.log('📋 Assets data:', JSON.stringify(data, null, 2))

    // Get public URLs for each asset
    const bucket = process.env.SUPABASE_BUCKET_ASSETS || 'aura-assets'
    const assetsWithUrls = data?.map(asset => {
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(asset.storage_path)

      return {
        id: asset.id,
        name: asset.filename,
        url: urlData.publicUrl,
        uploaded_at: asset.created_at,
        type: asset.type,
        size: asset.size,
        mime_type: asset.mime_type
      }
    })

    return NextResponse.json(assetsWithUrls || [])
  } catch (error: any) {
    console.error('Assets fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assets' },
      { status: 500 }
    )
  }
}
