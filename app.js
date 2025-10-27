// Service Worker 등록
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker 등록 성공:', registration.scope);
      updateSWStatus('활성화됨 ✅');
    } catch (error) {
      console.error('Service Worker 등록 실패:', error);
      updateSWStatus('비활성화 ❌');
    }
  });
} else {
  updateSWStatus('지원되지 않음 ❌');
}

// 네트워크 상태 감지
window.addEventListener('online', () => updateNetworkStatus(true));
window.addEventListener('offline', () => updateNetworkStatus(false));
updateNetworkStatus(navigator.onLine);

// 앱 설치 프롬프트
let deferredPrompt;
const installBtn = document.getElementById('install-btn');
const launchBtn = document.getElementById('launch-btn');
const installStatus = document.getElementById('install-status');

// 설치 프롬프트 이벤트 리스너
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('beforeinstallprompt 이벤트 발생!');
  e.preventDefault();
  deferredPrompt = e;

  installBtn.style.display = 'block';
  installBtn.textContent = '홈 화면에 추가';
  installStatus.textContent = '앱을 설치할 수 있습니다! ✅';
  installStatus.style.color = '#10b981';
});

// 설치 버튼 클릭 핸들러
installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) {
    showManualInstallGuide();
    return;
  }

  installBtn.style.display = 'none';
  deferredPrompt.prompt();

  const { outcome } = await deferredPrompt.userChoice;
  console.log(`설치 프롬프트 결과: ${outcome}`);

  if (outcome === 'accepted') {
    installStatus.textContent = '설치를 시작합니다... ⏳';
    installStatus.style.color = '#3b82f6';
  } else {
    installStatus.textContent = '설치가 취소되었습니다.';
    installStatus.style.color = '#f59e0b';
    installBtn.style.display = 'block';
  }

  deferredPrompt = null;
});

// 앱 설치 완료 감지
window.addEventListener('appinstalled', () => {
  console.log('PWA가 설치되었습니다!');
  installStatus.textContent = '앱이 설치되었습니다! 🎉';
  installStatus.style.color = '#10b981';
});

// 수동 설치 안내 함수
function showManualInstallGuide() {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  if (isIOS) {
    installStatus.innerHTML = `
      <strong>iOS 설치 방법:</strong><br>
      1. 하단의 <strong>공유</strong> 버튼 탭<br>
      2. <strong>"홈 화면에 추가"</strong> 선택<br>
      3. <strong>"추가"</strong> 확인
    `;
  } else if (isAndroid) {
    installStatus.innerHTML = `
      <strong>Android 설치 방법:</strong><br>
      Chrome 메뉴(⋮) → <strong>"홈 화면에 추가"</strong> 또는<br>
      <strong>"앱 설치"</strong> 선택
    `;
  } else {
    installStatus.innerHTML = `
      <strong>데스크톱 설치 방법:</strong><br>
      주소창 오른쪽의 <strong>설치(+)</strong> 아이콘 클릭 또는<br>
      Chrome 메뉴(⋮) → <strong>"앱 설치"</strong> 선택<br><br>
      <small>💡 팁: 페이지를 30초 이상 사용하고 2번 이상 방문하면 자동으로 설치 프롬프트가 표시됩니다.</small>
    `;
  }
  installStatus.style.color = '#6b7280';
}

// 실행하기 버튼 클릭 핸들러
launchBtn.addEventListener('click', () => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);

  if (isIOS) {
    // iOS: 홈 화면의 앱 아이콘 안내
    installStatus.innerHTML = `
      <strong>iOS 앱 실행 방법:</strong><br>
      <strong>홈 화면</strong>에서 <strong>PWA Sample</strong> 아이콘을 탭하세요.
    `;
  } else if (isAndroid) {
    // Android: 앱 서랍 또는 주소창 안내
    installStatus.innerHTML = `
      <strong>Android 앱 실행 방법:</strong><br>
      • 주소창의 <strong>"앱에서 열기"</strong> 아이콘 탭 또는<br>
      • 앱 서랍에서 <strong>PWA Sample</strong> 실행
    `;
  } else {
    // Desktop: 주소창 또는 시작 메뉴 안내
    installStatus.innerHTML = `
      <strong>데스크톱 앱 실행 방법:</strong><br>
      • 주소창 오른쪽의 <strong>앱 아이콘</strong> 클릭 또는<br>
      • <strong>시작 메뉴</strong>/<strong>애플리케이션</strong>에서 <strong>PWA Sample</strong> 실행
    `;
  }
  installStatus.style.color = '#3b82f6';
});

// 페이지 로드 시 설치 가능 여부 확인
window.addEventListener('load', () => {
  // standalone 모드로 실행 중인지 확인 (앱으로 실행 중)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

  if (isStandalone) {
    // 앱으로 실행 중
    installBtn.style.display = 'none';
    launchBtn.style.display = 'none';
    installStatus.textContent = '앱 모드로 실행 중입니다! 🎉';
    installStatus.style.color = '#10b981';
  } else {
    // 브라우저에서 실행 중 - 즉시 Service Worker 확인 후 짧은 대기
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        if (registrations.length > 0) {
          // Service Worker가 이미 등록되어 있음 = 높은 확률로 설치됨
          // 100ms 후에도 beforeinstallprompt가 없으면 설치된 것으로 판단
          setTimeout(() => {
            if (!deferredPrompt) {
              launchBtn.style.display = 'block';
              installBtn.style.display = 'none';
              installStatus.textContent = '이미 설치되었습니다! ✅';
              installStatus.style.color = '#10b981';
            }
          }, 100);
        } else {
          // Service Worker 미등록 - 100ms 후 재확인
          setTimeout(() => {
            if (!deferredPrompt) {
              installBtn.style.display = 'block';
              installBtn.textContent = '설치 방법 보기';
              installStatus.textContent = '수동으로 설치할 수 있습니다.';
              installStatus.style.color = '#6b7280';
            }
          }, 100);
        }
      });
    } else {
      // Service Worker 미지원
      installStatus.textContent = '이 브라우저는 PWA 설치를 지원하지 않습니다.';
      installStatus.style.color = '#ef4444';
    }
  }
});

