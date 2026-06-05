export const DEFAULT_TNHH_COMPANY_NAME_PREFIX = "CÔNG TY TNHH";
export const TNHH_COMPANY_NAME_PREFIX_OPTIONS = [
    DEFAULT_TNHH_COMPANY_NAME_PREFIX,
    "CÔNG TY TRÁCH NHIỆM HỮU HẠN",
];

export const DEFAULT_CO_PHAN_COMPANY_NAME_PREFIX = "CÔNG TY CP";
export const CO_PHAN_COMPANY_NAME_PREFIX_OPTIONS = [
    DEFAULT_CO_PHAN_COMPANY_NAME_PREFIX,
    "CÔNG TY CỔ PHẦN",
];

export function getCompanyNamePrefix(dataJson, defaultPrefix, allowedPrefixes) {
    const prefix = dataJson?.tenCongTyPrefix || defaultPrefix;

    if (Array.isArray(allowedPrefixes) && allowedPrefixes.length > 0 && !allowedPrefixes.includes(prefix)) {
        return defaultPrefix;
    }

    return prefix;
}
