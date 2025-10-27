# GitHub Pages 배포 가이드

이 프로젝트는 GitHub Pages를 통해 `pwa.h3me.xyz` 도메인으로 배포됩니다.

## 🚀 배포 설정

### 1. GitHub Repository 설정

1. GitHub에 새 저장소 생성
2. 로컬 프로젝트를 git 저장소로 초기화
3. GitHub에 푸시

```bash
# Git 초기화
git init
git add .
git commit -m "Initial commit: PWA sample project"

# GitHub 저장소 연결 (본인의 저장소 URL로 변경)
git remote add origin https://github.com/YOUR_USERNAME/pwa-sample-project.git
git branch -M main
git push -u origin main
```

### 2. GitHub Pages 활성화

1. GitHub 저장소 → **Settings** 탭
2. 왼쪽 메뉴에서 **Pages** 선택
3. **Source**에서 `main` 브랜치 선택
4. **Save** 클릭

### 3. 커스텀 도메인 설정

#### DNS 설정 (도메인 제공업체에서)

h3me.xyz 도메인의 DNS 레코드에 다음을 추가:

```
Type: CNAME
Name: pwa
Value: YOUR_USERNAME.github.io
TTL: 3600 (or automatic)
```

또는 A 레코드 사용:

```
Type: A
Name: pwa
Value: 185.199.108.153
      185.199.109.153
      185.199.110.153
      185.199.111.153
```

#### GitHub Pages 설정

1. GitHub 저장소 → **Settings** → **Pages**
2. **Custom domain** 필드에 `pwa.h3me.xyz` 입력
3. **Save** 클릭
4. **Enforce HTTPS** 체크박스 활성화 (DNS 전파 후 가능)

> **참고**: DNS 전파는 최대 24-48시간 소요될 수 있습니다.

## ✅ 배포 체크리스트

### 필수 파일 확인
- [x] `CNAME` - 커스텀 도메인 설정
- [x] `.nojekyll` - Jekyll 빌드 비활성화
- [x] `index.html` - 메인 페이지
- [x] `manifest.json` - PWA 매니페스트
- [x] `service-worker.js` - Service Worker

### 아이콘 생성 (중요!)
- [ ] `icons/icon-generator.html` 열기
- [ ] 모든 아이콘 다운로드
- [ ] PNG 파일들을 `icons/` 폴더에 저장
- [ ] `favicon.ico`를 프로젝트 루트에 저장
- [ ] Git에 추가 후 푸시

```bash
git add icons/*.png favicon.ico
git commit -m "Add PWA icons and favicon"
git push
```

### HTTPS 설정
- [ ] DNS 전파 완료 확인 (dig pwa.h3me.xyz)
- [ ] GitHub Pages에서 "Enforce HTTPS" 활성화
- [ ] https://pwa.h3me.xyz 접속 확인

### PWA 기능 검증
- [ ] Service Worker 등록 확인
- [ ] 오프라인 모드 테스트
- [ ] 앱 설치 프롬프트 확인
- [ ] Lighthouse PWA 감사 실행 (90점 이상 목표)

## 🔧 배포 후 설정

### Service Worker 캐시 업데이트

코드를 수정한 후 배포 시, Service Worker 버전을 업데이트해야 합니다:

```javascript
// service-worker.js
const CACHE_VERSION = 'v2'; // 버전 증가
```

### manifest.json 경로 수정

GitHub Pages 서브디렉토리에 배포하는 경우 경로 수정:

```json
{
  "start_url": "/pwa-sample-project/",
  "scope": "/pwa-sample-project/"
}
```

커스텀 도메인 사용 시에는 현재 설정 유지.

## 🧪 배포 테스트

### 1. 로컬 테스트

```bash
# Python 서버
python -m http.server 8000

# 또는 Node.js
npx http-server -p 8000
```

http://localhost:8000 접속

### 2. 프로덕션 테스트

배포 후 다음을 확인:

```bash
# DNS 전파 확인
dig pwa.h3me.xyz

# HTTPS 확인
curl -I https://pwa.h3me.xyz

# Service Worker 확인 (브라우저 DevTools)
# Application → Service Workers
# Application → Manifest
```

### 3. Lighthouse 감사

Chrome DevTools → Lighthouse 탭:
- Performance
- Accessibility
- Best Practices
- SEO
- **Progressive Web App** ⭐

## 📱 모바일 테스트

### iOS (Safari)
1. https://pwa.h3me.xyz 접속
2. 공유 버튼 → "홈 화면에 추가"
3. 아이콘 확인 및 앱 실행

### Android (Chrome)
1. https://pwa.h3me.xyz 접속
2. 설치 프롬프트 또는 메뉴 → "홈 화면에 추가"
3. 아이콘 확인 및 앱 실행

## 🔄 업데이트 워크플로우

```bash
# 1. 로컬에서 변경
# 2. Service Worker 버전 업데이트
# 3. 커밋 및 푸시
git add .
git commit -m "Update: feature description"
git push

# 4. GitHub Actions 또는 자동 배포 대기
# 5. 배포 확인 (보통 1-2분 소요)
```

## 🐛 문제 해결

### CNAME 파일이 사라짐
→ `.nojekyll` 파일이 있는지 확인
→ CNAME 파일을 git에 커밋

### HTTPS 활성화 불가
→ DNS 전파 완료 확인 (24-48시간)
→ GitHub Pages 설정에서 도메인 재입력

### Service Worker 업데이트 안됨
→ 브라우저 강력 새로고침 (Cmd+Shift+R)
→ Service Worker 버전 변경 확인
→ DevTools에서 "Update on reload" 활성화

### 아이콘이 표시되지 않음
→ PNG 파일 생성 확인
→ manifest.json 경로 확인
→ 브라우저 캐시 삭제

## 📊 모니터링

배포 후 모니터링할 항목:

- GitHub Pages 상태: https://www.githubstatus.com/
- DNS 전파: https://www.whatsmydns.net/#CNAME/pwa.h3me.xyz
- SSL 인증서: https://www.ssllabs.com/ssltest/
- PWA 기능: Chrome DevTools Lighthouse

## 🔗 유용한 링크

- [GitHub Pages 문서](https://docs.github.com/en/pages)
- [커스텀 도메인 설정](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [PWA 체크리스트](https://web.dev/pwa-checklist/)
- [Service Worker 가이드](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
