import { forwardRef, useImperativeHandle, useMemo } from "react";
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormDeclaration/SharedDeclaration.module.css";
import { useGetFormDataJsonFromName } from "@/pages/User/ProcessProcedure/ProcessProcedure";
import {
    A_CHANGE_OPTIONS,
    isTruthy,
    normalizeDataJson,
} from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/dangKyThayDoi.constants";
import { useAuth } from "@/context/AuthContext";
import { handleUppercaseInput, toUppercaseValue } from "../../../SharedFormComponents/uppercaseInput";

const DECISION_FORM_NAME = "Quyết định hội đồng thành viên";
const DEFAULT_VOTE_UNIT = "10.000";
const VOTE_FIELDS = [
    { name: "hopLe", label: "Tổng số phiếu biểu quyết hợp lệ", defaultType: "total" },
    { name: "khongHopLe", label: "Tổng số phiếu biểu quyết không hợp lệ", defaultType: "zero" },
    { name: "tanThanh", label: "Tổng số phiếu tán thành", defaultType: "total" },
    { name: "khongTanThanh", label: "Tổng số phiếu không tán thành", defaultType: "zero" },
    { name: "khongYKien", label: "Tổng số phiếu không có ý kiến", defaultType: "zero" },
];

function parseNumber(value) {
    if (value === null || value === undefined || value === "") return null;

    const normalized = String(value)
        .replace(/[^\d,.-]/g, "")
        .replace(/\./g, "")
        .replace(",", ".");
    const parsed = Number(normalized);
    return Number.isNaN(parsed) ? null : parsed;
}

function formatNumber(value) {
    if (value === null || value === undefined || value === "") return "";
    const parsed = typeof value === "number" ? value : parseNumber(value);
    return parsed === null ? String(value) : parsed.toLocaleString("vi-VN");
}

function getGenderTitle(value) {
    return (value || "").toLocaleLowerCase("vi-VN") === "nữ" ? "Bà" : "Ông";
}

function getVoteItems(data) {
    const items = [];
    if (isTruthy(data.a_doiVonDieuLe)) items.push({ key: "doiVonDieuLe", label: "thay đổi vốn điều lệ" });
    if (isTruthy(data.a_doiNganhNghe)) items.push({ key: "doiNganhNghe", label: "thay đổi ngành, nghề kinh doanh" });
    if (isTruthy(data.a_doiTen)) items.push({ key: "doiTen", label: "thay đổi tên doanh nghiệp" });
    if (isTruthy(data.a_doiDiaChi)) items.push({ key: "doiDiaChi", label: "thay đổi địa chỉ trụ sở chính" });
    if (isTruthy(data.qdDoiNguoiDaiDienPhapLuat)) {
        items.push({ key: "doiNguoiDaiDienPhapLuat", label: "thay đổi Người đại diện pháp luật" });
    }

    return items.length
        ? items
        : [{ key: "noiDungDangKyDoanhNghiep", label: "thay đổi nội dung đăng ký doanh nghiệp" }];
}

function getSelectedChangeOptions(data) {
    const selectedOptions = A_CHANGE_OPTIONS.filter((option) => isTruthy(data[option.name])).map((option) => ({
        key: option.name,
        label: option.label,
    }));

    if (isTruthy(data.qdDoiNguoiDaiDienPhapLuat)) {
        selectedOptions.push({
            key: "qdDoiNguoiDaiDienPhapLuat",
            label: "THAY ĐỔI NGƯỜI ĐẠI DIỆN THEO PHÁP LUẬT",
        });
    }

    return selectedOptions;
}

function getVoteFieldName(itemKey, fieldName) {
    return `bbBieuQuyet_${itemKey}_${fieldName}`;
}

function getDefaultVoteValue(totalVotes, defaultType) {
    return defaultType === "total" ? totalVotes || "" : "0";
}

function getVoteValue(data, itemKey, field, totalVotes) {
    return data[getVoteFieldName(itemKey, field.name)] || getDefaultVoteValue(totalVotes, field.defaultType);
}

function applyVoteDefaults(data) {
    const totalVotes = data.bbTongSoPhieuBieuQuyet || getDefaultVoteTotal(data, data.bbMenhGiaPhieuBieuQuyet);
    const nextData = { ...data };
    getVoteItems(nextData).forEach((item) => {
        VOTE_FIELDS.forEach((field) => {
            const fieldName = getVoteFieldName(item.key, field.name);
            if (nextData[fieldName] === undefined || nextData[fieldName] === null || nextData[fieldName] === "") {
                nextData[fieldName] = getDefaultVoteValue(totalVotes, field.defaultType);
            }
        });
    });
    return nextData;
}

