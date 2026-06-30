/**
 * Convert a rendered DOM element into a complete HTML document.
 * The generated HTML is used by the backend for PDF rendering and by
 * html-docx-js for Word export.
 */
const WORD_EXPORT_FONT_FAMILY = "'Times New Roman', Times, serif";
const DOCUMENT_FONT_SIZE = "14pt";
const TABLE_FONT_SIZE = "11pt";
const DOCUMENT_LINE_HEIGHT = "1.5";
const TABLE_LINE_HEIGHT = "1.25";
const MM_TO_TWIPS = 56.7;

const DOC_EXPORT_PAGE_MARGINS_MM = {
    portrait: { top: 20, right: 15, bottom: 20, left: 30 },
    landscape: { top: 20, right: 15, bottom: 20, left: 30 },
};

function getDocExportPageMarginsMm(landscape = false) {
    return landscape ? DOC_EXPORT_PAGE_MARGINS_MM.landscape : DOC_EXPORT_PAGE_MARGINS_MM.portrait;
}

export function getDocExportPageMarginsTwips(landscape = false) {
    const margins = getDocExportPageMarginsMm(landscape);

    return {
        top: Math.round(margins.top * MM_TO_TWIPS),
        right: Math.round(margins.right * MM_TO_TWIPS),
        bottom: Math.round(margins.bottom * MM_TO_TWIPS),
        left: Math.round(margins.left * MM_TO_TWIPS),
        header: 0,
        footer: 0,
        gutter: 0,
    };
}

function getPageMarginCss(landscape = false) {
    const margins = getDocExportPageMarginsMm(landscape);
    return `${margins.top}mm ${margins.right}mm ${margins.bottom}mm ${margins.left}mm`;
}

function appendInlineStyle(node, styleText) {
    const currentStyle = node.getAttribute("style") || "";
    const separator = currentStyle.trim() && !currentStyle.trim().endsWith(";") ? "; " : "";
    node.setAttribute("style", `${currentStyle}${separator}${styleText};`);
}

function getWordExportFontInlineStyle(node) {
    const isSignatureContent = !!node.closest?.("[data-export-signature-table]");
    const isTableContent = !!node.closest?.("table") && !isSignatureContent;
    const fontSize = isTableContent ? TABLE_FONT_SIZE : DOCUMENT_FONT_SIZE;
    const lineHeight = isTableContent ? TABLE_LINE_HEIGHT : DOCUMENT_LINE_HEIGHT;

    return [
        `font-family: ${WORD_EXPORT_FONT_FAMILY} !important`,
        `font-size: ${fontSize} !important`,
        `line-height: ${lineHeight} !important`,
        "mso-ascii-font-family: 'Times New Roman'",
        "mso-hansi-font-family: 'Times New Roman'",
        "mso-bidi-font-family: 'Times New Roman'",
        "mso-fareast-font-family: 'Times New Roman'",
    ].join("; ");
}

function createWordExportTextSpan(textNode) {
    const span = document.createElement("span");
    span.textContent = textNode.nodeValue;
    appendInlineStyle(span, getWordExportFontInlineStyle(textNode.parentElement || span));
    return span;
}

function appendWordExportFontStyle(node) {
    appendInlineStyle(node, getWordExportFontInlineStyle(node));
}

function convertTableHeadersToBodyRows(root) {
    root.querySelectorAll("thead").forEach((thead) => {
        const tbody = document.createElement("tbody");

        Array.from(thead.attributes).forEach((attribute) => {
            tbody.setAttribute(attribute.name, attribute.value);
        });

        while (thead.firstChild) {
            tbody.appendChild(thead.firstChild);
        }

        thead.replaceWith(tbody);
    });
}

