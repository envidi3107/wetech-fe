const DEFAULT_ETHNICITY = "Kinh";
const DEFAULT_NATIONALITY = "Việt Nam";

export const normalizeAddressPart = (value) =>
    String(value || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/^(tinh|thanh pho|tp\.?|xa|phuong|thi tran)\s+/i, "")
        .trim();

const normalizeText = (value) =>
    String(value || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d");

export const splitCCCDAddress = (address, provinces = []) => {
    const parts = String(address || "")
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);

    if (parts.length === 0) {
        return { province: "", ward: "", street: "" };
    }

    const provincePart =
        parts.find((part) =>
            provinces.some((province) => normalizeAddressPart(province.name) === normalizeAddressPart(part)),
        ) || parts[parts.length - 1];

    const provinceIndex = parts.indexOf(provincePart);
    const wardPart =
        parts.find((part, index) => {
            if (index === provinceIndex) return false;
            return /^(xa|phuong|thi tran)\s+/i.test(normalizeText(part));
        }) || "";

    const wardIndex = wardPart ? parts.indexOf(wardPart) : -1;
    const street = parts
        .filter((_, index) => index !== provinceIndex && index !== wardIndex)
        .join(", ");

    return {
        province: provincePart || "",
        ward: wardPart || "",
        street,
    };
};

const buildAddressFields = (prefix, address) => {
    if (!prefix) return {};
    return {
        [`${prefix}_tinh`]: address.province,
        [`${prefix}_xa`]: address.ward,
        [`${prefix}_soNha`]: address.street,
    };
};

export const buildCCCDFormData = (
    customer,
    { personPrefix, contactPrefix, permanentPrefix, provinces = [], uppercaseName = true } = {},
) => {
    const address = splitCCCDAddress(customer?.address, provinces);
    const fullName = String(customer?.fullName || "").trim();
    const formData = {};

    if (personPrefix) {
        formData[`${personPrefix}_hoTen`] = uppercaseName ? fullName.toUpperCase() : fullName;
        formData[`${personPrefix}_gioiTinh`] = customer?.gender || "";
        formData[`${personPrefix}_ngaySinh`] = customer?.dob || "";
        formData[`${personPrefix}_cccd`] = customer?.cccd || "";
        formData[`${personPrefix}_danToc`] = customer?.ethnicity || DEFAULT_ETHNICITY;
        formData[`${personPrefix}_quocTich`] = customer?.nationality || DEFAULT_NATIONALITY;
    }

    return {
        ...formData,
        ...buildAddressFields(contactPrefix, address),
        ...buildAddressFields(permanentPrefix, address),
    };
};

export const buildUserCardFromCCCD = (customer, provinces = []) => {
    const address = splitCCCDAddress(customer?.address, provinces);
    return {
        fullName: customer?.fullName || "",
        gender: customer?.gender || "",
        dob: customer?.dob || "",
        cccd: customer?.cccd || "",
        ethnicity: customer?.ethnicity || DEFAULT_ETHNICITY,
        nationality: customer?.nationality || DEFAULT_NATIONALITY,
        permanentAddress: address,
        currentAddress: address,
    };
};