function getDefaultVoteTotal(data, voteUnit = DEFAULT_VOTE_UNIT) {
    const savedValue = data.bbTongSoPhieuBieuQuyet;
    if (savedValue) return savedValue;

    const capital = parseNumber(data.vonDieuLeSauThayDoi || data.nguonVon_tongCong_soTien);
    const unit = parseNumber(voteUnit);
    if (!capital || !unit) return "";

    return formatNumber(Math.floor(capital / unit));
}

function buildMeetingData(data, formValues = {}, userFullName = "") {
    const voteUnit = formValues.bbMenhGiaPhieuBieuQuyet || data.bbMenhGiaPhieuBieuQuyet || DEFAULT_VOTE_UNIT;
    const nextData = {
        ...data,
        ...formValues,
    };

    if (!nextData.bbGioBatDau) nextData.bbGioBatDau = "07:30";
    if (!nextData.bbGioKetThuc) nextData.bbGioKetThuc = "09:30";
    if (!nextData.bbDiaDiemHop) nextData.bbDiaDiemHop = "Tại địa chỉ trụ sở chính";
    if (!nextData.bbChuToa_danhXung) {
        nextData.bbChuToa_danhXung = getGenderTitle(nextData.qdNguoiDaiDien_gioiTinh || nextData.nguoiDaiDien_gioiTinh);
    }
    if (!nextData.bbChuToa) {
        nextData.bbChuToa = nextData.qdNguoiDaiDien_hoTen || nextData.nguoiDaiDien_hoTen || "";
    }
    if (!nextData.bbThuKy_danhXung) nextData.bbThuKy_danhXung = "Ông";
    if (!nextData.bbThuKy) nextData.bbThuKy = userFullName || nextData.qdNguoiThucHienThuTuc || "";
    if (!nextData.bbPhuongThucBieuQuyet) nextData.bbPhuongThucBieuQuyet = "Bỏ phiếu kín";
    if (!nextData.bbMenhGiaPhieuBieuQuyet) nextData.bbMenhGiaPhieuBieuQuyet = voteUnit;
    if (!nextData.bbTongSoPhieuBieuQuyet) nextData.bbTongSoPhieuBieuQuyet = getDefaultVoteTotal(nextData, voteUnit);
    if (!nextData.bbYKienThanhVien) {
        nextData.bbYKienThanhVien =
            "Hoàn toàn đồng ý với việc thay đổi nội dung đăng ký doanh nghiệp tại mục A nêu trên.";
    }

    return applyVoteDefaults(nextData);
}

function Field({ label, name, data, required = false, children }) {
    return (
        <div className={styles.formGroup}>
            <label className={styles.label}>
                {label} {required && <span className={styles.required}>*</span>}
            </label>
            {children || (
                <input className={styles.input} name={name} defaultValue={data?.[name] || ""} required={required} />
            )}
        </div>
    );
}

function SelectedChangeOptions({ data }) {
    const selectedOptions = getSelectedChangeOptions(data);

    return (
        <div className={styles.formGroup}>
            <label className={styles.label}>Hội đồng thành viên lấy ý kiến của các thành viên dự họp về việc:</label>
            <div className={styles.radioGroup} style={{ alignItems: "flex-start", flexDirection: "column", gap: 4 }}>
                {selectedOptions.length ? (
                    selectedOptions.map((option) => (
                        <label key={option.key} className={styles.radioLabel}>
                            <input type="checkbox" checked readOnly className={styles.radioInput} />
                            {option.label}
                        </label>
                    ))
                ) : (
                    <span className={styles.note}>Chưa có nội dung thay đổi tại Mục A.</span>
                )}
            </div>
        </div>
    );
}

