import { NextResponse } from 'next/server';
import { employeeService, vehicleService } from '@/lib/firestore';

export async function GET() {
  try {
    const vehicles = await vehicleService.getAll();
    const employees = await employeeService.getAll();
    
    return NextResponse.json({
      vehicles: vehicles.map(v => ({ id: v.id, name: v.name, status: v.status })),
      employees: employees.map(e => ({ id: e.id, name: e.name, status: e.status })),
      summary: {
        availableVehicles: vehicles.filter(v => v.status === 'available').length,
        workingEmployees: employees.filter(e => e.status === 'working').length,
        totalVehicles: vehicles.length,
        totalEmployees: employees.length
      }
    });
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch debug data' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // 모든 차량을 가용 상태로 변경
    const vehicles = await vehicleService.getAll();
    for (const vehicle of vehicles) {
      if (vehicle.status !== 'available') {
        await vehicleService.update(vehicle.id, { status: 'available' });
      }
    }
    
    // 모든 직원을 근무 상태로 변경
    const employees = await employeeService.getAll();
    for (const employee of employees) {
      if (employee.status !== 'working') {
        await employeeService.update(employee.id, { status: 'working' });
      }
    }
    
    return NextResponse.json({ 
      message: '모든 차량과 직원 상태가 초기화되었습니다.',
      success: true 
    });
  } catch (error) {
    console.error('Reset API error:', error);
    return NextResponse.json(
      { error: 'Failed to reset data' },
      { status: 500 }
    );
  }
}