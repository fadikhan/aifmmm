import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Export call sheet as PDF
 * POST /api/export/callsheet
 * 
 * TODO: Implement PDF generation with puppeteer or similar
 * For now, returns a stub response
 */
export async function POST(req: NextRequest) {
  try {
    const { projectId, date, location, cast, crew, schedule } = await req.json()

    if (!projectId) {
      return NextResponse.json(
        { error: 'Missing project_id' },
        { status: 400 }
      )
    }

    // TODO: Generate actual PDF using puppeteer or PDFKit
    // For now, return placeholder data
    
    const callsheet = {
      project_id: projectId,
      date,
      location,
      cast,
      crew,
      schedule,
      generated_at: new Date().toISOString(),
      version: '1.0',
    }

    // TODO: Implement PDF generation
    // const pdfBuffer = await generatePDF(callsheet)
    // return new Response(pdfBuffer, {
    //   headers: { 'Content-Type': 'application/pdf' }
    // })

    // For now, return JSON (in production, return PDF)
    return NextResponse.json({
      message: 'Call sheet generated (stub)',
      data: callsheet,
      note: 'PDF generation not yet implemented',
    })
  } catch (error: any) {
    console.error('Call sheet generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate call sheet' },
      { status: 500 }
    )
  }
}

