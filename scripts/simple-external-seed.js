// 간단한 외부차량 데이터 추가 스크립트
const admin = require('firebase-admin');

// Firebase 초기화 (기존 앱이 있으면 사용)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'vehicle-management-a0105'
  });
}

const db = admin.firestore();

// 외부차량 데이터
const externalVehicles = [
  { type: 'taxi', name: '택시' },
  { type: 'personal', name: '개인차량(홍길동)' },
  { type: 'external', name: '외부차량' }
];

async function addExternalVehicles() {
  try {
    console.log('외부차량 데이터 추가 시작...');
    
    for (const vehicle of externalVehicles) {
      await db.collection('externalVehicles').add({
        ...vehicle,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`${vehicle.name} 추가 완료`);
    }
    
    console.log('모든 외부차량 데이터 추가 완료!');
    process.exit(0);
  } catch (error) {
    console.error('오류:', error);
    process.exit(1);
  }
}

addExternalVehicles();