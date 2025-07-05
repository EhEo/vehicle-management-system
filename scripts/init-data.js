// Firebase 초기 데이터 설정 스크립트
// Node.js 환경에서 실행하여 초기 데이터를 Firestore에 추가

const admin = require('firebase-admin');

// Firebase Admin SDK 초기화
// 서비스 계정 키 파일 필요
const serviceAccount = require('./service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'vehicle-management-a0105'
});

const db = admin.firestore();

// 초기 데이터
const initialData = {
  employees: [
    { name: '최병윤', department: '법인장', status: 'working' },
    { name: '이충재', department: '개발팀', status: 'working' },
    { name: '김석기', department: '관리팀', status: 'working' },
    { name: '고진석', department: '품질팀', status: 'working' },
    { name: '임재홍', department: '관리팀', status: 'working' },
    { name: '연동일', department: '생산팀', status: 'working' },
    { name: '임성조', department: '생산팀', status: 'working' },
    { name: '김도근', department: '개발팀', status: 'working' },
    { name: '노영준', department: '개발팀', status: 'working' },
    { name: '김용수', department: '고문님', status: 'working' },
    { name: '박성오', department: '고문님', status: 'working' },

  ],
  vehicles: [
    { 
      name: '1호차', 
      plateNumber: '29LD-326.88',
      driverName: 'Thao', 
      driverPhone: '0949-218-180', 
      status: 'available' 
    },
    { 
      name: '2호차', 
      plateNumber: '29LD-326.97',
      driverName: 'Hung', 
      driverPhone: '0968-915-516', 
      status: 'available' 
    },
    { 
      name: '3호차', 
      plateNumber: '30L-687.26',
      driverName: 'Tho', 
      driverPhone: '0345-821-987', 
      status: 'available' 
    },
    { 
      name: '4호차', 
      plateNumber: '30M-442.70',
      driverName: 'Chau', 
      driverPhone: '0979-222-385', 
      status: 'available' 
    },
  ]
};

async function initializeData() {
  try {
    // 직원 데이터 추가
    for (const employee of initialData.employees) {
      await db.collection('employees').add({
        ...employee,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    console.log('직원 데이터가 추가되었습니다.');

    // 차량 데이터 추가
    for (const vehicle of initialData.vehicles) {
      await db.collection('vehicles').add({
        ...vehicle,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    console.log('차량 데이터가 추가되었습니다.');

    console.log('초기 데이터 설정이 완료되었습니다.');
  } catch (error) {
    console.error('데이터 초기화 오류:', error);
  }
}

initializeData();