// --- 1. 開機動畫邏輯 ---
window.onload = () => {
  setTimeout(() => {
    document.getElementById('boot-progress').style.width = '100%';
  }, 100);

  setTimeout(() => {
    const bootScreen = document.getElementById('boot-screen');
    const lockScreen = document.getElementById('lock-screen-container');
    
    bootScreen.style.opacity = '0'; 
    lockScreen.style.opacity = '1'; 
    
    setTimeout(() => { 
        bootScreen.style.display = 'none'; 
    }, 800); 
  }, 2600); 
};

// --- 2. 時鐘與日期更新邏輯 ---
function updateClockAndDate() {
  const now = new Date();
  // 更新時間
  document.getElementById('clock').innerText = 
    now.getHours().toString().padStart(2, '0') + ':' + 
    now.getMinutes().toString().padStart(2, '0');
  
  // 更新日期 (格式化為 中文的 星期X, X月 X日)
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  document.getElementById('dateDisplay').innerText = now.toLocaleDateString('zh-TW', options);
}
setInterval(updateClockAndDate, 1000);
updateClockAndDate();

// --- 3. 真實滑動 (Swipe / Drag) 解鎖邏輯 ---
const homeArea = document.getElementById('home-area');
const lockContainer = document.getElementById('lock-screen-container');
const swipeText = document.getElementById('swipe-text');

let startY = 0;
let currentY = 0;
let isDragging = false;

// 處理開始拖曳 (支援滑鼠與觸控)
function handleStart(e) {
  startY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
  isDragging = true;
  lockContainer.style.transition = 'none'; 
  swipeText.style.opacity = '0';
}

// 處理拖曳中
function handleMove(e) {
  if (!isDragging) return;
  currentY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
  let deltaY = currentY - startY;
  
  if (deltaY < 0) {
    lockContainer.style.transform = `translateY(${deltaY}px)`;
    lockContainer.style.opacity = 1 - (Math.abs(deltaY) / 600); 
  }
}

// 處理結束拖曳
function handleEnd() {
  if (!isDragging) return;
  isDragging = false;
  let deltaY = currentY - startY;
  
  lockContainer.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease';

  if (deltaY < -150) {
    // 解鎖成功：飛到畫面外
    lockContainer.style.transform = 'translateY(-100vh) scale(0.9)';
    lockContainer.style.opacity = '0';
    console.log("解鎖成功，準備載入主畫面...");
  } else {
    // 解鎖失敗：彈回原位
    lockContainer.style.transform = 'translateY(0)';
    lockContainer.style.opacity = '1';
    swipeText.style.opacity = '0.6';
  }
}

// 綁定觸控事件
homeArea.addEventListener('touchstart', handleStart, {passive: true});
homeArea.addEventListener('touchmove', handleMove, {passive: true});
homeArea.addEventListener('touchend', handleEnd);

// 綁定滑鼠事件
homeArea.addEventListener('mousedown', handleStart);
window.addEventListener('mousemove', handleMove); // 綁定在 window 上體驗更好
window.addEventListener('mouseup', handleEnd);