import { NextResponse } from 'next/server';
import { dailyReset } from '@/lib/reset';

export async function POST() {
  try {
    console.log('Manual reset started at:', new Date().toISOString());
    
    const result = await dailyReset();
    
    console.log('Manual reset completed:', result);
    
    return NextResponse.json({
      success: true,
      message: '수동 초기화가 완료되었습니다.',
      data: result
    });
  } catch (error) {
    console.error('Manual reset error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: '수동 초기화 중 오류가 발생했습니다.',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: '수동 초기화 엔드포인트입니다. POST 요청을 사용하세요.' 
  });
}