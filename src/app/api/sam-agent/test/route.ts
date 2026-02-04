import { NextRequest, NextResponse } from 'next/server';
import { getMockUserId } from '@/lib/db';

// POST /api/sam-agent/test - Test SAM Agent with a call
export async function POST(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const body = await request.json();

    const { testPhone, test_phone, scriptId, script_id } = body;
    const phone = testPhone || test_phone;
    const script = scriptId || script_id || 'default';

    if (!phone) {
      return NextResponse.json(
        { error: 'Test phone number is required' },
        { status: 400 }
      );
    }

    // Validate phone format (basic validation)
    const phoneClean = phone.replace(/[^0-9]/g, '');
    if (phoneClean.length < 10) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // In production, initiate test call immediately
    // await initiateVoiceCall({
    //   phoneNumber: phone,
    //   scriptId: script,
    //   isTest: true
    // });

    return NextResponse.json({
      success: true,
      message: 'Test call initiated. You should receive a call shortly.',
      testPhone: phone,
      scriptId: script,
      estimatedWaitTime: '30-60 seconds',
    });
  } catch (error) {
    console.error('Error initiating test call:', error);
    return NextResponse.json(
      { error: 'Failed to initiate test call' },
      { status: 500 }
    );
  }
}