function normalizeSignatureText(value = "") {
    return String(value)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

function isSignatureText(value = "") {
    const text = normalizeSignatureText(value);
    return text.includes("ky") && (text.includes("ghi ho ten") || text.includes("ghi ro ho ten"));
}

function markSignatureElements(root) {
    [root, ...root.querySelectorAll("*")].forEach((node) => {
        const className = node.getAttribute("class") || "";

        if (/signatureRow/i.test(className)) {
            node.setAttribute("data-export-signature-row", "");
            appendInlineStyle(node, "display: block !important; width: 100% !important; text-align: right !important");
        }

        if (/signatureBlock/i.test(className)) {
            node.setAttribute("data-export-signature-block", "");
            appendInlineStyle(
                node,
                "display: inline-block !important; width: 70mm !important; min-width: 58mm !important; max-width: 70mm !important; margin-left: auto !important; margin-right: 0 !important; text-align: center !important; vertical-align: top !important",
            );
        }
    });

    root.querySelectorAll("table").forEach((table) => {
        if (!isSignatureText(table.textContent)) return;

        table.setAttribute("data-export-signature-table", "");
        appendInlineStyle(
            table,
            "width: 100% !important; margin-left: auto !important; margin-right: 0 !important; table-layout: fixed !important",
        );

        const firstRowCells = Array.from(table.rows?.[0]?.cells || []);
        if (firstRowCells.length > 1) {
            appendInlineStyle(firstRowCells[0], "width: auto !important");
            appendInlineStyle(
                firstRowCells[firstRowCells.length - 1],
                "width: 70mm !important; max-width: 70mm !important; text-align: center !important; padding-right: 0 !important; white-space: normal !important",
            );
        }

        table.querySelectorAll("td, th").forEach((cell) => {
            if (!isSignatureText(cell.textContent)) return;

            cell.setAttribute("data-export-signature-cell", "");
            appendInlineStyle(
                cell,
                "width: 70mm !important; max-width: 70mm !important; text-align: center !important; padding-right: 0 !important; white-space: normal !important",
            );
        });
    });
}

function wrapTextNodesForWord(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(textNode) {
            const parent = textNode.parentElement;
            if (!parent || !textNode.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
            if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
        },
    });

    const textNodes = [];
    while (walker.nextNode()) {
        textNodes.push(walker.currentNode);
    }

    textNodes.forEach((textNode) => {
        textNode.replaceWith(createWordExportTextSpan(textNode));
    });
}

function normalizeExportMarkup(element, { normalizeForWord = false } = {}) {
    const exportElement = element.cloneNode(true);
    exportElement.classList.add("document-export-root");
    exportElement.setAttribute("data-document-export-root", "");

    markSignatureElements(exportElement);

    if (normalizeForWord) {
        convertTableHeadersToBodyRows(exportElement);
        [exportElement, ...exportElement.querySelectorAll("*")].forEach(appendWordExportFontStyle);
        wrapTextNodesForWord(exportElement);
    }

    return exportElement.outerHTML;
}

