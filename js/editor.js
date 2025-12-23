const Editor = {
    elements: {
        editor: null,
        latexEditor: null,
        previewTitle: null,
        toggleModeBtn: null
    },
    
    isLatexEditMode: false,
    saveTimeout: null,

    init() {
        // 取得 DOM 元素
        this.elements.editor = document.getElementById('editor');
        this.elements.latexEditor = document.getElementById('latexEditor');
        this.elements.previewTitle = document.getElementById('previewTitle');
        this.elements.toggleModeBtn = document.getElementById('toggleMode');

        this.loadContent();

        // 預設僅 Markdown 可編輯
        this.elements.editor.readOnly = false;
        this.elements.latexEditor.readOnly = true;

        this.setupEventListeners();
    },

    setupEventListeners() {
        this.elements.editor.addEventListener('input', () => {
            Preview.update(this.elements.editor.value);
            this.autoSave();
        });

        // LaTeX 編輯器輸入事件
        this.elements.latexEditor.addEventListener('input', () => {
            if (this.isLatexEditMode) {
                const latex = this.elements.latexEditor.value;
                this.elements.editor.value = this.convertFromLatex(latex);
            }
        });

        this.elements.toggleModeBtn.addEventListener('click', () => {
            this.toggleMode();
        });

        this.elements.editor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                this.insertTab();
            }
        });

        this.elements.latexEditor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                this.insertTab(true);
            }
        });
    },

    loadContent() {
        const saved = Storage.loadContent();
        if (saved) {
            this.elements.editor.value = saved;
            Preview.update(saved);
        } else {
            Preview.update(this.elements.editor.value);
        }
    },

    autoSave() {
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(() => {
            Storage.saveContent(this.elements.editor.value);
        }, 1000);
    },

    insertTab(isLatex = false) {
        const textarea = isLatex ? this.elements.latexEditor : this.elements.editor;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;
        textarea.value = value.substring(0, start) + '    ' + value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 4;
    },

    toggleMode() {
        this.isLatexEditMode = !this.isLatexEditMode;
        
        if (this.isLatexEditMode) {
            // 切換到 LaTeX 編輯模式：右側可寫，左側唯讀
            Preview.hide();
            this.elements.latexEditor.classList.add('active');
            this.elements.latexEditor.readOnly = false;
            this.elements.editor.readOnly = true;
            this.elements.toggleModeBtn.textContent = '編輯 Markdown';
            this.elements.previewTitle.textContent = 'LaTeX 編輯器';
            
            const markdown = this.elements.editor.value;
            this.elements.latexEditor.value = this.convertToLatex(markdown);
            this.elements.latexEditor.focus();
        } else {
            // 切換回 Markdown 編輯：左側可寫，右側唯讀
            Preview.show();
            this.elements.latexEditor.classList.remove('active');
            this.elements.latexEditor.readOnly = true;
            this.elements.editor.readOnly = false;
            this.elements.toggleModeBtn.textContent = '編輯 LaTeX';
            this.elements.previewTitle.textContent = '即時預覽';
            
            const latex = this.elements.latexEditor.value;
            this.elements.editor.value = this.convertFromLatex(latex);
            Preview.update(this.elements.editor.value);
            this.elements.editor.focus();
        }
    },

    convertToLatex(markdown) {
        let latex = `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{graphicx}
\\usepackage{hyperref}
\\usepackage{xeCJK}

\\title{Document}
\\author{}
\\date{}

\\begin{document}
\\maketitle

`;

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
        latex += '\n\\end{document}';

        return latex;
    },

    convertFromLatex(latex) {
        let markdown = latex;
        
        markdown = markdown.replace(/\\documentclass\{[^}]*\}[\s\S]*?\\begin\{document\}/g, '');
        markdown = markdown.replace(/\\end\{document\}/g, '');
        markdown = markdown.replace(/\\usepackage(\[[^\]]*\])?\{[^}]*\}/g, '');
        markdown = markdown.replace(/\\title\{[^}]*\}/g, '');
        markdown = markdown.replace(/\\author\{[^}]*\}/g, '');
        markdown = markdown.replace(/\\date\{[^}]*\}/g, '');
        markdown = markdown.replace(/\\maketitle/g, '');
        
        markdown = markdown.replace(/\\section\{([^}]+)\}/g, '# $1');
        markdown = markdown.replace(/\\subsection\{([^}]+)\}/g, '## $1');
        markdown = markdown.replace(/\\subsubsection\{([^}]+)\}/g, '### $1');
        
        markdown = markdown.replace(/\\textbf\{([^}]+)\}/g, '**$1**');
        markdown = markdown.replace(/\\textit\{([^}]+)\}/g, '*$1*');
        
        markdown = markdown.replace(/\\begin\{equation\}([\s\S]*?)\\end\{equation\}/g, (match, formula) => {
            return `$$${formula.trim()}$$`;
        });
        
        markdown = markdown.replace(/\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g, (match, items) => {
            return items.replace(/\\item\s+/g, '- ');
        });
        
        markdown = markdown.replace(/\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g, (match, items) => {
            let counter = 1;
            return items.replace(/\\item\s+/g, () => `${counter++}. `);
        });
        
        markdown = markdown.replace(/\n{3,}/g, '\n\n');
        markdown = markdown.trim();
        
        return markdown;
    },

    getContent() {
        return this.elements.editor.value;
    }
};
