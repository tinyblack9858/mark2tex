// LATEX_TEMPLATES: LaTeX 模板集合，用於將 Markdown 轉為 LaTeX
const LATEX_TEMPLATES = {
    article: {
        label: 'General Article',
        preamble: `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{graphicx}
\\usepackage{hyperref}
\\usepackage{xeCJK}
\\title{Document}
\\author{}
\\date{\\today}`,
        beforeBody: `\\begin{document}
\\maketitle

`,
        afterBody: `\\end{document}`
    },
    ieee: {
        label: 'IEEE Conference',
        preamble: `\\documentclass[conference]{IEEEtran}
\\IEEEoverridecommandlockouts
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{graphicx}
\\usepackage{hyperref}
\\usepackage{xeCJK}
\\title{Document}
\\author{\\IEEEauthorblockN{Author Name}\\IEEEauthorblockA{Institution \\\\ email@example.com}}
\\date{}`,
        beforeBody: `\\begin{document}
\\maketitle

`,
        afterBody: `\\end{document}`
    },
    apa: {
        label: 'APA 7 Manuscript',
        preamble: `\\documentclass[man]{apa7}
\\usepackage[utf8]{inputenc}
\\usepackage[american]{babel}
\\usepackage{csquotes}
\\usepackage{hyperref}
\\usepackage{xeCJK}
\\title{Document}
\\author{Author Name}
\\date{\\today}`,
        beforeBody: `\\begin{document}
\\maketitle

`,
        afterBody: `\\end{document}`
    }
};

/**
 * Editor: 管理編輯器 DOM、事件、模板與自動儲存
 */
const Editor = {
    elements: {
        editor: null,
        templateDropdown: null,
        templateLabel: null,
        templateWrapper: null
    },
    
    selectedTemplate: 'article',
    saveTimeout: null,

    /** 初始化編輯器：取得 DOM、載入內容、設定事件與模板 */
    init() {
        // 取得 DOM 元素
        this.elements.editor = document.getElementById('editor');
        this.elements.templateDropdown = document.getElementById('templateDropdown');
        this.elements.templateLabel = document.getElementById('templateLabel');
        this.elements.templateWrapper = document.querySelector('.template-dropdown');

        this.loadContent();
        this.selectedTemplate = Storage.loadTemplate();
        this.updateTemplateLabel();

        this.setupEventListeners();
        this.setupTemplateDropdown();
    },

    /** 綁定編輯器事件（輸入、Tab 鍵處理） */
    setupEventListeners() {
        this.elements.editor.addEventListener('input', () => {
            Preview.update(this.elements.editor.value);
            this.autoSave();
        });

        this.elements.editor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                this.insertTab();
            }
        });
    },

    /** 設定模板下拉選單互動行為 */
    setupTemplateDropdown() {
        const wrapper = this.elements.templateWrapper;
        const dropdownBtn = this.elements.templateDropdown;
        if (!wrapper || !dropdownBtn) {
            return;
        }

        dropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            wrapper.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target)) {
                wrapper.classList.remove('active');
            }
        }, true);

        wrapper.querySelectorAll('[data-template-option]').forEach((option) => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const templateKey = option.dataset.templateOption;
                this.setTemplate(templateKey);
                wrapper.classList.remove('active');
            });
        });
    },

    /** 從 Storage 載入內容並更新預覽 */
    loadContent() {
        const saved = Storage.loadContent();
        if (saved) {
            this.elements.editor.value = saved;
            Preview.update(saved);
        } else {
            Preview.update(this.elements.editor.value);
        }
    },

    /** 延遲自動儲存編輯內容（debounce） */
    autoSave() {
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
            Storage.saveContent(this.elements.editor.value);
        }, 1000);
    },

    /** 設定目前 LaTeX 模板並儲存選擇 */
    setTemplate(templateKey) {
        if (!LATEX_TEMPLATES[templateKey]) {
            return;
        }
        this.selectedTemplate = templateKey;
        Storage.saveTemplate(templateKey);
        this.updateTemplateLabel();
    },

    /** 更新模板標籤文字以反映目前選擇 */
    updateTemplateLabel() {
        if (this.elements.templateLabel) {
            this.elements.templateLabel.textContent = LATEX_TEMPLATES[this.selectedTemplate].label;
        }
    },

    /** 在 textarea 插入 Tab（四個空格） */
    insertTab() {
        const textarea = this.elements.editor;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;
        textarea.value = value.substring(0, start) + '    ' + value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 4;
    },

    /** 將 Markdown 內容轉換為 LaTeX 字串 */
    convertToLatex(markdown) {
        const template = LATEX_TEMPLATES[this.selectedTemplate] || LATEX_TEMPLATES.article;
        let latex = `${template.preamble}` + '\n\n' + template.beforeBody;

        markdown = markdown.replace(/^# (.+)$/gm, '\\section{$1}');
        markdown = markdown.replace(/^## (.+)$/gm, '\\subsection{$1}');
        markdown = markdown.replace(/^### (.+)$/gm, '\\subsubsection{$1}');

        markdown = markdown.replace(/\*\*(.+?)\*\*/g, '\\textbf{$1}');
        markdown = markdown.replace(/\*(.+?)\*/g, '\\textit{$1}');

        markdown = markdown.replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
            return `\\begin{equation}\n${formula.trim()}\n\\end{equation}`;
        });

        markdown = markdown.replace(/^- (.+)$/gm, '\\item $1');
        markdown = markdown.replace(/((?:\\item .+\n)+)/g, '\\begin{itemize}\n$1\\end{itemize}\n');

        latex += markdown;
        latex += '\n' + template.afterBody;

        return latex;
    },

    /** 取得編輯器目前內容 */
    getContent() {
        return this.elements.editor.value;
    }
};
