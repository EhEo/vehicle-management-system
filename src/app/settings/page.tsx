'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  UserGroupIcon, 
  TruckIcon, 
  ArrowPathIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const handleDailyReset = async () => {
    if (!confirm('일일 초기화를 실행하시겠습니까? 모든 차량과 직원의 상태가 초기화됩니다.')) {
      return;
    }

    setResetting(true);
    setResetMessage('');

    try {
      const response = await fetch('/api/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (result.success) {
        setResetMessage('일일 초기화가 완료되었습니다.');
      } else {
        setResetMessage(`오류: ${result.message}`);
      }
    } catch (error) {
      console.error('Reset error:', error);
      setResetMessage('초기화 중 오류가 발생했습니다.');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">설정</h1>

          {/* 기본 관리 메뉴 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link
              href="/employees"
              className="bg-blue-50 border border-blue-200 rounded-lg p-6 hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <UserGroupIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">직원 관리</h3>
                  <p className="text-gray-600">직원 정보 등록, 수정, 삭제</p>
                </div>
              </div>
            </Link>

            <Link
              href="/vehicles"
              className="bg-green-50 border border-green-200 rounded-lg p-6 hover:bg-green-100 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <TruckIcon className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">차량 관리</h3>
                  <p className="text-gray-600">차량 정보 등록, 수정, 삭제</p>
                </div>
              </div>
            </Link>
          </div>

          {/* 시스템 관리 */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">시스템 관리</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className="bg-yellow-100 p-3 rounded-full">
                  <ArrowPathIcon className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">일일 초기화</h3>
                  <p className="text-gray-600 mb-4">
                    모든 차량을 가용 상태로, 모든 직원을 근무 상태로 초기화합니다.
                    전날 퇴근 기록을 완료 처리합니다.
                  </p>
                  
                  <button
                    onClick={handleDailyReset}
                    disabled={resetting}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      resetting
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-yellow-500 text-white hover:bg-yellow-600'
                    }`}
                  >
                    {resetting ? '처리 중...' : '초기화 실행'}
                  </button>
                  
                  {resetMessage && (
                    <div className={`mt-3 p-3 rounded-lg ${
                      resetMessage.includes('완료') 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {resetMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 안내사항 */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <Cog6ToothIcon className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">사용 안내</h3>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• 일일 초기화는 매일 오전 5시에 자동으로 실행됩니다.</li>
                  <li>• 모든 차량이 퇴근 상태일 때도 자동으로 초기화됩니다.</li>
                  <li>• 수리중인 차량과 휴가중인 직원은 초기화에서 제외됩니다.</li>
                  <li>• 데이터는 Firebase에 실시간으로 저장됩니다.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}