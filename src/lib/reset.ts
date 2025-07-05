import { employeeService, vehicleService, leaveRecordService } from './firestore';

export async function dailyReset() {
  try {
    console.log('Starting daily reset...');
    
    const vehicles = await vehicleService.getAll();
    const employees = await employeeService.getAll();
    const leaveRecords = await leaveRecordService.getAll();
    
    const today = new Date().toISOString().split('T')[0];
    
    // 당일 퇴근 기록들을 완료 처리하거나 삭제
    for (const record of leaveRecords) {
      if (record.date === today && !record.isCompleted) {
        await leaveRecordService.update(record.id, { isCompleted: true });
      }
    }
    
    // 모든 차량을 가용 상태로 변경
    for (const vehicle of vehicles) {
      if (vehicle.status === 'in_use') {
        await vehicleService.update(vehicle.id, { status: 'available' });
      }
    }
    
    // 모든 직원을 근무 상태로 변경
    for (const employee of employees) {
      if (employee.status === 'leaving') {
        await employeeService.update(employee.id, { status: 'working' });
      }
    }
    
    console.log('Daily reset completed successfully');
    return { success: true, message: '일일 초기화가 완료되었습니다. 당일 퇴근 기록이 완료 처리되었습니다.' };
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