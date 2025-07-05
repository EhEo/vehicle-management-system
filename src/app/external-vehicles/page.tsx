'use client';

import { useState, useEffect } from 'react';
import { ExternalVehicle } from '@/types';
import { externalVehicleService } from '@/lib/firestore';
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

export default function ExternalVehiclesPage() {
  const [externalVehicles, setExternalVehicles] = useState<ExternalVehicle[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<ExternalVehicle | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    type: 'taxi' as 'taxi' | 'personal' | 'external',
    name: ''
  });

  useEffect(() => {
    const unsubscribe = externalVehicleService.onSnapshot((vehicles) => {
      setExternalVehicles(vehicles);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      if (editingVehicle) {
        await externalVehicleService.update(editingVehicle.id, formData);
        setEditingVehicle(null);
      } else {
        await externalVehicleService.create(formData);
        setShowAddForm(false);
      }
      
      setFormData({ type: 'taxi', name: '' });
    } catch (error) {
      console.error('Error saving external vehicle:', error);
      alert('저장 중 오류가 발생했습니다.');
    }
  };

  const handleEdit = (vehicle: ExternalVehicle) => {
    setEditingVehicle(vehicle);
    setFormData({ type: vehicle.type, name: vehicle.name });
    setShowAddForm(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`'${name}'을(를) 삭제하시겠습니까?`)) return;

    try {
      await externalVehicleService.delete(id);
    } catch (error) {
      console.error('Error deleting external vehicle:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const cancelEdit = () => {
    setEditingVehicle(null);
    setShowAddForm(false);
    setFormData({ type: 'taxi', name: '' });
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'taxi': return '택시';
      case 'personal': return '개인차량';
      case 'external': return '기타';
      default: return type;
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">외부차량 관리</h1>
            <button
              onClick={() => {
                setShowAddForm(true);
                setEditingVehicle(null);
                setFormData({ type: 'taxi', name: '' });
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>외부차량 추가</span>
            </button>
          </div>

          {/* 추가/편집 폼 */}
          {(showAddForm || editingVehicle) && (
            <div className="mb-6 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                {editingVehicle ? '외부차량 편집' : '새 외부차량 추가'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    차량 타입
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as 'taxi' | 'personal' | 'external' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="taxi">택시</option>
                    <option value="personal">개인차량</option>
                    <option value="external">기타</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    차량명
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="예: 택시, 개인차량(홍길동), 외부차량"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    {editingVehicle ? '수정' : '추가'}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 외부차량 목록 */}
          <div className="space-y-4">
            {externalVehicles.length > 0 ? (
              externalVehicles.map((vehicle) => (
                <div key={vehicle.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <PlusIcon className="h-8 w-8 text-gray-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{vehicle.name}</h3>
                        <p className="text-sm text-gray-500">{getTypeLabel(vehicle.type)}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(vehicle)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="편집"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle.id, vehicle.name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="삭제"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <PlusIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-4">등록된 외부차량이 없습니다</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
                >
                  첫 번째 외부차량 추가하기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}