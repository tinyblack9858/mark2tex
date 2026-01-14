const Storage = {

    /** 儲存 Markdown 內容到 localStorage */
    saveContent(content) {
        try {
            localStorage.setItem('markdown-content', content);
        } catch (e) {
            console.error('儲存失敗:', e);
        }
    },

    /** 從 localStorage 讀取 Markdown 內容 */
    loadContent() {
        try {
            return localStorage.getItem('markdown-content') || '';
        } catch (e) {
            console.error('載入失敗:', e);
            return '';
        }
    },

    /** 儲存使用者選擇的 LaTeX 範本 */
    saveTemplate(templateKey) {
        try {
            localStorage.setItem('latex-template', templateKey);
        } catch (e) {
            console.error('儲存模板設定失敗:', e);
        }
    },

    /** 讀取使用者選擇的 LaTeX 範本 */
    loadTemplate() {
        try {
            return localStorage.getItem('latex-template') || 'article';
        } catch (e) {
            console.error('載入模板設定失敗:', e);
            return 'article';
        }
    },

    /** 儲存夜間模式設定 */
    saveNightMode(isEnabled) {
        try {
            localStorage.setItem('nightMode', isEnabled ? 'true' : 'false');
        } catch (e) {
            console.error('儲存夜間模式設定失敗:', e);
        }
    },

    /** 讀取夜間模式設定 */
    loadNightMode() {
        try {
            return localStorage.getItem('nightMode') === 'true';
        } catch (e) {
            console.error('載入夜間模式設定失敗:', e);
            return false;
        }
    },

    /** 清除儲存的使用者資料（內容與夜間模式） */
    clearAll() {
        try {
            localStorage.removeItem('markdown-content');
            localStorage.removeItem('nightMode');
        } catch (e) {
            console.error('清除資料失敗:', e);
        }
    }
};
