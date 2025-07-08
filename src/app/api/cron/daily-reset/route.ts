import { NextRequest, NextResponse } from 'next/server';
import { dailyReset } from '@/lib/reset';

export async function POST(request: NextRequest) {
  try {
    // Vercel cron job 인증 확인 (개발환경에서는 생략)
    const authHeader = request.headers.get('authorization');
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;
    
    if (process.env.NODE_ENV === 'production' && authHeader !== expectedAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Daily reset cron job started at:', new Date().toISOString());
    
    const result = await dailyReset();
    
    console.log('Daily reset cron job completed:', result);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Daily reset cron job error:', error);
    return NextResponse.json(
      { success: false, message: 'Daily reset failed', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Daily reset cron endpoint' });
}