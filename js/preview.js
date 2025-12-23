const Preview = {
    element: null,

    init() {
        this.element = document.getElementById('preview');
        
        marked.setOptions({
            breaks: true,
            gfm: true,
            headerIds: true,
            mangle: false
        });
    },

    update(markdown) {
        const html = this.processLatex(markdown);
        this.element.innerHTML = html;
    },

    processLatex(text) {
        const blockMathPlaceholders = [];
        text = text.replace(/\$\$([\s\S]+?)\$\$/g, (match, formula) => {
            const placeholder = `__BLOCK_MATH_${blockMathPlaceholders.length}__`;
            blockMathPlaceholders.push(formula.trim());
            return placeholder;
        });

        const inlineMathPlaceholders = [];
        text = text.replace(/\$([^\$\n]+?)\$/g, (match, formula) => {
            const placeholder = `__INLINE_MATH_${inlineMathPlaceholders.length}__`;
            inlineMathPlaceholders.push(formula.trim());
            return placeholder;
        });

        let html = marked.parse(text);

        blockMathPlaceholders.forEach((formula, index) => {
            const placeholder = `__BLOCK_MATH_${index}__`;
            try {
                const rendered = katex.renderToString(formula, {
                    displayMode: true,
                    throwOnError: false,
                    output: 'html'
                });
                html = html.replace(placeholder, rendered);
            } catch (e) {
                html = html.replace(placeholder, `<div class="math-error">LaTeX 錯誤: ${e.message}</div>`);
            }
        });

        inlineMathPlaceholders.forEach((formula, index) => {
            const placeholder = `__INLINE_MATH_${index}__`;
            try {
                const rendered = katex.renderToString(formula, {
                    displayMode: false,
                    throwOnError: false,
                    output: 'html'
                });
                html = html.replace(placeholder, rendered);
            } catch (e) {
                html = html.replace(placeholder, `<span class="math-error">LaTeX 錯誤: ${e.message}</span>`);
            }
        });

        return html;
    },

    hide() {
        this.element.classList.add('hidden');
    },

    show() {
        this.element.classList.remove('hidden');
    }
};
