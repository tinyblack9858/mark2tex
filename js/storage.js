const Storage = {

    saveContent(content) {
        try {
            localStorage.setItem('markdown-content', content);
        } catch (e) {
            console.error('儲存失敗:', e);
        }
    },

    loadContent() {
        try {
            return localStorage.getItem('markdown-content') || '';
        } catch (e) {
            console.error('載入失敗:', e);
            return '';
        }
    },

    saveTemplate(templateKey) {
        try {
            localStorage.setItem('latex-template', templateKey);
        } catch (e) {
            console.error('儲存模板設定失敗:', e);
        }
    },

    loadTemplate() {
        try {
            return localStorage.getItem('latex-template') || 'article';
        } catch (e) {
            console.error('載入模板設定失敗:', e);
            return 'article';
        }
    },

    saveNightMode(isEnabled) {
        try {
            localStorage.setItem('nightMode', isEnabled ? 'true' : 'false');
        } catch (e) {
            console.error('儲存夜間模式設定失敗:', e);
        }
    },

    loadNightMode() {
        try {
            return localStorage.getItem('nightMode') === 'true';
        } catch (e) {
            console.error('載入夜間模式設定失敗:', e);
            return false;
        }
    },

    clearAll() {
        try {
            localStorage.removeItem('markdown-content');
            localStorage.removeItem('nightMode');
        } catch (e) {
            console.error('清除資料失敗:', e);
        }
    }
};
