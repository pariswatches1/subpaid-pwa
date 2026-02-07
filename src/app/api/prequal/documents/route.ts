import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getMockUserId } from '@/lib/db';

// GET /api/prequal/documents - List prequalification documents
export async function GET(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const docType = searchParams.get('type');

    const documents = await prisma.prequalDocument.findMany({
      where: {
        userId,
        ...(status ? { status } : {}),
        ...(docType ? { documentType: docType } : {}),
      },
      orderBy: { expirationDate: 'asc' },
    });

    const formattedDocs = documents.map(doc => ({
      id: doc.id,
      name: doc.name,
      documentType: doc.documentType,
      fileUrl: doc.fileUrl,
      expirationDate: doc.expirationDate?.toISOString().split('T')[0],
      status: doc.status,
      notes: doc.notes,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    }));

    return NextResponse.json({ documents: formattedDocs });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

// POST /api/prequal/documents - Upload new prequalification document
export async function POST(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const formData = await request.formData();

    const documentType = (formData.get('document_type') || formData.get('documentType')) as string;
    const name = formData.get('name') as string;
    const expirationDate = formData.get('expiration_date') || formData.get('expirationDate');
    const notes = formData.get('notes') as string | null;
    const file = formData.get('file') as File | null;

    // Validation
    if (!documentType) {
      return NextResponse.json({ error: 'Document type is required' }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json({ error: 'Document name is required' }, { status: 400 });
    }

    // In production, upload file to cloud storage
    let fileUrl = null;
    if (file) {
      fileUrl = `/uploads/prequal/${Date.now()}-${file.name}`;
    }

    // Calculate status based on expiration
    let status = 'valid';
    let expDate: Date | null = null;
    if (expirationDate) {
      expDate = new Date(expirationDate as string);
      const today = new Date();
      const daysUntilExpiry = Math.round((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntilExpiry < 0) {
        status = 'expired';
      } else if (daysUntilExpiry <= 30) {
        status = 'expiring_soon';
      }
    }

    const newDocument = await prisma.prequalDocument.create({
      data: {
        userId,
        name,
        documentType,
        fileUrl,
        expirationDate: expDate,
        status,
        notes,
      },
    });

    return NextResponse.json({
      document: {
        id: newDocument.id,
        name: newDocument.name,
        documentType: newDocument.documentType,
        fileUrl: newDocument.fileUrl,
        expirationDate: newDocument.expirationDate?.toISOString().split('T')[0],
        status: newDocument.status,
        notes: newDocument.notes,
        createdAt: newDocument.createdAt.toISOString(),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json({ error: 'Failed to upload document. Please try again.' }, { status: 500 });
  }
}
