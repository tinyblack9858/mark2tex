// app.js - 主應用程式入口

// 初始化所有模組
document.addEventListener('DOMContentLoaded', () => {
    // 初始化順序很重要
    Preview.init();     // 先初始化預覽
    Theme.init();       // 初始化主題
    Editor.init();      // 初始化編輯器
    ExportManager.init(); // 初始化匯出功能

    console.log('mark2tex 已啟動 ✨');
});
