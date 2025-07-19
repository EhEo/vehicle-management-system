import { NextRequest, NextResponse } from 'next/server';
import { dailyReset } from '@/lib/reset';

export async function POST(request: NextRequest) {
  try {
    // Vercel cron job은 자동으로 Authorization 헤더를 설정하지 않음
    // 대신 cron-secret 헤더를 사용하거나 인증을 생략
    const cronSecret = request.headers.get('x-vercel-cron-secret') || 
                      request.headers.get('authorization')?.replace('Bearer ', '');
    
    // 프로덕션에서만 인증 확인 (Vercel의 자동 크론은 x-vercel-cron-secret 사용)
    if (process.env.NODE_ENV === 'production' && 
        cronSecret !== process.env.CRON_SECRET &&
        !request.headers.get('x-vercel-cron-secret')) {
      console.log('Cron auth failed - cronSecret:', cronSecret, 'expected:', process.env.CRON_SECRET);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentTime = new Date();
    console.log('Daily reset cron job started at:', currentTime.toISOString());
    console.log('Cron triggered at Vietnam time:', currentTime.toLocaleString('ko-KR', { timeZone: 'Asia/Ho_Chi_Minh' }));
    
    const result = await dailyReset();
    
    console.log('Daily reset cron job completed:', {
      success: result.success,
      message: result.message,
      ...(result.details && { details: result.details })
    });
    
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