function VoteInputTable({ data }) {
    const totalVotes = data.bbTongSoPhieuBieuQuyet || getDefaultVoteTotal(data, data.bbMenhGiaPhieuBieuQuyet);
    const voteItems = getVoteItems(data);

    return (
        <div className={styles.sectionGroup}>
            <h3 className={styles.sectionTitle}>C. Biểu quyết</h3>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Nội dung biểu quyết</th>
                        {VOTE_FIELDS.map((field) => (
                            <th key={field.name}>{field.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {voteItems.map((item, idx) => (
                        <tr key={item.key}>
                            <td>
                                {idx + 1}. Bỏ phiếu thông qua việc {item.label}
                            </td>
                            {VOTE_FIELDS.map((field) => (
                                <td key={field.name}>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        name={getVoteFieldName(item.key, field.name)}
                                        defaultValue={getVoteValue(data, item.key, field, totalVotes)}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const BienBanHopHoiDongThanhVienDeclaration = forwardRef(function BienBanHopHoiDongThanhVienDeclaration(
    { dataJson, onSubmit, formRef },
    componentRef,
) {
    const { user } = useAuth();
    const decisionFormData = useGetFormDataJsonFromName(DECISION_FORM_NAME);
    const currentData = useMemo(() => normalizeDataJson(dataJson), [dataJson]);
    const decisionSourceData = useMemo(() => normalizeDataJson(decisionFormData), [decisionFormData]);
    const meetingData = useMemo(
        () => buildMeetingData({ ...currentData, ...decisionSourceData }, {}, user?.fullname || ""),
        [currentData, decisionSourceData, user?.fullname],
    );
    const hasDecisionData = Object.keys(decisionSourceData).length > 0;
    const formKey = `${hasDecisionData ? "decision" : "no-decision"}-${dataJson ? "saved" : "new"}`;

    const collectData = () => {
        if (!formRef?.current) return null;
        if (!formRef.current.checkValidity()) {
            formRef.current.reportValidity();
            return null;
        }

        const formData = new FormData(formRef.current);
        const formValues = Object.fromEntries(formData.entries());
        return buildMeetingData({ ...meetingData, ...formValues }, formValues, user?.fullname || "");
    };

    useImperativeHandle(componentRef, () => ({
        getDraftData: collectData,
        getExportData: collectData,
        importData: () => {},
    }));

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = collectData();
        if (data && onSubmit) onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} ref={formRef} key={formKey}>
            {!hasDecisionData && (
                <p className={styles.note}>
                    Chưa tìm thấy dữ liệu từ form Quyết định hội đồng thành viên. Bạn có thể quay lại lưu form đó trước,
                    hoặc nhập các trường riêng của biên bản tại đây.
                </p>
            )}

            <div className={styles.sectionGroup}>
                <h3 className={styles.sectionTitle}>A. Thông tin biên bản họp</h3>
                <div className={styles.grid2}>
                    <Field label="Giờ bắt đầu họp" name="bbGioBatDau" data={meetingData} required>
                        <input
                            type="time"
                            className={styles.input}
                            name="bbGioBatDau"
                            defaultValue={meetingData.bbGioBatDau || "07:30"}
                            required
                        />
                    </Field>
                    <Field label="Giờ kết thúc họp" name="bbGioKetThuc" data={meetingData} required>
                        <input
                            type="time"
                            className={styles.input}
                            name="bbGioKetThuc"
                            defaultValue={meetingData.bbGioKetThuc || "09:30"}
                            required
                        />
                    </Field>
                    <Field label="Địa điểm họp" name="bbDiaDiemHop" data={meetingData} required />
                    <Field label="Chủ tọa cuộc họp" required>
                        <div className={styles.inputPrefixWrapper}>
                            <select
                                name="bbChuToa_danhXung"
                                className={styles.prefixSelect}
                                defaultValue={meetingData.bbChuToa_danhXung || "Ông"}
                            >
                                <option value="Ông">Ông</option>
                                <option value="Bà">Bà</option>
                            </select>
                            <input
                                className={styles.inputNoBorder}
                                name="bbChuToa"
                                defaultValue={toUppercaseValue(meetingData.bbChuToa || "")}
                                onChange={handleUppercaseInput}
                                required
                            />
                        </div>
                    </Field>
                    <Field label="Thư ký cuộc họp" required>
                        <div className={styles.inputPrefixWrapper}>
                            <select
                                name="bbThuKy_danhXung"
                                className={styles.prefixSelect}
                                defaultValue={meetingData.bbThuKy_danhXung || "Ông"}
                            >
                                <option value="Ông">Ông</option>
                                <option value="Bà">Bà</option>
                            </select>
                            <input
                                className={styles.inputNoBorder}
                                name="bbThuKy"
                                defaultValue={toUppercaseValue(meetingData.bbThuKy || "")}
                                onChange={handleUppercaseInput}
                                required
                            />
                        </div>
                    </Field>
                    <Field label="Phương thức biểu quyết" name="bbPhuongThucBieuQuyet" data={meetingData} required />
                    <Field
                        label="Số đồng góp vốn tương ứng với 1 phiếu biểu quyết"
                        name="bbMenhGiaPhieuBieuQuyet"
                        data={meetingData}
                        required
                    />
                    <Field
                        label="Tổng số phiếu biểu quyết"
                        name="bbTongSoPhieuBieuQuyet"
                        data={{
                            bbTongSoPhieuBieuQuyet:
                                meetingData.bbTongSoPhieuBieuQuyet ||
                                getDefaultVoteTotal(meetingData, meetingData.bbMenhGiaPhieuBieuQuyet),
                        }}
                        required
                    />
                </div>
                {/* nội dung đã chọn */}
                <SelectedChangeOptions data={meetingData} />
                <div>
                    <h3 className={styles.sectionTitle}>B. Ý kiến phát biểu của các thành viên dự họp</h3>
                    <textarea
                        className={styles.input}
                        name="bbYKienThanhVien"
                        defaultValue={meetingData.bbYKienThanhVien || ""}
                        rows={3}
                        style={{ minHeight: 84, resize: "vertical", fontFamily: "inherit" }}
                    />
                </div>
            </div>
            <VoteInputTable data={meetingData} />
        </form>
    );
});

export default BienBanHopHoiDongThanhVienDeclaration;
