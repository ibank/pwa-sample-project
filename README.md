# PWA 샘플 프로젝트

Progressive Web App의 기본 구조를 보여주는 샘플 프로젝트입니다.

## 프로젝트 구조

```
pwa-sample-project/
├── index.html              # 메인 HTML 파일
├── manifest.json           # PWA 매니페스트
├── service-worker.js       # Service Worker
├── app.js                  # 메인 애플리케이션 로직
├── styles.css              # 스타일시트
├── offline.html            # 오프라인 페이지
├── favicon.ico             # 파비콘
├── CNAME                   # GitHub Pages 커스텀 도메인
├── DEPLOYMENT.md           # 배포 가이드
└── icons/                  # 아이콘 리소스
    ├── icon-source.svg     # 소스 SVG 아이콘
    ├── *.png               # 생성된 PNG 아이콘들
    ├── icon-generator.html # 브라우저 기반 아이콘 생성기
    ├── quick-generate.js   # CLI 아이콘 생성 스크립트
    └── README.md           # 아이콘 가이드
```

## 주요 기능

### 1. Service Worker
- 정적 리소스 캐싱
- 오프라인 지원
- Cache First 전략 구현

### 2. 앱 설치
- 홈 화면 추가 기능
- 설치 프롬프트 커스터마이징

### 3. 알림
- 브라우저 알림 권한 요청
- 알림 테스트 기능

### 4. 네트워크 상태 감지
- 온라인/오프라인 상태 실시간 표시

## 시작하기

### 아이콘 준비

**✅ PNG 아이콘이 이미 포함되어 있어 즉시 사용 가능합니다.**

커스텀 아이콘으로 변경하려면 [`icons/README.md`](icons/README.md)를 참고하세요.

## 로컬 실행 방법

### 1. Python 내장 서버 사용

```bash
# Python 3.x
python -m http.server 8000

# Python 2.x
python -m SimpleHTTPServer 8000
```

### 2. Node.js http-server 사용

```bash
# http-server 설치
npm install -g http-server

# 서버 실행
http-server -p 8000
```

### 3. VS Code Live Server
- VS Code에서 Live Server 확장 설치
- index.html에서 우클릭 → "Open with Live Server"

## 브라우저에서 확인

http://localhost:8000 접속 후 다음을 확인하세요:

1. **Service Worker 상태**: DevTools → Application → Service Workers
2. **캐시 저장소**: DevTools → Application → Cache Storage
3. **Manifest**: DevTools → Application → Manifest
4. **Lighthouse 감사**: DevTools → Lighthouse → PWA 감사 실행

## HTTPS 테스팅

PWA는 HTTPS에서만 완전히 동작합니다. 로컬 테스트는 localhost에서 가능하지만, 실제 배포 시에는 HTTPS가 필수입니다.

### ngrok을 사용한 HTTPS 테스팅

```bash
# ngrok 설치 (https://ngrok.com/)
brew install ngrok  # macOS

# HTTPS 터널 생성
ngrok http 8000
```

## PWA 체크리스트

- ✅ manifest.json 파일 존재
- ✅ Service Worker 등록
- ✅ 오프라인 페이지 제공
- ✅ 반응형 디자인
- ✅ HTTPS 제공 (배포 시)
- ✅ 앱 아이콘 (PNG + SVG 폴백)
- ✅ GitHub Pages 배포 준비 완료

## 구현된 기능 요약

✅ **Service Worker**: 정적 리소스 캐싱 및 오프라인 지원
✅ **App Manifest**: PNG 아이콘 + SVG 폴백
✅ **설치 프롬프트**: 브라우저별 가이드 포함
✅ **알림 권한**: 브라우저 알림 테스트 기능
✅ **네트워크 감지**: 온라인/오프라인 상태 표시
✅ **오프라인 페이지**: 네트워크 단절 시 안내 페이지
✅ **GitHub Pages**: CNAME 설정 및 배포 문서 포함

## 추가 개선 사항

이 샘플은 기본 구조를 포함하고 있습니다. 실제 프로젝트에서는 다음을 추가로 구현할 수 있습니다:

- Background Sync API
- Push Notifications (서버 연동)
- IndexedDB를 사용한 데이터 저장
- 더 정교한 캐싱 전략 (Stale-While-Revalidate 등)
- 앱 업데이트 알림 기능

## 참고 자료

- [MDN PWA 가이드](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Google PWA 문서](https://developers.google.com/web/progressive-web-apps)
- [블로그 포스트: PWA 완벽 가이드](https://blog.h3me.xyz/blog/pwa-comprehensive-development-operations-guide)
