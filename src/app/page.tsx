'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Employee, Vehicle } from '@/types';
import { employeeService, vehicleService } from '@/lib/firestore';
import { 
  TruckIcon, 
  UserGroupIcon, 
  ClipboardDocumentListIcon, 
  ChartBarIcon,
  CogIcon 
} from '@heroicons/react/24/outline';

export default function Home() {
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [workingEmployees, setWorkingEmployees] = useState<Employee[]>([]);
  const [allVehicles, setAllVehicles] = useState<Vehicle[]>([]);
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeVehicles = vehicleService.onSnapshot((vehicles) => {
      setAllVehicles(vehicles);
      setAvailableVehicles(vehicles.filter(v => v.status === 'available'));
    });

    const unsubscribeEmployees = employeeService.onSnapshot((employees) => {
      setAllEmployees(employees);
      setWorkingEmployees(employees.filter(e => e.status === 'working'));
      setLoading(false);
    });

    return () => {
      unsubscribeVehicles();
      unsubscribeEmployees();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">차량관리 시스템</h1>
          <p className="text-gray-600">효율적인 차량 운영을 위한 통합 관리 시스템</p>
        </div>

        {/* 상태 요약 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-center">
              <TruckIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-green-600 text-sm font-medium">가용차량</p>
              <p className="text-2xl font-bold text-green-900">{availableVehicles.length}대</p>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-center">
              <UserGroupIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-blue-600 text-sm font-medium">잔류인원</p>
              <p className="text-2xl font-bold text-blue-900">{workingEmployees.length}명</p>
            </div>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="text-center">
              <TruckIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-orange-600 text-sm font-medium">퇴근차량</p>
              <p className="text-2xl font-bold text-orange-900">{allVehicles.filter(v => v.status === 'in_use').length}대</p>
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="text-center">
              <UserGroupIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-purple-600 text-sm font-medium">퇴근직원</p>
              <p className="text-2xl font-bold text-purple-900">{allEmployees.filter(e => e.status === 'leaving').length}명</p>
            </div>
          </div>
        </div>


        {/* 메인 메뉴 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/leave-check" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <ClipboardDocumentListIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">퇴근 체크</h3>
                <p className="text-gray-600">차량별 퇴근 인원 등록</p>
              </div>
            </div>
          </Link>

          <Link href="/reports" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <ChartBarIcon className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">사용 현황</h3>
                <p className="text-gray-600">일자별 차량 사용 조회</p>
              </div>
            </div>
          </Link>

          <Link href="/settings" className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <CogIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">설정</h3>
                <p className="text-gray-600">직원 및 차량 관리</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
  );
}
