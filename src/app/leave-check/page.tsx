'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Employee, Vehicle, LeaveRecord, ExternalVehicle } from '@/types';
import { employeeService, vehicleService, leaveRecordService, externalVehicleService } from '@/lib/firestore';
import { UserIcon, CheckIcon } from '@heroicons/react/24/outline';
import VanIcon from '@/components/icons/VanIcon';
import CarIcon from '@/components/icons/CarIcon';

export default function LeaveCheckPage() {
  const router = useRouter();
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [externalVehicles, setExternalVehicles] = useState<ExternalVehicle[]>([]);
  const [workingEmployees, setWorkingEmployees] = useState<Employee[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedExternalVehicle, setSelectedExternalVehicle] = useState<ExternalVehicle | null>(null);
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [todayLeaveRecords, setTodayLeaveRecords] = useState<LeaveRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<LeaveRecord | null>(null);
  const [editEmployees, setEditEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    console.log('퇴근체크 페이지: 데이터 로딩 시작');
    
    const unsubscribeVehicles = vehicleService.onSnapshot((vehicles) => {
      console.log('차량 데이터:', vehicles);
      const available = vehicles.filter(v => v.status === 'available');
      console.log('가용 차량:', available);
      setAvailableVehicles(available);
    });

    const unsubscribeEmployees = employeeService.onSnapshot((employees) => {
      console.log('직원 데이터:', employees);
      const working = employees.filter(e => e.status === 'working');
      console.log('근무 중인 직원:', working);
      setWorkingEmployees(working);
      setLoading(false);
    });

    const unsubscribeExternalVehicles = externalVehicleService.onSnapshot((vehicles) => {
      console.log('외부차량 데이터:', vehicles);
      setExternalVehicles(vehicles);
    });

    const unsubscribeLeaveRecords = leaveRecordService.onSnapshot((records) => {
      const today = new Date().toISOString().split('T')[0];
      const todayRecords = records.filter(r => r.date === today && !r.isCompleted);
      setTodayLeaveRecords(todayRecords);
    });

    return () => {
      unsubscribeVehicles();
      unsubscribeEmployees();
      unsubscribeExternalVehicles();
      unsubscribeLeaveRecords();
    };
  }, []);

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setSelectedExternalVehicle(null);
    setSelectedEmployees([]);
  };

  const handleExternalVehicleSelect = (vehicle: ExternalVehicle) => {
    setSelectedExternalVehicle(vehicle);
    setSelectedVehicle(null);
    setSelectedEmployees([]);
  };

  const handleEmployeeToggle = (employee: Employee) => {
    setSelectedEmployees(prev => {
      const isSelected = prev.some(e => e.id === employee.id);
      if (isSelected) {
        return prev.filter(e => e.id !== employee.id);
      } else {
        return [...prev, employee];
      }
    });
  };

  const handleEditEmployeeToggle = (employee: Employee) => {
    setEditEmployees(prev => {
      const isSelected = prev.some(e => e.id === employee.id);
      if (isSelected) {
        return prev.filter(e => e.id !== employee.id);
      } else {
        return [...prev, employee];
      }
    });
  };

  const handleEditRecord = (record: LeaveRecord) => {
    setEditingRecord(record);
    setEditEmployees(record.employees.map(emp => {
      const fullEmployee = workingEmployees.find(e => e.id === emp.id);
      return fullEmployee || {
        id: emp.id,
        name: emp.name,
        department: emp.department,
        status: 'leaving' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }));
  };

  const handleSaveEdit = async () => {
    if (!editingRecord || editEmployees.length === 0) return;

    try {
      const updatedRecord = {
        ...editingRecord,
        employees: editEmployees.map(emp => ({
          id: emp.id,
          name: emp.name,
          department: emp.department
        }))
      };

      await leaveRecordService.update(editingRecord.id, updatedRecord);
      setEditingRecord(null);
      setEditEmployees([]);
    } catch (error) {
      console.error('Error updating leave record:', error);
      alert('레코드 수정 중 오류가 발생했습니다.');
    }
  };

  const handleCancelEdit = () => {
    setEditingRecord(null);
    setEditEmployees([]);
  };

  const handleSubmit = async () => {
    if ((!selectedVehicle && !selectedExternalVehicle) || selectedEmployees.length === 0) return;

    setSubmitting(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const leaveRecord: Omit<LeaveRecord, 'id' | 'createdAt' | 'updatedAt'> = {
        date: today,
        vehicleId: selectedVehicle?.id || selectedExternalVehicle?.id || '',
        vehicleName: selectedVehicle?.name || selectedExternalVehicle?.name || '',
        vehicleType: selectedVehicle ? 'company' : 'external',
        ...(selectedExternalVehicle && { externalVehicleType: selectedExternalVehicle.type }),
        employees: selectedEmployees.map(emp => ({
          id: emp.id,
          name: emp.name,
          department: emp.department,
        })),
        leaveTime: new Date(),
        isCompleted: false,
      };

      await leaveRecordService.create(leaveRecord);
      
      if (selectedVehicle) {
        await vehicleService.update(selectedVehicle.id, { status: 'in_use' });
      }
      
      for (const employee of selectedEmployees) {
        await employeeService.update(employee.id, { status: 'leaving' });
      }

      router.push('/');
    } catch (error) {
      console.error('Error creating leave record:', error);
      alert('퇴근 처리 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">퇴근 체크</h1>

          {/* 차량 선택 */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">차량 선택</h2>
              {(selectedVehicle || selectedExternalVehicle) && (
                <button
                  onClick={() => {
                    setSelectedVehicle(null);
                    setSelectedExternalVehicle(null);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  차량 변경
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {/* 회사 차량 목록 */}
              {availableVehicles
                .filter(vehicle => !selectedVehicle || vehicle.id === selectedVehicle.id)
                .map((vehicle) => (
                <button
                  key={vehicle.id}
                  onClick={() => handleVehicleSelect(vehicle)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedVehicle?.id === vehicle.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <VanIcon className="h-8 w-8 text-gray-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{vehicle.name}</h3>
                      <p className="text-sm text-gray-500">
                        {vehicle.driverName} ({vehicle.driverPhone})
                      </p>
                    </div>
                    {selectedVehicle?.id === vehicle.id && (
                      <CheckIcon className="h-5 w-5 text-blue-500 ml-auto" />
                    )}
                  </div>
                </button>
              ))}
              
              {/* 외부 차량 목록 */}
              {externalVehicles
                .filter(vehicle => !selectedExternalVehicle || vehicle.id === selectedExternalVehicle.id)
                .map((vehicle) => (
                <button
                  key={`external-${vehicle.id}`}
                  onClick={() => handleExternalVehicleSelect(vehicle)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedExternalVehicle?.id === vehicle.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <CarIcon className="h-8 w-8 text-gray-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{vehicle.name}</h3>
                      <p className="text-sm text-gray-500">
                        {vehicle.type === 'taxi' ? '택시' : vehicle.type === 'personal' ? '개인차량' : '기타'}
                      </p>
                    </div>
                    {selectedExternalVehicle?.id === vehicle.id && (
                      <CheckIcon className="h-5 w-5 text-blue-500 ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            
            {availableVehicles.length === 0 && externalVehicles.length === 0 && (
              <p className="text-gray-500 text-center py-8">사용 가능한 차량이 없습니다.</p>
            )}
          </div>

          {/* 직원 선택 */}
          {(selectedVehicle || selectedExternalVehicle) && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                탑승 인원 선택 ({selectedEmployees.length}명)
              </h2>
              {workingEmployees.length > 0 ? (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {workingEmployees.map((employee) => (
                    <button
                      key={employee.id}
                      onClick={() => handleEmployeeToggle(employee)}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        selectedEmployees.some(e => e.id === employee.id)
                          ? 'border-blue-500 bg-blue-100 text-blue-900'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-1">
                        <UserIcon className={`h-5 w-5 ${
                          selectedEmployees.some(e => e.id === employee.id)
                            ? 'text-blue-600'
                            : 'text-gray-600'
                        }`} />
                        <div>
                          <p className={`font-medium text-sm ${
                            selectedEmployees.some(e => e.id === employee.id)
                              ? 'text-blue-900'
                              : 'text-gray-900'
                          }`}>{employee.name}</p>
                          <p className={`text-xs ${
                            selectedEmployees.some(e => e.id === employee.id)
                              ? 'text-blue-700'
                              : 'text-gray-500'
                          }`}>{employee.department}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">근무 중인 직원이 없습니다.</p>
              )}
            </div>
          )}

          {/* 제출 버튼 */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              취소
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={(!selectedVehicle && !selectedExternalVehicle) || selectedEmployees.length === 0 || submitting}
              className={`px-6 py-3 rounded-lg font-medium ${
                (selectedVehicle || selectedExternalVehicle) && selectedEmployees.length > 0 && !submitting
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {submitting ? '처리 중...' : '퇴근 처리'}
            </button>
          </div>
        </div>

        {/* 오늘의 퇴근 현황 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">오늘의 퇴근 현황</h2>
          {todayLeaveRecords.length > 0 ? (
            <div className="space-y-3">
              {todayLeaveRecords.map((record) => (
                <div key={record.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {record.vehicleType === 'external' ? (
                        <CarIcon className="h-5 w-5 text-purple-600" />
                      ) : (
                        <VanIcon className="h-5 w-5 text-blue-600" />
                      )}
                      <span className="font-semibold text-gray-900">{record.vehicleName}</span>
                      <span className="text-sm text-gray-500">
                        ({record.employees.length}명)
                      </span>
                      {record.vehicleType === 'external' && (
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                          외부차량
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-sm text-gray-500">
                        {record.leaveTime.toLocaleTimeString('ko-KR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                      <button
                        onClick={() => handleEditRecord(record)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        수정
                      </button>
                    </div>
                  </div>
                  {editingRecord?.id === record.id ? (
                    <div className="ml-8 mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">탑승 인원 수정 ({editEmployees.length}명)</h4>
                      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-4">
                        {workingEmployees.concat(
                          record.employees
                            .filter(emp => !workingEmployees.some(w => w.id === emp.id))
                            .map(emp => ({
                              id: emp.id,
                              name: emp.name,
                              department: emp.department,
                              status: 'leaving' as const,
                              createdAt: new Date(),
                              updatedAt: new Date()
                            }))
                        ).map((employee) => (
                          <button
                            key={employee.id}
                            onClick={() => handleEditEmployeeToggle(employee)}
                            className={`p-2 rounded-lg border-2 transition-all text-center text-xs ${
                              editEmployees.some(e => e.id === employee.id)
                                ? 'border-blue-500 bg-blue-100 text-blue-900'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            <div className="flex flex-col items-center space-y-1">
                              <UserIcon className={`h-4 w-4 ${
                                editEmployees.some(e => e.id === employee.id)
                                  ? 'text-blue-600'
                                  : 'text-gray-600'
                              }`} />
                              <div>
                                <p className={`font-medium ${
                                  editEmployees.some(e => e.id === employee.id)
                                    ? 'text-blue-900'
                                    : 'text-gray-900'
                                }`}>{employee.name}</p>
                                <p className={`text-xs ${
                                  editEmployees.some(e => e.id === employee.id)
                                    ? 'text-blue-700'
                                    : 'text-gray-500'
                                }`}>{employee.department}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSaveEdit}
                          disabled={editEmployees.length === 0}
                          className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            editEmployees.length > 0
                              ? 'bg-blue-500 text-white hover:bg-blue-600'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          저장
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-300 text-gray-700 hover:bg-gray-400"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="ml-8">
                      <div className="flex flex-wrap gap-2">
                        {record.employees.map((employee, index) => (
                          <span 
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {employee.name} ({employee.department})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">오늘 퇴근 기록이 없습니다.</p>
          )}
        </div>
      </div>
  );
}