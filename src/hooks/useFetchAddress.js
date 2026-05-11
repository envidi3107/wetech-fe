import { useState, useEffect, useMemo } from "react";
import provincesData from "@/assets/provinces.json";
import communesData from "@/assets/communes.json";

export function useFetchAddress(provinceCode = "") {
    const provinces = useMemo(() => provincesData, []);

    const communes = useMemo(() => {
        if (!provinceCode) return [];
        return communesData[String(provinceCode).trim()] || [];
    }, [provinceCode]);

    return { provinces, communes, loadingProvinces: false, loadingCommunes: false };
}
