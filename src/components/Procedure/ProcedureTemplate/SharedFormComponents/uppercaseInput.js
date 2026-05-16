export const toUppercaseValue = (value) => String(value || "").toLocaleUpperCase("vi-VN");

export const handleUppercaseInput = (event) => {
    const input = event.target;
    const nextValue = toUppercaseValue(input.value);

    if (input.value === nextValue) return;

    const selectionStart = input.selectionStart;
    const selectionEnd = input.selectionEnd;
    input.value = nextValue;

    if (selectionStart !== null && selectionEnd !== null) {
        input.setSelectionRange(selectionStart, selectionEnd);
    }
};
