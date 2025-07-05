'use client';

import { useState, useEffect } from 'react';
import { LeaveRecord } from '@/types';
import { leaveRecordService } from '@/lib/firestore';
import { CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import VanIcon from '@/components/icons/VanIcon';
import CarIcon from '@/components/icons/CarIcon';

export default function ReportsPage() {
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filteredRecords, setFilteredRecords] = useState<LeaveRecord[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const records = await leaveRecordService.getAll();
        setLeaveRecords(records);
        setFilteredRecords(records);
        
        const today = new Date();
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);
        
        setStartDate(oneWeekAgo.toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading reports:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!startDate || !endDate) {
      setFilteredRecords(leaveRecords.filter(record => !record.isCompleted));
      return;
    }

    const filtered = leaveRecords.filter(record => {
      return record.date >= startDate && record.date <= endDate && !record.isCompleted;
    });
    
    setFilteredRecords(filtered);
  }, [startDate, endDate, leaveRecords]);

  const getDateGroups = () => {
    const groups: { [key: string]: LeaveRecord[] } = {};
    
    filteredRecords.forEach(record => {
      if (!groups[record.date]) {
        groups[record.date] = [];
      }
      groups[record.date].push(record);
    });
    
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  };

  const getTotalStats = () => {
    const totalRecords = filteredRecords.length;
    const totalEmployees = filteredRecords.reduce((sum, record) => sum + record.employees.length, 0);
    const uniqueVehicles = new Set(filteredRecords.map(record => record.vehicleId)).size;
    
    return { totalRecords, totalEmployees, uniqueVehicles };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const stats = getTotalStats();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">일자별 사용 현황</h1>

          {/* 필터 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-gray-500" />
                <label className="text-sm font-medium text-gray-700">기간 선택:</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-500">~</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 통계 요약 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">총 퇴근 건수</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.totalRecords}건</p>
                </div>
                <VanIcon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">총 이용 인원</p>
                  <p className="text-2xl font-bold text-green-900">{stats.totalEmployees}명</p>
                </div>
                <UserGroupIcon className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">사용 차량</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.uniqueVehicles}대</p>
                </div>
                <VanIcon className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* 일자별 상세 내역 */}
          <div className="space-y-6">
            {getDateGroups().length > 0 ? (
              getDateGroups().map(([date, records]) => (
                <div key={date} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {formatDate(date)} <span className="text-blue-600 font-bold">({records.length}건)</span>
                  </h3>
                  
                  <div className="space-y-3">
                    {records.map((record) => (
                      <div key={record.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            {record.vehicleType === 'external' ? (
                              <CarIcon className="h-5 w-5 text-purple-600" />
                            ) : (
                              <VanIcon className="h-5 w-5 text-blue-600" />
                            )}
                            <span className="font-medium text-gray-900">
                              {record.vehicleName}
                            </span>
                            <span className="text-sm text-gray-800 font-medium">
                              {record.leaveTime.toLocaleTimeString('ko-KR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {record.vehicleType === 'external' && (
                              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                                외부차량
                              </span>
                            )}
                          </div>
                          <span className="text-sm text-gray-500">
                            {record.employees.length}명
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                          {record.employees.map((employee) => (
                            <span
                              key={employee.id}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {employee.name} ({employee.department})
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">선택한 기간에 퇴근 기록이 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}