/**
 * Convert a rendered DOM element into a complete HTML document.
 * The generated HTML is used by the backend for PDF rendering and by
 * the export_docx service for Word export.
 */
const WORD_EXPORT_FONT_FAMILY = "Times New Roman, Times, serif";
const DOCUMENT_FONT_SIZE = "14pt";
const TABLE_FONT_SIZE = "11pt";
const WORD_DOCUMENT_FONT_SIZE = "13pt";
const WORD_TABLE_FONT_SIZE = "13pt";
const WORD_COMPACT_TABLE_FONT_SIZE = "8.5pt";
const EXPORT_TABLE_FONT_10_SIZE = "12pt";
const WORD_CHECKBOX_FONT_SIZE = "18pt";
const DOCUMENT_LINE_HEIGHT = "1.5";
const TABLE_LINE_HEIGHT = "1.25";
const COMPACT_TABLE_LINE_HEIGHT = "1.05";
const EXPORT_TABLE_FONT_10_LINE_HEIGHT = "1.2";
const MM_TO_TWIPS = 56.7;
const A4_PAGE_SIZE_MM = { width: 210, height: 297 };

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

export function getDocExportPageSizeTwips(landscape = false) {
    const width = Math.round(A4_PAGE_SIZE_MM.width * MM_TO_TWIPS);
    const height = Math.round(A4_PAGE_SIZE_MM.height * MM_TO_TWIPS);

    return landscape ? { width: height, height: width } : { width, height };
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

function appendInlineStyleIfMissing(node, propertyPattern, styleText) {
    const currentStyle = node.getAttribute("style") || "";
    if (!propertyPattern.test(currentStyle)) {
        appendInlineStyle(node, styleText);
    }
}

function appendInlineStyleOverride(node, propertyPattern, styleText) {
    const currentStyle = node.getAttribute("style") || "";
    const preservedDeclarations = currentStyle
        .split(";")
        .map((declaration) => declaration.trim())
        .filter((declaration) => declaration && !propertyPattern.test(declaration));

    node.setAttribute("style", preservedDeclarations.join("; "));
    appendInlineStyle(node, styleText);
}

function hasInlineStyleValue(node, propertyPattern, valuePattern) {
    let current = node;
    while (current?.nodeType === Node.ELEMENT_NODE) {
        const style = current.getAttribute("style") || "";
        if (propertyPattern.test(style) && valuePattern.test(style)) return true;
        current = current.parentElement;
    }

    return false;
}

function shouldPreserveBold(node) {
    return (
        !!node.closest?.("strong, b") ||
        hasInlineStyleValue(node, /\bfont-weight\s*:/i, /\b(bold|[6-9]00|700)\b/i)
    );
}

function shouldPreserveItalic(node) {
    return !!node.closest?.("em, i") || hasInlineStyleValue(node, /\bfont-style\s*:/i, /\bitalic\b/i);
}

function shouldPreserveUnderline(node) {
    return !!node.closest?.("u") || hasInlineStyleValue(node, /\btext-decoration(?:-line)?\s*:/i, /\bunderline\b/i);
}

function getWordExportFontInlineStyle(node) {
    const isSignatureContent = !!node.closest?.("[data-export-signature-table]");
    const isTableContent = !!node.closest?.("table") && !isSignatureContent;
    const isCompactTableContent = !!node.closest?.(".docx-compact-table");
    const isExportTableFont10Content = !!node.closest?.(".export-table-font-10");
    const className = node?.getAttribute?.("class") || "";
    const isCheckboxSymbol = /checkbox(?:-|_)?symbol|checkbox/i.test(className);
    const fontSize = isCheckboxSymbol
        ? WORD_CHECKBOX_FONT_SIZE
        : isExportTableFont10Content
            ? EXPORT_TABLE_FONT_10_SIZE
            : isCompactTableContent
                ? WORD_COMPACT_TABLE_FONT_SIZE
                : isTableContent
                    ? WORD_TABLE_FONT_SIZE
                    : WORD_DOCUMENT_FONT_SIZE;
    const lineHeight = isExportTableFont10Content
        ? EXPORT_TABLE_FONT_10_LINE_HEIGHT
        : isCompactTableContent
            ? COMPACT_TABLE_LINE_HEIGHT
            : isTableContent
                ? TABLE_LINE_HEIGHT
                : DOCUMENT_LINE_HEIGHT;

    return [
        `font-family: ${WORD_EXPORT_FONT_FAMILY}`,
        `font-size: ${fontSize}`,
        `line-height: ${lineHeight}`,
        "mso-ascii-font-family: 'Times New Roman'",
        "mso-hansi-font-family: 'Times New Roman'",
        "mso-bidi-font-family: 'Times New Roman'",
        "mso-fareast-font-family: 'Times New Roman'",
        shouldPreserveBold(node) ? "font-weight: bold" : "",
        shouldPreserveItalic(node) ? "font-style: italic" : "",
        shouldPreserveUnderline(node) ? "text-decoration: underline" : "",
    ]
        .filter(Boolean)
        .join("; ");
}

function createWordExportTextSpan(textNode) {
    const sourceElement = textNode.parentElement || null;
    const span = document.createElement("span");
    span.textContent = textNode.nodeValue;
    appendInlineStyle(span, getWordExportFontInlineStyle(sourceElement || span));

    let styledNode = span;
    if (sourceElement && shouldPreserveUnderline(sourceElement) && !sourceElement.closest("u")) {
        const underline = document.createElement("u");
        appendInlineStyle(underline, getWordExportFontInlineStyle(sourceElement));
        underline.appendChild(styledNode);
        styledNode = underline;
    }

    if (sourceElement && shouldPreserveItalic(sourceElement) && !sourceElement.closest("em, i")) {
        const italic = document.createElement("em");
        appendInlineStyle(italic, getWordExportFontInlineStyle(sourceElement));
        italic.appendChild(styledNode);
        styledNode = italic;
    }

    if (sourceElement && shouldPreserveBold(sourceElement) && !sourceElement.closest("strong, b")) {
        const bold = document.createElement("strong");
        appendInlineStyle(bold, getWordExportFontInlineStyle(sourceElement));
        bold.appendChild(styledNode);
        styledNode = bold;
    }

    return styledNode;
}

/**
 * Strip the CSS `font` shorthand (e.g. `font: inherit`) and `font-family: inherit`
 * from an element's inline style. The `font` shorthand resets font-family, which
 * causes Word to fall back to its theme default (Aptos) instead of using the
 * explicit font-family we append.
 */
function stripFontShorthandFromInlineStyle(node) {
    const currentStyle = node.getAttribute("style");
    if (!currentStyle) return;

    const cleaned = currentStyle
        .replace(/\bfont\s*:[^;]+;?/gi, "")
        .replace(/\bfont-family\s*:[^;]+;?/gi, "")
        .trim();

    node.setAttribute("style", cleaned);
}

function appendWordExportFontStyle(node) {
    stripFontShorthandFromInlineStyle(node);
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

function getOrderedListMarker(list, index) {
    const start = Number.parseInt(list.getAttribute("start") || list.getAttribute("data-start") || "1", 10);
    const markerValue = Number.isFinite(start) ? start + index : index + 1;

    return `${markerValue}. `;
}

function prependListMarker(container, markerText) {
    const marker = document.createElement("span");
    marker.textContent = markerText;
    appendInlineStyle(marker, "font-weight: normal");

    const firstElement = container.firstElementChild;
    if (firstElement?.tagName === "P") {
        firstElement.insertBefore(marker, firstElement.firstChild);
        return;
    }

    container.insertBefore(marker, container.firstChild);
}

function convertListsToPlainBlocks(root) {
    Array.from(root.querySelectorAll("ol, ul"))
        .reverse()
        .forEach((list) => {
            const items = Array.from(list.children).filter((child) => child.tagName === "LI");
            const fragment = document.createDocumentFragment();

            items.forEach((item, index) => {
                const block = document.createElement("div");
                Array.from(item.attributes).forEach((attribute) => {
                    if (attribute.name === "value") return;
                    block.setAttribute(attribute.name, attribute.value);
                });
                appendInlineStyle(block, "display: block; margin: 0 0 0 18pt");

                while (item.firstChild) {
                    block.appendChild(item.firstChild);
                }

                const markerText = list.tagName === "OL" ? getOrderedListMarker(list, index) : "- ";
                prependListMarker(block, markerText);
                fragment.appendChild(block);
            });

            list.replaceWith(fragment);
        });
}

function convertNeutralBoldTags(root) {
    root.querySelectorAll("b").forEach((boldNode) => {
        const className = boldNode.getAttribute("class") || "";
        const style = boldNode.getAttribute("style") || "";
        const shouldRenderAsPlainText =
            /info(Label|Value)/i.test(className) || /\bfont-weight\s*:\s*(inherit|normal|unset|400)\b/i.test(style);

        if (!shouldRenderAsPlainText) return;

        const span = document.createElement("span");
        Array.from(boldNode.attributes).forEach((attribute) => {
            span.setAttribute(attribute.name, attribute.value);
        });

        while (boldNode.firstChild) {
            span.appendChild(boldNode.firstChild);
        }

        boldNode.replaceWith(span);
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
    const signatureWidth = "105mm";

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
                `display: inline-block !important; width: ${signatureWidth} !important; min-width: 70mm !important; max-width: ${signatureWidth} !important; margin-left: auto !important; margin-right: 0 !important; text-align: center !important; vertical-align: top !important`,
            );
        }
    });

    root.querySelectorAll("table").forEach((table) => {
        if (!isSignatureText(table.textContent)) return;

        const className = table.getAttribute("class") || "";
        const usesEvenSignatureColumns = /signature-even-table/i.test(className);
        const usesFixedSignatureColumns = /signature-table/i.test(className);
        const spacerWidth = usesFixedSignatureColumns ? "auto" : "auto";
        const signatureCellWidth = usesFixedSignatureColumns ? signatureWidth : signatureWidth;

        table.setAttribute("data-export-signature-table", "");

        if (usesEvenSignatureColumns) {
            appendInlineStyle(
                table,
                "width: 100% !important; margin-left: 0 !important; margin-right: 0 !important; table-layout: fixed !important",
            );

            table.querySelectorAll("td, th").forEach((cell) => {
                appendInlineStyle(
                    cell,
                    "border: none !important; text-align: center !important; vertical-align: top !important; padding-right: 0 !important; white-space: normal !important",
                );
            });
            return;
        }

        appendInlineStyle(
            table,
            /signature-single-table/i.test(className)
                ? `width: ${signatureWidth} !important; margin-left: auto !important; margin-right: 0 !important; table-layout: auto !important`
                : "width: 100% !important; margin-left: auto !important; margin-right: 0 !important; table-layout: fixed !important",
        );

        const firstRowCells = Array.from(table.rows?.[0]?.cells || []);
        if (firstRowCells.length > 1) {
            appendInlineStyle(firstRowCells[0], `width: ${spacerWidth} !important`);
            appendInlineStyle(
                firstRowCells[firstRowCells.length - 1],
                `width: ${signatureCellWidth} !important; max-width: ${signatureCellWidth} !important; text-align: center !important; padding-right: 0 !important; white-space: normal !important`,
            );
        }

        table.querySelectorAll("td, th").forEach((cell) => {
            if (!isSignatureText(cell.textContent)) return;

            cell.setAttribute("data-export-signature-cell", "");
            appendInlineStyle(
                cell,
                `width: ${signatureCellWidth} !important; max-width: ${signatureCellWidth} !important; text-align: center !important; padding-right: 0 !important; white-space: normal !important`,
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

function hasOnlyWhitespaceText(node) {
    return Array.from(node.childNodes).every((child) => child.nodeType !== Node.TEXT_NODE || !child.nodeValue.trim());
}

function getWordExportBodyMarkup(exportElement) {
    let contentRoot = exportElement;

    while (contentRoot.children.length === 1 && hasOnlyWhitespaceText(contentRoot)) {
        contentRoot = contentRoot.firstElementChild;
    }

    return contentRoot.innerHTML;
}

/**
 * Apply inline border styles to table cells based on CSS class names.
 * The export_docx server strips all <style> tags from full HTML documents,
 * so CSS class-based borders (e.g. `.single-border-table td { border: 1px solid #000 }`)
 * are lost. This function converts those class-based rules into inline styles
 * so borders survive the export pipeline.
 */
function applyTableBorderStyles(root) {
    // Tables with borders: single-border-table, bordered-table, list-table
    root.querySelectorAll("table.single-border-table, table.bordered-table, table.list-table").forEach((table) => {
        appendInlineStyleIfMissing(table, /\bwidth\s*:/i, "width: 100%");
        appendInlineStyleIfMissing(table, /\bborder-collapse\s*:/i, "border-collapse: collapse");
        appendInlineStyleIfMissing(table, /\btable-layout\s*:/i, "table-layout: auto");
        table.querySelectorAll("td, th").forEach((cell) => {
            const currentStyle = cell.getAttribute("style") || "";
            if (!/\bborder\s*:/i.test(currentStyle)) {
                appendInlineStyle(cell, "border: 1px solid #000");
            }
        });
    });

    // Tables without borders: no-border, signature-table
    root.querySelectorAll("table.no-border, table.signature-table, table.signature-even-table").forEach((table) => {
        appendInlineStyleIfMissing(table, /\bwidth\s*:/i, "width: 100%");
        appendInlineStyleIfMissing(table, /\bborder-collapse\s*:/i, "border-collapse: collapse");
        table.querySelectorAll("td, th").forEach((cell) => {
            appendInlineStyleOverride(cell, /^border\s*:/i, "border: none");
        });
    });
}

function getCssLengthInPoints(value = "") {
    const match = String(value).trim().match(/^(-?\d+(?:\.\d+)?)(px|pt|mm|cm|in)$/i);
    if (!match) return 0;

    const number = Number(match[1]);
    if (!Number.isFinite(number) || number <= 0) return 0;

    switch (match[2].toLowerCase()) {
        case "px":
            return number * 0.75;
        case "pt":
            return number;
        case "mm":
            return number * 2.8346;
        case "cm":
            return number * 28.346;
        case "in":
            return number * 72;
        default:
            return 0;
    }
}

function getNonBreakingSpaceCount(lengthInPoints) {
    if (lengthInPoints < 6) return 0;
    return Math.min(12, Math.max(2, Math.round(lengthInPoints / 6)));
}

function hasTextBeforeNode(node) {
    let current = node.previousSibling;
    while (current) {
        if (current.nodeType === Node.TEXT_NODE && current.nodeValue.trim()) return true;
        if (current.nodeType === Node.ELEMENT_NODE && current.textContent.trim()) return true;
        current = current.previousSibling;
    }

    return false;
}

function hasMaterializedInlineSpacing(node) {
    return node.firstChild?.nodeType === Node.TEXT_NODE && /^\u00a0{2,}/.test(node.firstChild.nodeValue || "");
}

function materializeInlineLeftSpacing(root) {
    root.querySelectorAll("*").forEach((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        if (hasMaterializedInlineSpacing(node) || !hasTextBeforeNode(node)) return;

        const computedStyle = window.getComputedStyle(node);
        const display = computedStyle.display || "";
        const className = node.getAttribute("class") || "";
        const isInlineLike = /^(inline|inline-block|inline-flex)$/i.test(display) || /inlineField/i.test(className);
        if (!isInlineLike) return;

        const spaceCount = getNonBreakingSpaceCount(getCssLengthInPoints(computedStyle.marginLeft));
        if (!spaceCount) return;

        node.insertBefore(document.createTextNode("\u00A0".repeat(spaceCount)), node.firstChild);
        appendInlineStyle(node, "margin-left: 0");
    });
}

function applyWordExportUtilityStyles(root) {
    root.querySelectorAll("table.docx-contained-table").forEach((table) => {
        appendInlineStyle(table, "width: 100%; max-width: 100%; border-collapse: collapse; table-layout: fixed");
        table.querySelectorAll("td, th").forEach((cell) => {
            appendInlineStyle(cell, "max-width: 100%; overflow-wrap: break-word; word-break: normal; white-space: normal");
        });
    });

    root.querySelectorAll("table.docx-choice-table").forEach((table) => {
        appendInlineStyle(table, "margin-top: 2pt; margin-bottom: 2pt");
        table.querySelectorAll("td, th").forEach((cell) => {
            appendInlineStyle(cell, "padding: 1pt 4pt 1pt 0; vertical-align: top");
        });
    });

    root.querySelectorAll("table.docx-compact-table").forEach((table) => {
        appendInlineStyle(table, "width: 100%; max-width: 100%; border-collapse: collapse; table-layout: fixed");
        table.querySelectorAll("td, th").forEach((cell) => {
            appendInlineStyle(
                cell,
                `padding: 2pt 3pt; font-size: ${WORD_COMPACT_TABLE_FONT_SIZE}; line-height: ${COMPACT_TABLE_LINE_HEIGHT}; overflow-wrap: anywhere; word-break: break-word; white-space: normal`,
            );
        });
    });
}

/**
 * Apply inline font-weight/text-align/text-decoration/font-style to elements
 * that rely on CSS module classes for these properties. Since CSS module class
 * names are hashed and the style tags are stripped during export, computed
 * styles need to be inlined.
 */
function applyComputedTextStyles(root) {
    root.querySelectorAll("*").forEach((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        const computedStyle = window.getComputedStyle(node);
        const inlineStyle = node.getAttribute("style") || "";

        // Bold: computed fontWeight >= 600 or "bold"
        const computedWeight = computedStyle.fontWeight;
        const isBold = computedWeight === "bold" || Number(computedWeight) >= 600;
        if (isBold && !/\bfont-weight\s*:/i.test(inlineStyle) && !node.closest("strong, b")) {
            appendInlineStyle(node, "font-weight: bold");
        }

        // Text-align: center or right (only on block elements / cells)
        const computedAlign = computedStyle.textAlign;
        if (["center", "right"].includes(computedAlign) && !/\btext-align\s*:/i.test(inlineStyle)) {
            const tagName = node.tagName.toUpperCase();
            if (["P", "DIV", "TD", "TH", "H1", "H2", "H3", "H4", "H5", "H6"].includes(tagName)) {
                appendInlineStyle(node, `text-align: ${computedAlign}`);
            }
        }

        // Text-decoration: underline
        const computedDecoration = computedStyle.textDecorationLine || computedStyle.textDecoration || "";
        if (computedDecoration.includes("underline") && !/\btext-decoration\s*:/i.test(inlineStyle) && !node.closest("u")) {
            appendInlineStyle(node, "text-decoration: underline");
        }

        // Font-style: italic
        if (computedStyle.fontStyle === "italic" && !/\bfont-style\s*:/i.test(inlineStyle) && !node.closest("em, i")) {
            appendInlineStyle(node, "font-style: italic");
        }
    });
}

function normalizeExportMarkup(element, { normalizeForWord = false } = {}) {
    const exportElement = element.cloneNode(true);
    exportElement.classList.add("document-export-root");
    exportElement.setAttribute("data-document-export-root", "");

    markSignatureElements(exportElement);

    if (normalizeForWord) {
        // Temporarily attach to DOM to enable getComputedStyle
        const offscreen = document.createElement("div");
        offscreen.style.cssText = "position:absolute;left:-9999px;top:-9999px;width:210mm;visibility:hidden;pointer-events:none";
        offscreen.appendChild(exportElement);
        document.body.appendChild(offscreen);

        try {
            applyComputedTextStyles(exportElement);
            materializeInlineLeftSpacing(exportElement);
        } finally {
            document.body.removeChild(offscreen);
        }

        applyWordExportUtilityStyles(exportElement);
        applyTableBorderStyles(exportElement);
        convertTableHeadersToBodyRows(exportElement);
        convertListsToPlainBlocks(exportElement);
        convertNeutralBoldTags(exportElement);
        [exportElement, ...exportElement.querySelectorAll("*")].forEach(appendWordExportFontStyle);
        wrapTextNodesForWord(exportElement);
    }

    return normalizeForWord ? getWordExportBodyMarkup(exportElement) : exportElement.outerHTML;
}

export function generateHtmlString(element, options = {}) {
    const { title = "Bieu mau", lang = "vi", landscape = false, normalizeForWord = false } = options;
    const pageMarginCss = getPageMarginCss(landscape);
    const landscapePageMarginCss = getPageMarginCss(true);
    const bodyHtml = normalizeExportMarkup(element, { normalizeForWord });
    const exportDocumentFontSize = normalizeForWord ? WORD_DOCUMENT_FONT_SIZE : DOCUMENT_FONT_SIZE;
    const exportTableFontSize = normalizeForWord ? WORD_TABLE_FONT_SIZE : TABLE_FONT_SIZE;

    let cssText = "";
    if (!normalizeForWord) {
        try {
            for (const sheet of document.styleSheets) {
                try {
                    const rules = sheet.cssRules || sheet.rules;
                    if (!rules) continue;
                    for (const rule of rules) {
                        let ruleText = rule.cssText;
                        if (ruleText.includes("font-family") && !ruleText.includes("Times New Roman")) {
                            // Normal PDF export: just strip non-Times New Roman fonts.
                            ruleText = ruleText.replace(/font-family\s*:[^;]+;?/gi, "");
                        }
                        cssText += ruleText + "\n";
                    }
                } catch {
                    // Ignore cross-origin stylesheets.
                }
            }
        } catch (err) {
            console.warn("[generateHtmlFile] Unable to read stylesheets:", err);
        }
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
      --procedure-confirmation-font-size: ${exportDocumentFontSize};
      --procedure-confirmation-checkbox-font-size: ${WORD_CHECKBOX_FONT_SIZE};
    }

    ${normalizeForWord
            ? ""
            : `
    @page {
      size: A4 ${landscape ? "landscape" : "portrait"};
      margin: ${pageMarginCss};
    }

    @page landscape {
      size: A4 landscape;
      margin: ${landscapePageMarginCss};
    }
    `
        }

    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      background: #fff;
      color: #000;
      font-family: ${WORD_EXPORT_FONT_FAMILY};
      mso-ascii-font-family: 'Times New Roman';
      mso-hansi-font-family: 'Times New Roman';
      mso-bidi-font-family: 'Times New Roman';
      mso-fareast-font-family: 'Times New Roman';
      font-size: ${exportDocumentFontSize} !important;
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
      font-family: ${WORD_EXPORT_FONT_FAMILY};
      mso-ascii-font-family: 'Times New Roman';
      mso-hansi-font-family: 'Times New Roman';
      mso-bidi-font-family: 'Times New Roman';
      mso-fareast-font-family: 'Times New Roman';
      font-size: ${exportDocumentFontSize};
      line-height: ${DOCUMENT_LINE_HEIGHT};
    }

    .text-center {
      text-align: center !important;
    }

    .text-right {
      text-align: right !important;
    }

    .title-recipient {
      line-height: 1.5 !important;
    }

    .title-recipient-spacer {
      margin: 0 !important;
      font-size: 6.5pt !important;
      line-height: 6.5pt !important;
    }

    .bordered-table,
    .list-table {
      width: 100% !important;
      border-collapse: collapse !important;
      margin: 6pt 0 !important;
    }

    .bordered-table th,
    .bordered-table td,
    .list-table th,
    .list-table td {
      border: 1px solid #000 !important;
      padding: 4pt 5pt !important;
    }

    .single-border-table {
      width: 100% !important;
      border-collapse: collapse !important;
      margin: 6pt 0 !important;
    }

    .single-border-table td,
    .single-border-cell {
      border: 1px solid #000 !important;
      padding: 8pt 10pt !important;
      vertical-align: top !important;
    }

    .indent-line {
      margin-left: 28pt !important;
    }

    .checkbox-symbol {
      font-family: ${WORD_EXPORT_FONT_FAMILY};
      font-size: var(--procedure-confirmation-checkbox-font-size, ${WORD_CHECKBOX_FONT_SIZE});
      vertical-align: middle;
    }

    .checkbox {
      font-size: var(--procedure-confirmation-checkbox-font-size, ${WORD_CHECKBOX_FONT_SIZE}) !important;
      line-height: 1 !important;
      vertical-align: middle !important;
      margin: 0 3pt !important;
      font-style: normal !important;
      font-weight: normal !important;
    }

    .no-border,
    .no-border td,
    .no-border th {
      border: none !important;
    }

    .signature-table,
    .signature-table td,
    .signature-table th {
      border: none !important;
    }

    .signature-table {
      width: 100% !important;
      border-collapse: collapse !important;
      margin-top: 24pt !important;
    }

    .signature-spacer {
      width: auto !important;
      border: none !important;
      text-align: left !important;
      vertical-align: top !important;
    }

    .signature-cell {
      width: 105mm !important;
      border: none !important;
      text-align: center !important;
      vertical-align: top !important;
    }

    .signature-single-table {
      width: 105mm !important;
      margin-left: auto !important;
      margin-right: 0 !important;
      table-layout: auto !important;
    }

    .signature-single-table .signature-cell {
      width: auto !important;
      max-width: none !important;
      text-align: center !important;
    }

    .signature-even-table,
    .signature-even-table td,
    .signature-even-table th {
      border: none !important;
    }

    .signature-even-table {
      width: 100% !important;
      border-collapse: collapse !important;
      table-layout: fixed !important;
    }

    .signature-even-table td,
    .signature-even-table th {
      text-align: center !important;
      vertical-align: top !important;
    }

    .document-export-root [class*="tableContainer"],
    .document-export-root [class*="tableScrollWrapper"] {
      border: none !important;
      border-radius: 0 !important;
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
      font-family: ${WORD_EXPORT_FONT_FAMILY};
      mso-ascii-font-family: 'Times New Roman';
      mso-hansi-font-family: 'Times New Roman';
      mso-bidi-font-family: 'Times New Roman';
      mso-fareast-font-family: 'Times New Roman';
      font-size: ${exportTableFontSize};
      line-height: ${TABLE_LINE_HEIGHT};
    }

    table p, table span, table div, table strong, table em, table b, table i, table li {
      font-size: ${exportTableFontSize};
      line-height: ${TABLE_LINE_HEIGHT};
    }

    .document-export-root table thead,
    .document-export-root table tfoot {
      display: table-row-group !important;
    }

    .export-table-font-10,
    .export-table-font-10 td,
    .export-table-font-10 th,
    .export-table-font-10 p,
    .export-table-font-10 span,
    .export-table-font-10 div,
    .export-table-font-10 strong,
    .export-table-font-10 em,
    .export-table-font-10 b,
    .export-table-font-10 i,
    .export-table-font-10 li {
      font-size: ${EXPORT_TABLE_FONT_10_SIZE} !important;
      line-height: ${EXPORT_TABLE_FONT_10_LINE_HEIGHT} !important;
    }

    .signature-table p,
    .signature-table span,
    .signature-table strong,
    .signature-table em,
    .signature-table b,
    .signature-table i {
      font-size: ${exportDocumentFontSize} !important;
      line-height: ${DOCUMENT_LINE_HEIGHT} !important;
    }

    [data-export-signature-row] {
      display: block !important;
      text-align: right !important;
      width: 100% !important;
    }

    [data-export-signature-block] {
      display: inline-block !important;
      width: 105mm !important;
      min-width: 70mm !important;
      max-width: 105mm !important;
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
      width: 105mm !important;
      max-width: 105mm !important;
      text-align: center !important;
      padding-right: 0 !important;
      white-space: normal !important;
    }

    [data-export-signature-table].signature-table td:first-child {
      width: auto !important;
    }

    [data-export-signature-table].signature-table [data-export-signature-cell],
    [data-export-signature-table].signature-table .signature-cell {
      width: 105mm !important;
      max-width: 105mm !important;
      text-align: center !important;
    }

    [data-export-signature-table].signature-single-table {
      width: 105mm !important;
      margin-left: auto !important;
      margin-right: 0 !important;
      table-layout: auto !important;
    }

    [data-export-signature-table].signature-single-table [data-export-signature-cell],
    [data-export-signature-table].signature-single-table .signature-cell {
      width: auto !important;
      max-width: none !important;
      text-align: center !important;
    }

    [data-export-signature-table].signature-even-table,
    [data-export-signature-table].signature-even-table td,
    [data-export-signature-table].signature-even-table th {
      border: none !important;
      text-align: center !important;
      vertical-align: top !important;
    }

    [data-export-signature-table] td,
    [data-export-signature-table] th,
    [data-export-signature-table] p,
    [data-export-signature-table] span,
    [data-export-signature-table] strong,
    [data-export-signature-table] em,
    [data-export-signature-table] b,
    [data-export-signature-table] i {
      font-size: ${exportDocumentFontSize};
      line-height: ${DOCUMENT_LINE_HEIGHT};
    }

  </style>
</head>
<body>${bodyHtml}</body>
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
