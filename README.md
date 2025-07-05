# 차량관리 시스템

효율적인 차량 운영을 위한 통합 관리 시스템입니다.

## 🚗 주요 기능

### 1. 기준 정보 관리
- **직원 관리**: 직원 정보 등록, 수정, 삭제 (이름, 부서, 상태)
- **차량 관리**: 차량 정보 등록, 수정, 삭제 (차량명, 기사명, 연락처, 상태)

### 2. 현황 관리
- **메인 현황**: 실시간 가용 차량 수, 잔류 인원 수 확인
- **퇴근 체크**: 차량별 퇴근 인원 등록 및 처리

### 3. 자동화 기능
- **일일 초기화**: 매일 오전 5시 또는 모든 차량 퇴근 시 자동 초기화
- **실시간 동기화**: Firebase를 통한 실시간 데이터 동기화

### 4. 조회 기능
- **사용 현황**: 일자별 차량 사용 현황 조회
- **필터링**: 기간별, 차량별 데이터 필터링

## 🛠️ 기술 스택

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Database**: Firebase Firestore
- **Deployment**: Vercel (권장)

## 📱 PWA 지원

- 모바일 홈화면 바로가기 추가 가능
- 오프라인에서도 기본 기능 사용 가능
- 모바일 최적화된 UI/UX

## 🚀 설치 및 실행

### 1. 프로젝트 클론 및 의존성 설치

```bash
cd vehicle-management
npm install
```

### 2. Firebase 설정

1. [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
2. Firestore Database 활성화
3. 프로젝트 설정에서 웹 앱 추가
4. `.env.local` 파일에 Firebase 설정 정보 입력:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`을 열어 확인합니다.

### 4. 빌드 및 배포

```bash
npm run build
npm start
```

## 📊 데이터 구조

### Employee (직원)
```typescript
{
  id: string;
  name: string;
  department: string;
  status: 'working' | 'leaving' | 'business_trip' | 'vacation' | 'out_of_office';
  createdAt: Date;
  updatedAt: Date;
}
```

### Vehicle (차량)
```typescript
{
  id: string;
  name: string;
  driverName: string;
  driverPhone: string;
  status: 'available' | 'in_use' | 'out_of_office' | 'maintenance';
  createdAt: Date;
  updatedAt: Date;
}
```

### LeaveRecord (퇴근기록)
```typescript
{
  id: string;
  date: string;
  vehicleId: string;
  vehicleName: string;
  employees: Array<{
    id: string;
    name: string;
    department: string;
  }>;
  leaveTime: Date;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔧 설정 및 관리

### 일일 초기화 규칙
- **자동 실행 조건**:
  - 매일 오전 5시
  - 모든 차량이 퇴근 상태일 때
- **초기화 내용**:
  - 모든 차량: `in_use` → `available` (단, `maintenance` 제외)
  - 모든 직원: `leaving` → `working` (단, `vacation` 제외)
  - 전일 퇴근 기록: `isCompleted = true`

### 수동 초기화
- 설정 페이지에서 "초기화 실행" 버튼 클릭
- API 엔드포인트: `POST /api/reset`

## 📱 모바일 사용법

1. **홈화면 추가**: 
   - Safari: 공유 → 홈 화면에 추가
   - Chrome: 메뉴 → 홈화면에 추가

2. **오프라인 사용**:
   - 기본 현황 조회 가능
   - 인터넷 연결 시 자동 동기화

## 🔐 보안 고려사항

- Firebase Security Rules 설정 권장
- HTTPS 통신 필수
- 환경변수를 통한 설정 정보 관리

## 📈 성능 최적화

- **로딩 성능**: 초기 로딩 3초 이내
- **동시 사용자**: 최대 50명 지원
- **데이터 용량**: 연간 약 10MB

## 🐛 문제 해결

### 일반적인 문제
1. **Firebase 연결 오류**: `.env.local` 파일의 설정 확인
2. **실시간 업데이트 안됨**: 네트워크 연결 상태 확인
3. **PWA 설치 안됨**: HTTPS 환경에서 테스트

### 개발자 도구
- 브라우저 콘솔에서 에러 로그 확인
- Firebase Console에서 데이터베이스 상태 확인

## 📞 지원

프로젝트 관련 문의사항이나 버그 리포트는 개발팀에 문의하세요.

---

**개발 완료일**: 2025년 1월
**버전**: 1.0.0
**라이선스**: MIT
# vehicle-management-system
