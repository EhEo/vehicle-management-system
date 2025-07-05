// 외부 차량 데이터 시드 스크립트
// Node.js 환경에서 실행하여 외부 차량 데이터를 Firestore에 추가

const admin = require('firebase-admin');

// Firebase Admin SDK 초기화
// 서비스 계정 키 파일 필요
const serviceAccount = require('./service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'vehicle-management-a0105'
});

const db = admin.firestore();

// 외부 차량 샘플 데이터
const externalVehicles = [
  {
    id: 'taxi-001',
    type: 'taxi',
    name: '택시',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'personal-001',
    type: 'personal',
    name: '개인차량(홍길동)',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'external-001',
    type: 'external',
    name: '외부차량',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'taxi-002',
    type: 'taxi',
    name: '택시(모범)',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'personal-002',
    type: 'personal',
    name: '개인차량(김철수)',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'external-002',
    type: 'external',
    name: '외부차량(렌터카)',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function seedExternalVehicles() {
  try {
    console.log('외부 차량 데이터 시드 시작...');
    
    // 외부 차량 데이터 추가
    for (const vehicle of externalVehicles) {
      await db.collection('externalVehicles').doc(vehicle.id).set({
        ...vehicle,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
    
    console.log(`외부 차량 데이터 ${externalVehicles.length}개가 추가되었습니다.`);
    console.log('외부 차량 데이터 시드 완료');
    
    // 추가된 데이터 확인
    const snapshot = await db.collection('externalVehicles').get();
    console.log(`현재 externalVehicles 컬렉션에 ${snapshot.size}개의 문서가 있습니다.`);
    
  } catch (error) {
    console.error('외부 차량 데이터 시드 오류:', error);
  }
}

seedExternalVehicles();