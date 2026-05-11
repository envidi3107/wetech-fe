import React from 'react';

import { useGetFormDataJsonFromName } from '@/pages/User/ProcessProcedure/ProcessProcedure';

const processProvince = (province) => {
    if (!province || typeof province !== "string") return "";
    let p = province.trim();
    if (p.toLowerCase().startsWith("tỉnh ")) {
        return p.substring(5).trim();
    }
    if (p.toLowerCase().startsWith("thành phố ")) {
        return p.substring(10).trim();
    }
    return p;
};

export default function CurrentDate({ prefix, style, className }) {
    const giayDeNghiData = useGetFormDataJsonFromName("Giấy đề nghị đăng ký doanh nghiệp");
    const defaultProvince = giayDeNghiData?.truSo_tinh || "";

    const displayPrefix = prefix !== undefined ? processProvince(prefix) : (processProvince(defaultProvince) || "………");

    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    return (
        <span style={style} className={className}>
            {displayPrefix}{displayPrefix ? ", ngày " : "Ngày "}{day} tháng {month} năm {year}
        </span>
    );
}
