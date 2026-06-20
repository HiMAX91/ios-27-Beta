// --- 4. 讓所有 App 和 Widget 都可以點擊的系統 ---
const clickables = document.querySelectorAll('.clickable');
const dynamicIsland = document.getElementById('dynamic-island');
let islandTimer;

clickables.forEach(item => {
  item.addEventListener('click', () => {
    // 抓取設定在 HTML 裡面的 data-name 屬性
    const appName = item.getAttribute('data-name');
    
    // 更新動態島的文字並滑下來
    dynamicIsland.innerText = `正在開啟：${appName}`;
    dynamicIsland.style.top = '50px';
    
    // 每次點擊都重新計時，2 秒後自動收回
    clearTimeout(islandTimer);
    islandTimer = setTimeout(() => {
      dynamicIsland.style.top = '-60px';
    }, 2000);
  });
});
