import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 테스트용 cron job 호출
    const response = await fetch(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api/cron/daily-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CRON_SECRET}`,
      },
    });

    const result = await response.json();
    
    return NextResponse.json({
      success: true,
      cronResponse: result,
      status: response.status,
      timestamp: new Date().toISOString(),
      vietnamTime: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Ho_Chi_Minh' })
    });
  } catch (error) {
    console.error('Test cron error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Test cron failed', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Test cron endpoint',
    nextExecution: 'Every day at 22:00 UTC (05:00 Vietnam time)',
    currentTime: new Date().toISOString(),
    vietnamTime: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Ho_Chi_Minh' })
  });
}