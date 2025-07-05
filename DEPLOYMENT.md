# 차량관리 시스템 배포 가이드

## 1. 사전 준비

### Firebase 설정
1. Firebase Console에서 프로젝트 생성
2. Firestore 데이터베이스 활성화
3. 웹 앱 추가 및 구성 정보 복사
4. `.env.local` 파일 업데이트

### 환경 변수 설정
`.env.local` 파일에 실제 Firebase 구성 정보 입력:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=실제_API_키
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=프로젝트_ID.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=프로젝트_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=프로젝트_ID.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=실제_센더_ID
NEXT_PUBLIC_FIREBASE_APP_ID=실제_앱_ID
```

## 2. 배포 방법

### 방법 1: Vercel 배포 (권장)

1. **GitHub에 프로젝트 푸시**
   ```bash
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/username/vehicle-management.git
   git push -u origin main
   ```

2. **Vercel 설정**
   - https://vercel.com 접속
   - GitHub 계정으로 로그인
   - "New Project" → GitHub 저장소 선택
   - 환경 변수 설정 (Firebase 구성값)
   - 배포 완료

### 방법 2: Firebase Hosting

1. **Firebase CLI 설치**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Firebase 프로젝트 초기화**
   ```bash
   firebase init
   # Firestore, Hosting 선택
   # 프로젝트 선택
   # public 디렉토리: out
   # SPA 설정: Yes
   ```

3. **배포 실행**
   ```bash
   npm run deploy:firebase
   ```

## 3. 초기 데이터 설정

1. **서비스 계정 키 생성**
   - Firebase Console → 프로젝트 설정 → 서비스 계정
   - "새 비공개 키 생성" 클릭
   - `scripts/service-account-key.json`으로 저장

2. **초기 데이터 추가**
   ```bash
   cd scripts
   npm init -y
   npm install firebase-admin
   node init-data.js
   ```

## 4. 배포 후 확인사항

1. **Firestore 보안 규칙 업데이트**
   - 개발 환경에서는 모든 접근 허용
   - 프로덕션에서는 더 엄격한 규칙 적용

2. **도메인 설정**
   - 커스텀 도메인 연결 (선택사항)
   - HTTPS 인증서 자동 설정

3. **성능 최적화**
   - 이미지 최적화 확인
   - 로딩 속도 테스트

## 5. 유지보수

- 정기적인 Firebase 사용량 모니터링
- 보안 규칙 업데이트
- 백업 및 복원 계획 수립