export function generateHtmlString(element, options = {}) {
    const { title = "Bieu mau", lang = "vi", landscape = false, normalizeForWord = false } = options;
    const pageMarginCss = getPageMarginCss(landscape);
    const landscapePageMarginCss = getPageMarginCss(true);
    const bodyHtml = normalizeExportMarkup(element, { normalizeForWord });

    let cssText = "";
    try {
        for (const sheet of document.styleSheets) {
            try {
                const rules = sheet.cssRules || sheet.rules;
                if (!rules) continue;
                for (const rule of rules) {
                    const ruleText = rule.cssText;
                    if (ruleText.includes("font-family") && !ruleText.includes("Times New Roman")) {
                        cssText += ruleText.replace(/font-family\s*:[^;]+;?/gi, "") + "\n";
                    } else {
                        cssText += ruleText + "\n";
                    }
                }
            } catch {
                // Ignore cross-origin stylesheets.
            }
        }
    } catch (err) {
        console.warn("[generateHtmlFile] Unable to read stylesheets:", err);
    }

    return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="pdf-orientation" content="${landscape ? "landscape" : "portrait"}" />
  <title>${title}</title>
  <style>
    ${cssText}
  </style>
  <style>
    *, *::before, *::after { box-sizing: border-box; }

    :root {
      --procedure-confirmation-font-size: ${DOCUMENT_FONT_SIZE};
    }

    @page {
      size: A4 ${landscape ? "landscape" : "portrait"};
      margin: ${pageMarginCss};
    }

    @page landscape {
      size: A4 landscape;
      margin: ${landscapePageMarginCss};
    }

    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      background: #fff;
      color: #000;
      font-family: ${WORD_EXPORT_FONT_FAMILY} !important;
      mso-ascii-font-family: 'Times New Roman';
      mso-hansi-font-family: 'Times New Roman';
      mso-bidi-font-family: 'Times New Roman';
      mso-fareast-font-family: 'Times New Roman';
      font-size: ${DOCUMENT_FONT_SIZE} !important;
      line-height: ${DOCUMENT_LINE_HEIGHT};
    }

    .document-export-root,
    .document-export-root > div {
      width: 100% !important;
      max-width: none !important;
      margin: 0 !important;
      padding: 0 !important;
      background: #fff !important;
      box-shadow: none !important;
      border-radius: 0 !important;
    }

    p, span, div, td, th, li, ul, ol, h1, h2, h3, h4, h5, h6,
    strong, em, b, i, a, label, pre, table, tbody, tr, input, textarea, select {
      font-family: ${WORD_EXPORT_FONT_FAMILY} !important;
      mso-ascii-font-family: 'Times New Roman';
      mso-hansi-font-family: 'Times New Roman';
      mso-bidi-font-family: 'Times New Roman';
      mso-fareast-font-family: 'Times New Roman';
      font-size: ${DOCUMENT_FONT_SIZE} !important;
      line-height: ${DOCUMENT_LINE_HEIGHT} !important;
    }

    .document-export-root [class*="tableContainer"],
    .document-export-root [class*="tableScrollWrapper"] {
      overflow: visible !important;
      max-width: 100% !important;
    }

    table {
      width: 100% !important;
      max-width: 100% !important;
      min-width: 0 !important;
      zoom: ${landscape ? "0.90" : "1"} !important;
    }

    table td, table th {
      word-wrap: break-word !important;
      overflow-wrap: break-word !important;
      word-break: normal !important;
      white-space: normal !important;
      font-family: ${WORD_EXPORT_FONT_FAMILY} !important;
      mso-ascii-font-family: 'Times New Roman';
      mso-hansi-font-family: 'Times New Roman';
      mso-bidi-font-family: 'Times New Roman';
      mso-fareast-font-family: 'Times New Roman';
      font-size: ${TABLE_FONT_SIZE} !important;
      line-height: ${TABLE_LINE_HEIGHT} !important;
    }

    table p, table span, table div, table strong, table em, table b, table i, table li {
      font-size: ${TABLE_FONT_SIZE} !important;
      line-height: ${TABLE_LINE_HEIGHT} !important;
    }

    [data-export-signature-row] {
      display: block !important;
      text-align: right !important;
      width: 100% !important;
    }

    [data-export-signature-block] {
      display: inline-block !important;
      width: 70mm !important;
      min-width: 58mm !important;
      max-width: 70mm !important;
      margin-left: auto !important;
      margin-right: 0 !important;
      text-align: center !important;
      vertical-align: top !important;
    }

    [data-export-signature-table] {
      width: 100% !important;
      margin-left: auto !important;
      margin-right: 0 !important;
      table-layout: fixed !important;
    }

    [data-export-signature-table] td:first-child {
      width: auto !important;
    }

    [data-export-signature-cell] {
      width: 70mm !important;
      max-width: 70mm !important;
      text-align: center !important;
      padding-right: 0 !important;
      white-space: normal !important;
    }

    [data-export-signature-table] td,
    [data-export-signature-table] th,
    [data-export-signature-table] p,
    [data-export-signature-table] span,
    [data-export-signature-table] strong,
    [data-export-signature-table] em,
    [data-export-signature-table] b,
    [data-export-signature-table] i {
      font-size: ${DOCUMENT_FONT_SIZE} !important;
      line-height: ${DOCUMENT_LINE_HEIGHT} !important;
    }

    ${
        normalizeForWord
            ? `
    thead {
      display: table-row-group !important;
    }
    `
            : ""
    }
  </style>
</head>
<body>
  ${bodyHtml}
</body>
</html>`;
}

/**
 * Create an HTML File from a rendered DOM element.
 */
export function generateHtmlFile(element, filename, options = {}) {
    const htmlString = generateHtmlString(element, { title: filename, ...options });
    const blob = new Blob([htmlString], { type: "text/html; charset=utf-8" });
    return new File([blob], filename, { type: "text/html" });
}
