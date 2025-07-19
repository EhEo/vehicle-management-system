import { employeeService, vehicleService, leaveRecordService } from './firestore';

/**
 * 베트남 시간대(UTC+7) 기준으로 어제 날짜를 반환합니다.
 */
function getVietnamYesterday(): { date: string; vietnamNow: Date } {
  const vietnamNow = new Date();
  vietnamNow.setUTCHours(vietnamNow.getUTCHours() + 7); // UTC+7로 변환
  
  const yesterday = new Date(vietnamNow);
  yesterday.setDate(yesterday.getDate() - 1);
  
  return {
    date: yesterday.toISOString().split('T')[0],
    vietnamNow
  };
}

export async function dailyReset() {
  try {
    console.log('Starting daily reset...');
    
    // 베트남 시간 기준으로 어제 날짜 계산 (UTC+7)
    const { date: yesterdayString, vietnamNow } = getVietnamYesterday();
    
    console.log('Vietnam time:', vietnamNow.toLocaleString('ko-KR', { timeZone: 'Asia/Ho_Chi_Minh' }));
    console.log('Processing records for date:', yesterdayString);
    
    const vehicles = await vehicleService.getAll();
    const employees = await employeeService.getAll();
    const leaveRecords = await leaveRecordService.getAll();
    
    let processedRecords = 0;
    let resetVehicles = 0;
    let resetEmployees = 0;
    
    // 전날 퇴근 기록들을 완료 처리
    for (const record of leaveRecords) {
      if (record.date === yesterdayString && !record.isCompleted) {
        await leaveRecordService.update(record.id, { isCompleted: true });
        processedRecords++;
        console.log(`Completed leave record for ${record.date}: ${record.employees?.join(', ')}`);
      }
    }
    
    // 퇴근한(사용중인) 차량을 가용 상태로 변경 (외근, 수리중 제외)
    for (const vehicle of vehicles) {
      if (vehicle.status === 'in_use') {
        await vehicleService.update(vehicle.id, { status: 'available' });
        resetVehicles++;
        console.log(`Reset vehicle to available: ${vehicle.name}`);
      }
    }
    
    // 퇴근 상태인 직원을 근무 상태로 변경 (휴가, 출장, 외근 제외)
    for (const employee of employees) {
      if (employee.status === 'leaving') {
        await employeeService.update(employee.id, { status: 'working' });
        resetEmployees++;
        console.log(`Reset employee to working: ${employee.name}`);
      }
    }
    
    const message = `일일 초기화가 완료되었습니다. 처리된 항목: 퇴근기록 ${processedRecords}개, 차량 ${resetVehicles}대, 직원 ${resetEmployees}명 (날짜: ${yesterdayString})`;
    console.log('Daily reset completed successfully:', message);
    
    return { 
      success: true, 
      message,
      details: {
        processedDate: yesterdayString,
        processedRecords,
        resetVehicles,
        resetEmployees,
        vietnamTime: vietnamNow.toLocaleString('ko-KR', { timeZone: 'Asia/Ho_Chi_Minh' })
      }
    };
  } catch (error) {
    console.error('Error during daily reset:', error);
    return { success: false, message: '일일 초기화 중 오류가 발생했습니다.' };
  }
}

export async function checkAllVehiclesInUse(): Promise<boolean> {
  try {
    const vehicles = await vehicleService.getAll();
    const availableVehicles = vehicles.filter(v => v.status === 'available');
    
    return availableVehicles.length === 0 && vehicles.length > 0;
  } catch (error) {
    console.error('Error checking vehicles status:', error);
    return false;
  }
}