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
  
  // 更新鎖定畫面時鐘
  document.getElementById('clock').innerText = 
    now.getHours().toString().padStart(2, '0') + ':' + 
    now.getMinutes().toString().padStart(2, '0');
  
  // 更新鎖定畫面日期
  const options = { weekday: 'long', month: 'long', day: 'numeric' };
  document.getElementById('dateDisplay').innerText = now.toLocaleDateString('zh-TW', options);

  // 同步更新主畫面的「行事曆 Widget」
  const widgetDate = document.getElementById('widget-date');
  const widgetDay = document.getElementById('widget-day');
  if(widgetDate && widgetDay) {
      widgetDate.innerText = now.getDate();
      widgetDay.innerText = now.toLocaleDateString('zh-TW', { weekday: 'short' });
  }
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

// 支援滑鼠與觸控
function handleStart(e) {
  startY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
  isDragging = true;
  lockContainer.style.transition = 'none'; 
  swipeText.style.opacity = '0';
}

function handleMove(e) {
  if (!isDragging) return;
  currentY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
  let deltaY = currentY - startY;
  
  if (deltaY < 0) {
    lockContainer.style.transform = `translateY(${deltaY}px)`;
    lockContainer.style.opacity = 1 - (Math.abs(deltaY) / 600); 
  }
}

function handleEnd() {
  if (!isDragging) return;
  isDragging = false;
  let deltaY = currentY - startY;
  
  lockContainer.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease';

  if (deltaY < -150) {
    // 鎖定畫面飛走
    lockContainer.style.transform = 'translateY(-100vh) scale(0.9)';
    lockContainer.style.opacity = '0';
    
    // 主畫面優雅浮現
    const homeScreen = document.getElementById('home-screen');
    if (homeScreen) {
      homeScreen.style.opacity = '1';
      homeScreen.style.transform = 'scale(1)';
    }
  } else {
    // 解鎖失敗：彈回原位
    lockContainer.style.transform = 'translateY(0)';
    lockContainer.style.opacity = '1';
    swipeText.style.opacity = '0.6';
  }
}

homeArea.addEventListener('touchstart', handleStart, {passive: true});
homeArea.addEventListener('touchmove', handleMove, {passive: true});
homeArea.addEventListener('touchend', handleEnd);

homeArea.addEventListener('mousedown', handleStart);
window.addEventListener('mousemove', handleMove); 
window.addEventListener('mouseup', handleEnd);


// --- 4. 讓所有 App 和 Widget 都可以點擊的「動態島」系統 ---
// 確保在載入主畫面後綁定點擊事件
setTimeout(() => {
  const clickables = document.querySelectorAll('.clickable');
  const dynamicIsland = document.getElementById('dynamic-island');
  let islandTimer;

  clickables.forEach(item => {
    item.addEventListener('click', () => {
      const appName = item.getAttribute('data-name');
      
      if(dynamicIsland) {
          dynamicIsland.innerText = `正在開啟：${appName}`;
          dynamicIsland.style.top = '50px';
          
          clearTimeout(islandTimer);
          islandTimer = setTimeout(() => {
            dynamicIsland.style.top = '-60px';
          }, 2000);
      }
    });
  });
}, 500); // 延遲一點點確保 HTML 都抓得到
