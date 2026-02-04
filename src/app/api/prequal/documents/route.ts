import { NextRequest, NextResponse } from 'next/server';
import { mockDb, generateId, getMockUserId } from '@/lib/db';

// GET /api/prequal/documents - List prequalification documents
export async function GET(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const docType = searchParams.get('type');

    let documents = mockDb.prequalDocuments.filter(doc => doc.userId === userId);

    if (status) {
      documents = documents.filter(doc => doc.status === status);
    }

    if (docType) {
      documents = documents.filter(doc => doc.documentType === docType);
    }

    // Sort by expiration date ascending (soonest expiring first)
    documents.sort((a, b) => {
      if (!a.expirationDate) return 1;
      if (!b.expirationDate) return -1;
      return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
    });

    return NextResponse.json(documents);
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

    const documentType = formData.get('document_type') || formData.get('documentType');
    const name = formData.get('name');
    const expirationDate = formData.get('expiration_date') || formData.get('expirationDate');
    const file = formData.get('file') as File | null;

    // Validation
    if (!documentType) {
      return NextResponse.json(
        { error: 'Document type is required' },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: 'Document name is required' },
        { status: 400 }
      );
    }

    // In production, upload file to cloud storage
    let fileUrl = null;
    let fileSize = null;
    if (file) {
      // await uploadToStorage(file);
      fileUrl = `/uploads/prequal/${generateId()}-${file.name}`;
      fileSize = file.size;
    }

    // Calculate status based on expiration
    let status = 'valid';
    if (expirationDate) {
      const expDate = new Date(expirationDate as string);
      const today = new Date();
      const daysUntilExpiry = Math.round((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntilExpiry < 0) {
        status = 'expired';
      } else if (daysUntilExpiry <= 30) {
        status = 'expiring_soon';
      }
    }

    const newDocument = {
      id: generateId(),
      name: name as string,
      documentType: documentType as string,
      expirationDate: expirationDate ? (expirationDate as string) : null,
      fileUrl,
      fileSize,
      status,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockDb.prequalDocuments.push(newDocument);

    return NextResponse.json(newDocument, { status: 201 });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: 'Failed to upload document. Please try again.' },
      { status: 500 }
    );
  }
}
