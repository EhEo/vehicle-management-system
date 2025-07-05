// Firebase REST API를 통해 외부차량 데이터 직접 추가
const https = require('https');

const projectId = 'vehicle-management-a0105';
const collectionName = 'externalVehicles';

const externalVehicles = [
  { type: 'taxi', name: '택시' },
  { type: 'personal', name: '개인차량(홍길동)' },
  { type: 'external', name: '외부차량' },
  { type: 'taxi', name: '택시(모범)' }
];

async function addDocument(vehicle) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      fields: {
        type: { stringValue: vehicle.type },
        name: { stringValue: vehicle.name },
        createdAt: { timestampValue: new Date().toISOString() },
        updatedAt: { timestampValue: new Date().toISOString() }
      }
    });

    const options = {
      hostname: 'firestore.googleapis.com',
      path: `/v1/projects/${projectId}/databases/(default)/documents/${collectionName}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`${vehicle.name} 추가 완료`);
          resolve(responseData);
        } else {
          console.error(`${vehicle.name} 추가 실패:`, res.statusCode, responseData);
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function addAllVehicles() {
  try {
    console.log('외부차량 데이터 추가 시작...');
    
    for (const vehicle of externalVehicles) {
      await addDocument(vehicle);
      await new Promise(resolve => setTimeout(resolve, 500)); // 0.5초 대기
    }
    
    console.log('모든 외부차량 데이터 추가 완료!');
  } catch (error) {
    console.error('오류:', error.message);
  }
}

addAllVehicles();