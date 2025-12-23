// export.js - 匯出功能管理

const ExportManager = {
    init() {
        // 下拉選單控制
        const dropdown = document.querySelector('.dropdown');
        const dropdownToggle = document.getElementById('exportDropdown');
        const exportMenu = document.getElementById('exportMenu');

        // 切換下拉選單
        dropdownToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });

        // 點擊外部關閉下拉選單
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });

        // 匯出功能
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

    exportMarkdown() {
        const content = Editor.getContent();
        const blob = new Blob([content], { type: 'text/markdown' });
        this.downloadFile(blob, 'document.md');
    },

    exportLatex() {
        const markdown = Editor.getContent();
        const latex = Editor.convertToLatex(markdown);
        const blob = new Blob([latex], { type: 'text/plain' });
        this.downloadFile(blob, 'document.tex');
    },

    exportPdf() {
        window.print();
    },

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
