// 모든 데이터 삭제 스크립트
const admin = require('firebase-admin');

// Firebase Admin SDK 초기화
const serviceAccount = require('./service-account-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'vehicle-management-a0105'
});

const db = admin.firestore();

async function clearAllData() {
  try {
    console.log('모든 데이터 삭제 시작...');
    
    // 모든 컬렉션 삭제
    const collections = ['employees', 'vehicles', 'leaveRecords'];
    
    for (const collectionName of collections) {
      const snapshot = await db.collection(collectionName).get();
      console.log(`${collectionName} 컬렉션: ${snapshot.size}개 문서 삭제 중...`);
      
      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log(`${collectionName} 컬렉션 삭제 완료`);
    }
    
    console.log('모든 데이터 삭제 완료');
  } catch (error) {
    console.error('데이터 삭제 오류:', error);
  }
}

clearAllData();