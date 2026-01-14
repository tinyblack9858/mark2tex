// app.js - 主應用程式入口

/** 初始化應用程式並啟動各模組 */
document.addEventListener('DOMContentLoaded', () => {
    Preview.init();     
    Theme.init();       
    Editor.init();     
    ExportManager.init(); 

    console.log('mark2tex 已啟動 ');
});
