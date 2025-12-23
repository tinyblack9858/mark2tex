// storage.js - 本地儲存管理

const Storage = {
    // 儲存 Markdown 內容
    saveContent(content) {
        try {
            localStorage.setItem('markdown-content', content);
        } catch (e) {
            console.error('儲存失敗:', e);
        }
    },

    // 載入 Markdown 內容
    loadContent() {
        try {
            return localStorage.getItem('markdown-content') || '';
        } catch (e) {
            console.error('載入失敗:', e);
            return '';
        }
    },

    // 儲存夜間模式設定
    saveNightMode(isEnabled) {
        try {
            localStorage.setItem('nightMode', isEnabled ? 'true' : 'false');
        } catch (e) {
            console.error('儲存夜間模式設定失敗:', e);
        }
    },

    // 載入夜間模式設定
    loadNightMode() {
        try {
            return localStorage.getItem('nightMode') === 'true';
        } catch (e) {
            console.error('載入夜間模式設定失敗:', e);
            return false;
        }
    },

    // 清除所有資料
    clearAll() {
        try {
            localStorage.removeItem('markdown-content');
            localStorage.removeItem('nightMode');
        } catch (e) {
            console.error('清除資料失敗:', e);
        }
    }
};
