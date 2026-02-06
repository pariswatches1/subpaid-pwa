import { NextRequest, NextResponse } from 'next/server';
import { KeywordResult } from '@/lib/keyword-types';
import { keywordsToCSV } from '@/lib/keyword-generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { keywords, filename } = body;

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json(
        { error: 'Keywords array is required' },
        { status: 400 }
      );
    }

    // Generate CSV content
    const csvContent = keywordsToCSV(keywords as KeywordResult[]);

    // Return CSV as downloadable file
    const response = new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename || 'keywords'}.csv"`,
      },
    });

    return response;
  } catch (error) {
    console.error('Error exporting keywords:', error);
    return NextResponse.json(
      { error: 'Failed to export keywords' },
      { status: 500 }
    );
  }
}
