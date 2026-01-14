const ExportManager = {
    /** 初始化匯出下拉選單並綁定操作 */
    init() {

        const dropdown = document.getElementById('exportDropdownWrapper');
        const dropdownToggle = document.getElementById('exportDropdown');
        if (!dropdown || !dropdownToggle) {
            return;
        }

        dropdownToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        }, true);

        document.getElementById('exportMd').addEventListener('click', (e) => {
            e.preventDefault();
            this.exportMarkdown();
            dropdown.classList.remove('active');
        });

        document.getElementById('exportTex').addEventListener('click', (e) => {
            e.preventDefault();
            this.exportLatex();
            dropdown.classList.remove('active');
        });

        document.getElementById('exportPdf').addEventListener('click', (e) => {
            e.preventDefault();
            this.exportPdf();
            dropdown.classList.remove('active');
        });
    },

    /** 以檔案下載目前 Markdown 內容 */
    exportMarkdown() {
        const content = Editor.getContent();
        const blob = new Blob([content], { type: 'text/markdown' });
        this.downloadFile(blob, 'document.md');
    },

    /** 轉換目前內容為 LaTeX 並下載 .tex 檔 */
    exportLatex() {
        const markdown = Editor.getContent();
        const latex = Editor.convertToLatex(markdown);
        const blob = new Blob([latex], { type: 'text/plain' });
        this.downloadFile(blob, 'document.tex');
    },

    /** 觸發列印（可用做快速輸出 PDF） */
    exportPdf() {
        window.print();
    },

    /** 透過 Blob 與臨時連結觸發檔案下載 */
    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};
