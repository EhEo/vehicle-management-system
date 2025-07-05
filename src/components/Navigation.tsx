'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  CogIcon,
  TruckIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const Navigation = () => {
  const pathname = usePathname();
  
  const menuItems = [
    { href: '/', label: '대시보드', icon: HomeIcon },
    { href: '/leave-check', label: '퇴근 체크', icon: ClipboardDocumentListIcon },
    { href: '/reports', label: '사용 현황', icon: ChartBarIcon },
    { href: '/vehicles', label: '차량 관리', icon: TruckIcon },
    { href: '/employees', label: '직원 관리', icon: UserGroupIcon },
    { href: '/settings', label: '설정', icon: CogIcon },
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <TruckIcon className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">차량관리시스템</span>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          
          {/* 모바일 메뉴 */}
          <div className="md:hidden">
            <select
              value={pathname}
              onChange={(e) => window.location.href = e.target.value}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              {menuItems.map((item) => (
                <option key={item.href} value={item.href}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;