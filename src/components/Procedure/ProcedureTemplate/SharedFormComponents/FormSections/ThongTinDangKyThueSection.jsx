import { useState, useEffect, useRef } from "react";
import AddressSelect from "@/components/AddressSelect/AddressSelect";
import { useFetchAddress } from "@/hooks/useFetchAddress";
import { GioiTinhSelect } from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/PersonalSelects/PersonalSelects";
import DateInput from "@/components/DateInput/DateInput";
import InfoTooltip from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/InfoTooltip/InfoTooltip";
import CopyAddressCheckbox from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/CopyAddressCheckbox/CopyAddressCheckbox";
import {
    handleUppercaseInput,
    toUppercaseValue,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/uppercaseInput";

export default function ThongTinDangKyThueSection({
    dataJson,
    styles,
    isNote = false,
    hideKeToanCopyCheckbox = false,
}) {
    const [provCode_thongBaoThue, setProvCode_thongBaoThue] = useState("");
    const {
        provinces,
        communes: communes_thongBaoThue,
        loadingCommunes: loadingCommunes_thongBaoThue,
    } = useFetchAddress(provCode_thongBaoThue);
    const sectionRef = useRef(null);
    const [giamDocNgaySinh, setGiamDocNgaySinh] = useState(
        dataJson?.giamDoc_ngaySinh || dataJson?.nguoiDaiDien_ngaySinh || "",
    );

    // --- Cập nhật real-time: khi người dùng nhập liệu vào người đại diện, tự động điền vào giám đốc ---
    useEffect(() => {
        const form = sectionRef.current?.closest("form");
        if (!form) return;

        const MIRROR_MAP = {
            nguoiDaiDien_hoTen: "giamDoc_hoTen",
            nguoiDaiDien_gioiTinh: "giamDoc_gioiTinh",
            nguoiDaiDien_cccd: "giamDoc_cccd",
            nguoiDaiDien_phone: "giamDoc_phone",
        };

        // Sync các field thông thường (text, select, tel)
        const syncToGiamDoc = (e) => {
            if (!e.target?.name) return;
            const dstName = MIRROR_MAP[e.target.name];
            if (!dstName) return;
            const dst = form.querySelector(`[name="${dstName}"]`);
            if (dst) dst.value = e.target.value;
        };

        form.addEventListener("input", syncToGiamDoc);
        form.addEventListener("change", syncToGiamDoc);

        // --- Xử lý riêng cho DateInput (ngaySinh) ---
        // DateInput render: <input type="hidden" name="nguoiDaiDien_ngaySinh"> + <input type="text"> (display)
        // Hidden input không fire event, nên cần theo dõi text input gần nó
        const toDisplay = (iso) => {
            if (!iso) return "";
            const [y, m, d] = iso.split("-");
            return y && m && d ? `${d}/${m}/${y}` : "";
        };

        const syncDate = () => {
            const srcHidden = form.querySelector(`input[type="hidden"][name="nguoiDaiDien_ngaySinh"]`);
            if (!srcHidden) return;
            const isoVal = srcHidden.value;
            const dstHidden = form.querySelector(`input[type="hidden"][name="giamDoc_ngaySinh"]`);
            if (!dstHidden) return;
            dstHidden.value = isoVal;
            const dstTextInput = dstHidden.closest("div")?.querySelector('input[type="text"]');
            if (dstTextInput) dstTextInput.value = toDisplay(isoVal);
        };

        const onDateInputDelegation = (e) => {
            const srcHidden = form.querySelector(`input[type="hidden"][name="nguoiDaiDien_ngaySinh"]`);
            if (srcHidden && srcHidden.parentElement && srcHidden.parentElement.contains(e.target)) {
                setTimeout(() => {
                    syncDate();
                    setGiamDocNgaySinh(srcHidden.value);
                }, 10);
            }
        };

        form.addEventListener("input", onDateInputDelegation);
        form.addEventListener("change", onDateInputDelegation);

        return () => {
            form.removeEventListener("input", syncToGiamDoc);
            form.removeEventListener("change", syncToGiamDoc);
            form.removeEventListener("input", onDateInputDelegation);
            form.removeEventListener("change", onDateInputDelegation);
        };
    }, []);

    const [thueAddressState, setThueAddressState] = useState({
        tinh: dataJson?.thongBaoThue_tinh || "",
        xa: dataJson?.thongBaoThue_xa || "",
        soNha: dataJson?.thongBaoThue_soNha || "",
        phone: dataJson?.thongBaoThue_phone || "",
        fax: dataJson?.thongBaoThue_fax || "",
        email: dataJson?.thongBaoThue_email || "",
    });
    const [thueKey, setThueKey] = useState(0);

    const [keToanState, setKeToanState] = useState({
        hoTen: dataJson?.keToan_hoTen || "",
        ngaySinh: dataJson?.keToan_ngaySinh || "",
        gioiTinh: dataJson?.keToan_gioiTinh || "",
        cccd: dataJson?.keToan_cccd || "",
        phone: dataJson?.keToan_phone || "",
    });
    const [keToanKey, setKeToanKey] = useState(0);

    const handleCopyNguoiNopToKeToan = (isChecked, e) => {
        if (isChecked) {
            const form = e.target.closest("form");
            if (form) {
                const fd = new FormData(form);
                setKeToanState({
                    hoTen: fd.get("nguoiNop_hoTen") || "",
                    ngaySinh: fd.get("nguoiNop_ngaySinh") || "",
                    gioiTinh: fd.get("nguoiNop_gioiTinh") || "",
                    cccd: fd.get("nguoiNop_cccd") || "",
                    phone: fd.get("nguoiNop_phone") || "",
                });
                setKeToanKey((prev) => prev + 1);
            }
        } else {
            setKeToanState({
                hoTen: dataJson?.keToan_hoTen || "",
                ngaySinh: dataJson?.keToan_ngaySinh || "",
                gioiTinh: dataJson?.keToan_gioiTinh || "",
                cccd: dataJson?.keToan_cccd || "",
                phone: dataJson?.keToan_phone || "",
            });
            setKeToanKey((prev) => prev + 1);
        }
    };

    useEffect(() => {
        if (dataJson) {
            setThueAddressState({
                tinh: dataJson.thongBaoThue_tinh || "",
                xa: dataJson.thongBaoThue_xa || "",
                soNha: dataJson.thongBaoThue_soNha || "",
                phone: dataJson.thongBaoThue_phone || "",
                fax: dataJson.thongBaoThue_fax || "",
                email: dataJson.thongBaoThue_email || "",
            });
            setThueKey((prev) => prev + 1);
            setKeToanState({
                hoTen: dataJson.keToan_hoTen || "",
                ngaySinh: dataJson.keToan_ngaySinh || "",
                gioiTinh: dataJson.keToan_gioiTinh || "",
                cccd: dataJson.keToan_cccd || "",
                phone: dataJson.keToan_phone || "",
            });
            setKeToanKey((prev) => prev + 1);
            setGiamDocNgaySinh(dataJson.giamDoc_ngaySinh || dataJson.nguoiDaiDien_ngaySinh || "");
        } else {
            setThueAddressState({
                tinh: "",
                xa: "",
                soNha: "",
                phone: "",
                fax: "",
                email: "",
            });
            setThueKey((prev) => prev + 1);
            setKeToanState({
                hoTen: "",
                ngaySinh: "",
                gioiTinh: "",
                cccd: "",
                phone: "",
            });
            setKeToanKey((prev) => prev + 1);
            setGiamDocNgaySinh("");
        }
    }, [dataJson]);

    const tooltipNgayBatDau =
        "Trường hợp doanh nghiệp được cấp Giấy chứng nhận đăng ký doanh nghiệp sau ngày bắt đầu hoạt động đã kê khai thì ngày bắt đầu hoạt động là ngày doanh nghiệp được cấp Giấy chứng nhận đăng ký doanh nghiệp.";
    const tooltipNamTaiChinh =
        "- Trường hợp niên độ kế toán theo năm dương lịch thì ghi từ ngày 01/01 đến ngày 31/12.\n- Trường hợp niên độ kế toán theo năm tài chính khác năm dương lịch thì ghi ngày, tháng bắt đầu niên độ kế toán là ngày đầu tiên của quý; ngày, tháng kết thúc niên độ kế toán là ngày cuối cùng của quý.";
    const tooltipTongSoLaoDong =
        "Không kê khai trong trường hợp thành lập doanh nghiệp trên cơ sở chuyển đổi loại hình doanh nghiệp.";
    const tooltipPPThue =
        "Chỉ kê khai trong trường hợp thành lập mới. Doanh nghiệp căn cứ vào quy định của pháp luật về thuế giá trị gia tăng và dự kiến hoạt động kinh doanh của doanh nghiệp để xác định 01 trong 04 phương pháp tính thuế giá trị gia tăng tại chỉ tiêu này, trừ trường hợp doanh nghiệp mua bán, chế tác vàng, bạc, đá quý có thể chọn thêm phương pháp trực tiếp trên GTGT ngoài các phương pháp khác (nếu có).";

    return (
        <div ref={sectionRef} className={styles.sectionGroup}>
            <h3 className={styles.sectionTitle}>Thông tin đăng ký thuế:</h3>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th style={{ width: "40px" }}>STT</th>
                        <th>Các chỉ tiêu thông tin đăng ký thuế</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ textAlign: "center" }}>10.1</td>
                        <td>
                            <p className={styles.sectionTitle}>Thông tin về Giám đốc/Tổng giám đốc (nếu có):</p>
                            <div className={styles.grid2}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        Họ, chữ đệm và tên Giám đốc/Tổng giám đốc:{" "}
                                        <span className={styles.required}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        name="giamDoc_hoTen"
                                        defaultValue={toUppercaseValue(
                                            dataJson?.giamDoc_hoTen || dataJson?.nguoiDaiDien_hoTen,
                                        )}
                                        style={{ textTransform: "uppercase" }}
                                        onInput={handleUppercaseInput}
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        Ngày, tháng, năm sinh: <span className={styles.required}>*</span>
                                    </label>
                                    <DateInput
                                        className={styles.input}
                                        name="giamDoc_ngaySinh"
                                        defaultValue={giamDocNgaySinh}
                                        required
                                    />
                                </div>
                                <GioiTinhSelect
                                    name="giamDoc_gioiTinh"
                                    defaultValue={dataJson?.giamDoc_gioiTinh || dataJson?.nguoiDaiDien_gioiTinh}
                                    required
                                />
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        Số định danh cá nhân: <span className={styles.required}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        name="giamDoc_cccd"
                                        defaultValue={dataJson?.giamDoc_cccd || dataJson?.nguoiDaiDien_cccd || ""}
                                        pattern="[0-9]{9,12}"
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        Điện thoại: <span className={styles.required}>*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        className={styles.input}
                                        name="giamDoc_phone"
                                        defaultValue={dataJson?.giamDoc_phone || dataJson?.nguoiDaiDien_phone || ""}
                                        pattern="(0|\+84)[0-9]{9,10}"
                                        required
                                    />
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ textAlign: "center" }}>10.2</td>
                        <td>
                            <p className={styles.sectionTitle}>
                                Thông tin về Kế toán trưởng/Phụ trách kế toán{" "}
                                <span className={styles.note}>
                                    (Trường hợp doanh nghiệp kê khai hình thức hạch toán là Hạch toán độc lập tại chỉ
                                    tiêu 5 thì bắt buộc kê khai thông tin về Kế toán trưởng/phụ trách kế toán.):
                                </span>
                            </p>
                            {!hideKeToanCopyCheckbox && (
                                <CopyAddressCheckbox
                                    label="Tích chọn nếu Kế toán trưởng/Phụ trách kế toán đồng thời là người soạn hồ sơ"
                                    onChange={handleCopyNguoiNopToKeToan}
                                />
                            )}
                            <div key={`ketoan-group-${keToanKey}`}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>
                                        Họ, chữ đệm và tên Kế toán trưởng/Phụ trách kế toán:
                                    </label>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        name="keToan_hoTen"
                                        defaultValue={toUppercaseValue(keToanState.hoTen)}
                                        style={{ textTransform: "uppercase" }}
                                        onInput={handleUppercaseInput}
                                    />
                                </div>
                                <div className={styles.grid2}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Ngày, tháng, năm sinh:</label>
                                        <DateInput
                                            className={styles.input}
                                            name="keToan_ngaySinh"
                                            defaultValue={keToanState.ngaySinh}
                                        />
                                    </div>
                                    <GioiTinhSelect
                                        name="keToan_gioiTinh"
                                        defaultValue={keToanState.gioiTinh}
                                        required={false}
                                    />
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Số định danh cá nhân:</label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            name="keToan_cccd"
                                            defaultValue={keToanState.cccd}
                                            pattern="[0-9]{9,12}"
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Điện thoại:</label>
                                        <input
                                            type="tel"
                                            className={styles.input}
                                            name="keToan_phone"
                                            defaultValue={keToanState.phone}
                                            pattern="(0|\+84)[0-9]{9,10}"
                                        />
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ textAlign: "center" }}>10.3</td>
                        <td>
                            <p className={styles.sectionTitle}>
                                Địa chỉ nhận thông báo thuế (chỉ kê khai nếu địa chỉ nhận thông báo thuế khác địa chỉ
                                trụ sở chính):
                            </p>

                            <div key={`thue-group-${thueKey}`}>
                                <AddressSelect
                                    isRequired={false}
                                    provinces={provinces}
                                    communes={communes_thongBaoThue}
                                    onProvinceChange={setProvCode_thongBaoThue}
                                    provinceName="thongBaoThue_tinh"
                                    wardName="thongBaoThue_xa"
                                    houseNumberName="thongBaoThue_soNha"
                                    provinceDefault={thueAddressState.tinh}
                                    wardDefault={thueAddressState.xa}
                                    houseNumberDefault={thueAddressState.soNha}
                                    isLoadingCommunes={loadingCommunes_thongBaoThue}
                                />
                                <div className={styles.grid2} style={{ marginTop: "16px" }}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Điện thoại (nếu có):</label>
                                        <input
                                            type="tel"
                                            className={styles.input}
                                            name="thongBaoThue_phone"
                                            defaultValue={thueAddressState.phone}
                                            pattern="(0|\+84)[0-9]{9,10}"
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Số fax (nếu có):</label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            name="thongBaoThue_fax"
                                            defaultValue={thueAddressState.fax}
                                        />
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Thư điện tử (nếu có):</label>
                                    <input
                                        type="email"
                                        className={styles.input}
                                        name="thongBaoThue_email"
                                        defaultValue={thueAddressState.email}
                                    />
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ textAlign: "center" }}>10.4</td>
                        <td>
                            <div className={styles.formGroup}>
                                <div className={styles.label}>
                                    <p style={{ whiteSpace: "nowrap" }}>Ngày bắt đầu hoạt động</p>
                                    {isNote && <InfoTooltip content={tooltipNgayBatDau} />}
                                    <span style={{ fontStyle: "italic", fontWeight: 400 }}>
                                        (trường hợp doanh nghiệp dự kiến bắt đầu hoạt động kể từ ngày được cấp Giấy
                                        chứng nhận đăng ký doanh nghiệp thì không cần kê khai nội dung này):
                                    </span>
                                </div>
                                <DateInput
                                    name="ngayBatDauHoatDong"
                                    className={styles.input}
                                    defaultValue={dataJson?.ngayBatDauHoatDong || ""}
                                />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ textAlign: "center" }}>10.5</td>
                        <td>
                            <div className={styles.label}>
                                <p style={{ whiteSpace: "nowrap" }}>Hình thức hạch toán</p>
                                <span style={{ fontStyle: "italic", fontWeight: 400 }}>
                                    (Đánh dấu X vào một trong hai ô "Hạch toán độc lập" hoặc "Hạch toán phụ thuộc".
                                    Trường hợp chọn ô "Hạch toán độc lập" mà thuộc đối tượng phải lập và gửi báo cáo tài
                                    chính hợp nhất cho cơ quan có thẩm quyền theo quy định thì chọn thêm ô "Có báo cáo
                                    tài chính hợp nhất")
                                </span>
                                :
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    rowGap: "8px",
                                    columnGap: "40px",
                                    maxWidth: "600px",
                                }}
                            >
                                <label
                                    className={styles.radioLabel}
                                    style={{ justifyContent: "space-between", width: "200px" }}
                                >
                                    <span>Hạch toán độc lập</span>
                                    <input
                                        type="radio"
                                        name="hinhThucHachToan"
                                        value="doc_lap"
                                        className={styles.radioInput}
                                        defaultChecked={!dataJson || dataJson.hinhThucHachToan !== "phu_thuoc"}
                                    />
                                </label>
                                <label
                                    className={styles.radioLabel}
                                    style={{ justifyContent: "space-between", width: "250px" }}
                                >
                                    <span>Có báo cáo tài chính hợp nhất</span>
                                    <input
                                        type="checkbox"
                                        name="baoCaoTaiChinhHopNhat"
                                        value="co"
                                        className={styles.radioInput}
                                        defaultChecked={dataJson?.baoCaoTaiChinhHopNhat === "co"}
                                    />
                                </label>
                                <label
                                    className={styles.radioLabel}
                                    style={{ justifyContent: "space-between", width: "200px" }}
                                >
                                    <span>Hạch toán phụ thuộc</span>
                                    <input
                                        type="radio"
                                        name="hinhThucHachToan"
                                        value="phu_thuoc"
                                        className={styles.radioInput}
                                        defaultChecked={dataJson?.hinhThucHachToan === "phu_thuoc"}
                                    />
                                </label>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ textAlign: "center" }}>10.6</td>
                        <td>
                            <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                                <div className={styles.label}>
                                    Năm tài chính: {isNote && <InfoTooltip content={tooltipNamTaiChinh} />}
                                </div>
                                <p style={{ marginTop: "4px" }}>
                                    Áp dụng từ ngày{" "}
                                    <input
                                        type="text"
                                        className={styles.input}
                                        style={{
                                            width: "60px",
                                            display: "inline-block",
                                            padding: "4px",
                                            minHeight: "30px",
                                            textAlign: "center",
                                        }}
                                        name="namTaiChinh_tuNgay"
                                        defaultValue={dataJson?.namTaiChinh_tuNgay || "01/01"}
                                    />{" "}
                                    đến ngày{" "}
                                    <input
                                        type="text"
                                        className={styles.input}
                                        style={{
                                            width: "60px",
                                            display: "inline-block",
                                            padding: "4px",
                                            minHeight: "30px",
                                            textAlign: "center",
                                        }}
                                        name="namTaiChinh_denNgay"
                                        defaultValue={dataJson?.namTaiChinh_denNgay || "31/12"}
                                    />
                                </p>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ textAlign: "center" }}>10.7</td>
                        <td>
                            <div
                                className={styles.formGroup}
                                style={{ marginBottom: 0, display: "flex", alignItems: "center", gap: "10px" }}
                            >
                                <div className={styles.label} style={{ marginBottom: 0 }}>
                                    Tổng số lao động {isNote && <InfoTooltip content={tooltipTongSoLaoDong} />}{" "}
                                    <span style={{ fontStyle: "italic", fontWeight: "normal" }}>(dự kiến)</span>:
                                </div>
                                <input
                                    type="number"
                                    className={styles.input}
                                    style={{ width: "100px", minHeight: "30px", padding: "4px 8px" }}
                                    name="tongSoLaoDong"
                                    defaultValue={dataJson?.tongSoLaoDong || "01"}
                                />
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ textAlign: "center" }}>10.8</td>
                        <td>
                            <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                                <div className={styles.label}>Hoạt động theo dự án BOT/BTO/BT/BOO, BLT, BTL, O&M:</div>
                                <div className={styles.radioGroup} style={{ padding: "4px 0 0 0" }}>
                                    <label
                                        className={styles.radioLabel}
                                        style={{ justifyContent: "center", width: "70px", gap: "10px" }}
                                    >
                                        <span>Có</span>
                                        <input
                                            type="radio"
                                            name="hoatDongDuAn"
                                            value="co"
                                            className={styles.radioInput}
                                            defaultChecked={dataJson?.hoatDongDuAn === "co"}
                                        />
                                    </label>
                                    <label
                                        className={styles.radioLabel}
                                        style={{ justifyContent: "center", width: "70px", gap: "10px" }}
                                    >
                                        <span>Không</span>
                                        <input
                                            type="radio"
                                            name="hoatDongDuAn"
                                            value="khong"
                                            className={styles.radioInput}
                                            defaultChecked={!dataJson || dataJson.hoatDongDuAn !== "co"}
                                        />
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style={{ textAlign: "center" }}>10.9</td>
                        <td>
                            <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                                <div className={styles.label}>
                                    Phương pháp tính thuế GTGT {isNote && <InfoTooltip content={tooltipPPThue} />}{" "}
                                    <span style={{ fontStyle: "italic", fontWeight: "normal" }}>
                                        (chọn 1 trong 4 phương pháp)
                                    </span>
                                    :
                                </div>
                                <div
                                    style={{ display: "flex", flexDirection: "column", gap: "8px", maxWidth: "400px" }}
                                >
                                    <label className={styles.radioLabel} style={{ justifyContent: "space-between" }}>
                                        <span>Khấu trừ</span>
                                        <input
                                            type="radio"
                                            name="phuongPhapTinhThueGTGT"
                                            value="khau_tru"
                                            className={styles.radioInput}
                                            defaultChecked={
                                                !dataJson ||
                                                (dataJson.phuongPhapTinhThueGTGT !== "truc_tiep_gtgt" &&
                                                    dataJson.phuongPhapTinhThueGTGT !== "truc_tiep_doanh_so" &&
                                                    dataJson.phuongPhapTinhThueGTGT !== "khong_nop")
                                            }
                                        />
                                    </label>
                                    <label className={styles.radioLabel} style={{ justifyContent: "space-between" }}>
                                        <span>Trực tiếp trên GTGT</span>
                                        <input
                                            type="radio"
                                            name="phuongPhapTinhThueGTGT"
                                            value="truc_tiep_gtgt"
                                            className={styles.radioInput}
                                            defaultChecked={dataJson?.phuongPhapTinhThueGTGT === "truc_tiep_gtgt"}
                                        />
                                    </label>
                                    <label className={styles.radioLabel} style={{ justifyContent: "space-between" }}>
                                        <span>Trực tiếp trên doanh số</span>
                                        <input
                                            type="radio"
                                            name="phuongPhapTinhThueGTGT"
                                            value="truc_tiep_doanh_so"
                                            className={styles.radioInput}
                                            defaultChecked={dataJson?.phuongPhapTinhThueGTGT === "truc_tiep_doanh_so"}
                                        />
                                    </label>
                                    <label className={styles.radioLabel} style={{ justifyContent: "space-between" }}>
                                        <span>Không phải nộp thuế GTGT</span>
                                        <input
                                            type="radio"
                                            name="phuongPhapTinhThueGTGT"
                                            value="khong_nop"
                                            className={styles.radioInput}
                                            defaultChecked={dataJson?.phuongPhapTinhThueGTGT === "khong_nop"}
                                        />
                                    </label>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
