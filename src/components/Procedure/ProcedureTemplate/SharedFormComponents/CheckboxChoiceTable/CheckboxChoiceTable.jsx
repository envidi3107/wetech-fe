import React from "react";

export default function CheckboxChoiceTable({
    options = [],
    CheckboxComponent,
    checkboxFirst = false,
    className = "",
    style,
}) {
    if (!CheckboxComponent || options.length === 0) return null;

    const renderChoice = ({ label, checked }) => (
        <p
            style={{
                margin: 0,
                font: "inherit",
                lineHeight: "inherit",
                textAlign: "left",
            }}
        >
            {checkboxFirst ? (
                <>
                    <CheckboxComponent checked={checked} />
                    <span>{label}</span>
                </>
            ) : (
                <>
                    <span>{label}</span>
                    <CheckboxComponent checked={checked} />
                </>
            )}
        </p>
    );

    const cellStyle = {
        border: "none",
        padding: "2px 12px 2px 0",
        textAlign: "left",
        verticalAlign: "top",
    };

    return (
        <table
            className={`no-border docx-contained-table docx-choice-table checkbox-choice-table ${className}`.trim()}
            style={{
                width: "100%",
                border: "none",
                borderCollapse: "collapse",
                tableLayout: "fixed",
                margin: "4px 0",
                ...style,
            }}
        >
            <tbody>
                {options.length === 2 ? (
                    <tr>
                        {options.map((option) => (
                            <td key={option.label} style={{ ...cellStyle, width: "50%" }}>
                                {renderChoice(option)}
                            </td>
                        ))}
                    </tr>
                ) : (
                    options.map((option) => (
                        <tr key={option.label}>
                            <td style={cellStyle}>{renderChoice(option)}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
}
