# 앱 아이콘 가이드

PWA 아이콘 생성 및 관리 가이드입니다.

## ✅ 현재 상태

이 프로젝트의 아이콘은 **이미 생성되어 있습니다**:

```
icons/
  ✅ icon-source.svg       # 소스 SVG 아이콘
  ✅ favicon-16x16.png     # 브라우저 탭 아이콘
  ✅ favicon-32x32.png     # 브라우저 탭 아이콘
  ✅ icon-192x192.png      # Android 홈 화면
  ✅ icon-512x512.png      # 고해상도 표시
  ✅ icon-generator.html   # 재생성 도구
  ✅ quick-generate.js     # CLI 생성 스크립트

프로젝트 루트/
  ✅ favicon.ico           # 레거시 브라우저 지원
```

## 🎨 아이콘 커스터마이징

### 디자인 수정

1. **icon-source.svg 편집**
   - 텍스트 편집기나 벡터 그래픽 도구로 열기
   - 색상(`#667eea`, `#764ba2`), 텍스트("PWA"), 또는 디자인 수정
   - 저장

2. **PNG 아이콘 재생성**

   **방법 1: 브라우저 도구 (권장)**
   ```bash
   # 브라우저에서 열기
   open icon-generator.html        # macOS
   xdg-open icon-generator.html    # Linux
   start icon-generator.html       # Windows

   # 각 아이콘 다운로드 후 기존 파일 교체
   ```

   **방법 2: ImageMagick CLI**
   ```bash
   # ImageMagick 설치 (한 번만)
   brew install imagemagick  # macOS

   # 아이콘 재생성
   node quick-generate.js
   ```

3. **브라우저 캐시 삭제**
   ```
   Cmd+Shift+R (macOS)
   Ctrl+Shift+R (Windows/Linux)
   ```

## 📦 필요한 아이콘 크기

| 파일명 | 크기 | 용도 |
|--------|------|------|
| `favicon-16x16.png` | 16×16 | 브라우저 탭 |
| `favicon-32x32.png` | 32×32 | 브라우저 탭 |
| `icon-192x192.png` | 192×192 | Android 홈 화면, PWA 설치 |
| `icon-512x512.png` | 512×512 | 고해상도 디스플레이, 스플래시 |
| `favicon.ico` | 32×32 | 레거시 브라우저 |

## 🛠 생성 도구

### icon-generator.html
- **장점**: 의존성 없음, 브라우저만 있으면 사용 가능
- **사용법**: 브라우저로 열기 → 자동 생성 → 다운로드
- **권장**: 일반 사용자

### quick-generate.js
- **장점**: 자동화된 CLI 워크플로우
- **요구사항**: ImageMagick, Inkscape, 또는 rsvg-convert
- **사용법**: `node quick-generate.js`
- **권장**: 개발자, 빌드 자동화

## ✅ 디자인 체크리스트

- [ ] **단순명료**: 16×16에서도 식별 가능한 디자인
- [ ] **고대비**: 배경과 전경이 명확히 구분
- [ ] **안전 영역**: 가장자리 10% 여백 확보
- [ ] **중앙 배치**: 중요 요소는 중앙 80% 내 배치 (maskable)
- [ ] **브랜드 일관성**: manifest.json의 theme_color와 조화
- [ ] **정사각형**: 모든 아이콘 1:1 비율 유지

## 🔧 문제 해결

### 아이콘이 표시되지 않음
1. 브라우저 캐시 강력 삭제 (Cmd/Ctrl+Shift+R)
2. Service Worker 업데이트 확인
   - DevTools → Application → Service Workers → "Update"
3. manifest.json 경로 확인 (`/icons/` 절대 경로)

### 생성 도구 오류
1. **icon-generator.html**: 다른 브라우저 시도
2. **quick-generate.js**: ImageMagick 설치 확인
   ```bash
   which convert || which magick
   ```

### 커스텀 아이콘 적용 안됨
1. PNG 파일이 올바른 위치에 있는지 확인
2. 파일명이 정확한지 확인 (대소문자 구분)
3. Git에 커밋했는지 확인 (GitHub Pages 배포 시)

## 🌐 온라인 도구

복잡한 디자인이 필요하다면:

- **PWA Asset Generator**: https://www.pwabuilder.com/imageGenerator
- **Favicon Generator**: https://realfavicongenerator.net/
- **Simple Image Resizer**: https://www.simpleimageresizer.com/

## 📱 테스트

### 로컬 테스트
1. 개발 서버 실행
2. DevTools → Application → Manifest 확인
3. 각 아이콘 미리보기 확인

### 배포 후 테스트
1. **Android**: 설치 프롬프트 → 홈 화면 아이콘 확인
2. **iOS**: 공유 → 홈 화면 추가 → 아이콘 확인
3. **Desktop**: 설치 → 작업 표시줄/독 아이콘 확인

## 🔄 업데이트 워크플로우

```bash
# 1. SVG 수정
vi icon-source.svg

# 2. PNG 재생성
node quick-generate.js
# 또는 브라우저 도구 사용

# 3. Git 커밋 (GitHub Pages 사용 시)
git add icons/*.png favicon.ico
git commit -m "Update PWA icons"
git push

# 4. 브라우저 캐시 삭제 및 테스트
```

## 📚 참고 자료

- [PWA 아이콘 가이드](https://web.dev/add-manifest/#icons)
- [Maskable Icons](https://web.dev/maskable-icon/)
- [Favicon Best Practices](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Add_to_home_screen)