// 페이지 로드 시 알림 권한 상태 확인
function updateNotificationStatus() {
  const statusEl = document.getElementById('notification-status');

  if (!('Notification' in window)) {
    statusEl.textContent = '이 브라우저는 알림을 지원하지 않습니다.';
    statusEl.style.color = '#ef4444';
    return;
  }

  const permission = Notification.permission;
  if (permission === 'granted') {
    statusEl.textContent = '알림 권한: 허용됨 ✅';
    statusEl.style.color = '#10b981';
  } else if (permission === 'denied') {
    statusEl.textContent = '알림 권한: 거부됨 ❌ (브라우저 설정에서 변경 필요)';
    statusEl.style.color = '#ef4444';
  } else {
    statusEl.textContent = '알림 권한: 미설정 (버튼을 눌러 권한 요청)';
    statusEl.style.color = '#6b7280';
  }
}

// 알림 권한 요청
document.getElementById('notification-btn').addEventListener('click', async () => {
  const statusEl = document.getElementById('notification-status');

  if (!('Notification' in window)) {
    statusEl.textContent = '이 브라우저는 알림을 지원하지 않습니다.';
    statusEl.style.color = '#ef4444';
    return;
  }

  // 이미 권한이 있으면 바로 샘플 알림 발송
  if (Notification.permission === 'granted') {
    sendSampleNotifications();
    return;
  }

  // 권한 거부 상태면 안내
  if (Notification.permission === 'denied') {
    statusEl.textContent = '알림이 차단되었습니다. 브라우저 설정에서 권한을 허용해주세요.';
    statusEl.style.color = '#ef4444';
    return;
  }

  // 권한 요청
  try {
    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);

    if (permission === 'granted') {
      statusEl.textContent = '알림 권한이 허용되었습니다! 샘플 알림을 발송합니다...';
      statusEl.style.color = '#10b981';
      sendSampleNotifications();
    } else if (permission === 'denied') {
      statusEl.textContent = '알림 권한이 거부되었습니다. ❌';
      statusEl.style.color = '#ef4444';
    } else {
      statusEl.textContent = '알림 권한이 보류되었습니다.';
      statusEl.style.color = '#f59e0b';
    }
  } catch (error) {
    statusEl.textContent = '알림 권한 요청 중 오류: ' + error.message;
    statusEl.style.color = '#ef4444';
    console.error('Notification error:', error);
  }
});

// 샘플 알림 발송 함수
async function sendSampleNotifications() {
  const statusEl = document.getElementById('notification-status');

  try {
    console.log('Sending notification via Service Worker...');

    // Service Worker registration 가져오기
    const registration = await navigator.serviceWorker.ready;

    // 첫 번째 알림 (Service Worker 통해 발송)
    await registration.showNotification('🚀 PWA 샘플 앱', {
      body: '알림이 정상적으로 작동합니다!',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      tag: 'pwa-sample-1',
      requireInteraction: false,
      vibrate: [200, 100, 200], // 진동 패턴 (Android)
      data: {
        url: window.location.origin
      }
    });

    console.log('First notification sent');
    statusEl.textContent = '첫 번째 알림 발송 완료! 3초 후 추가 알림이 발송됩니다.';
    statusEl.style.color = '#10b981';

    // 3초 후 두 번째 알림
    setTimeout(async () => {
      console.log('Sending second notification...');

      await registration.showNotification('💡 추가 샘플 알림', {
        body: 'PWA는 백그라운드 알림도 지원합니다!',
        icon: '/icons/icon-512x512.png',
        badge: '/icons/icon-192x192.png',
        tag: 'pwa-sample-2',
        requireInteraction: false,
        vibrate: [100, 50, 100],
        data: {
          url: window.location.origin
        }
      });

      console.log('Second notification sent');
      statusEl.textContent = '두 번째 알림 발송 완료! ✅';
    }, 3000);

  } catch (error) {
    statusEl.textContent = '알림 발송 중 오류: ' + error.message;
    statusEl.style.color = '#ef4444';
    console.error('Notification send error:', error);
  }
}

// 페이지 로드 시 권한 상태 표시
updateNotificationStatus();

// UI 업데이트 함수들
function updateNetworkStatus(isOnline) {
  const statusEl = document.getElementById('network-status');
  statusEl.textContent = isOnline ? '온라인' : '오프라인';
  statusEl.className = `status-indicator ${isOnline ? 'online' : 'offline'}`;
}

function updateSWStatus(status) {
  document.getElementById('sw-status').textContent = status;
}

// 초기 상태 확인
async function checkBrowserSupport() {
  const support = {
    serviceWorker: 'serviceWorker' in navigator,
    cacheAPI: 'caches' in window,
    notification: 'Notification' in window,
    pushManager: 'PushManager' in window
  };

  const browserSupportEl = document.getElementById('browser-support');
  const cacheStatusEl = document.getElementById('cache-status');

  if (support.serviceWorker && support.cacheAPI) {
    browserSupportEl.textContent = '완전 지원 ✅';

    // 캐시 확인
    const cacheNames = await caches.keys();
    cacheStatusEl.textContent = `${cacheNames.length}개의 캐시 발견`;
  } else {
    browserSupportEl.textContent = '부분 지원 ⚠️';
    cacheStatusEl.textContent = '사용 불가';
  }
}

checkBrowserSupport();
