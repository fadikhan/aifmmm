import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Upload asset to Supabase Storage
 * POST /api/assets/upload
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const projectId = formData.get('project_id') as string
    const type = formData.get('type') as string

    console.log('📤 Upload request:', { filename: file?.name, projectId, type })

    if (!file || !projectId) {
      return NextResponse.json(
        { error: 'Missing required fields: file, project_id' },
        { status: 400 }
      )
    }

    // TODO: Add authentication check

    // Generate unique filename
    const filename = `${Date.now()}-${file.name}`
    const filePath = `${projectId}/${filename}`

    console.log('📁 Uploading to:', filePath)

    // Check if file is too large (optional - 100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 100MB.' },
        { status: 400 }
      )
    }

    // Upload to Supabase Storage
    const bucket = process.env.SUPABASE_BUCKET_ASSETS || 'aura-assets'
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file)

    if (error) {
      console.error('❌ Upload error:', error)
      return NextResponse.json(
        { error: `Upload failed: ${error.message}` },
        { status: 500 }
      )
    }

    console.log('✅ File uploaded successfully')

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    console.log('📎 Public URL:', urlData.publicUrl)

    // Save metadata to database
    const { data: asset, error: dbError } = await supabase
      .from('assets')
      .insert({
        project_id: projectId,
        storage_path: filePath,
        type: type || 'other',
        filename: file.name,
        size: file.size,
        mime_type: file.type,
        metadata: {},
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // TODO: Delete file from storage if DB insert fails
    }

    console.log('✅ Asset record created')

    return NextResponse.json({
      id: asset?.id,
      url: urlData.publicUrl,
      path: filePath,
      filename: file.name,
      size: file.size,
      type: type || 'other',
    })
  } catch (error: any) {
    console.error('Asset upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}

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

