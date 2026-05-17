import { useState } from "react";
import AddressSelect from "@/components/AddressSelect/AddressSelect";
import DateInput from "@/components/DateInput/DateInput";
import { useFetchAddress } from "@/hooks/useFetchAddress";
import QuocGiaInput from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/QuocGiaInput/QuocGiaInput";
import {
    handleUppercaseInput,
    toUppercaseValue,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/uppercaseInput";

export default function ThongTinChuSoHuuToChucSection({ dataJson, styles }) {
    const [provinceCode, setProvinceCode] = useState("");
    const { provinces, communes, loadingCommunes } = useFetchAddress(provinceCode);

    return (
        <div className={styles.sectionGroup}>
            <h3 className={styles.sectionTitle}>Thông tin về tổ chức:</h3>
            <div className={styles.grid2}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Tên chủ sở hữu (ghi bằng chữ in hoa): <span className={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        className={styles.input}
                        name="chuSoHuuToChuc_ten"
                        defaultValue={toUppercaseValue(dataJson?.chuSoHuuToChuc_ten)}
                        style={{ textTransform: "uppercase" }}
                        onInput={handleUppercaseInput}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        Mã số doanh nghiệp/Số Quyết định thành lập: <span className={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        className={styles.input}
                        name="chuSoHuuToChuc_maSo"
                        defaultValue={dataJson?.chuSoHuuToChuc_maSo || ""}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Ngày cấp:</label>
                    <DateInput
                        name="chuSoHuuToChuc_ngayCap"
                        className={styles.input}
                        defaultValue={dataJson?.chuSoHuuToChuc_ngayCap || ""}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Nơi cấp:</label>
                    <input
                        type="text"
                        className={styles.input}
                        name="chuSoHuuToChuc_noiCap"
                        defaultValue={dataJson?.chuSoHuuToChuc_noiCap || ""}
                    />
                </div>
            </div>

            <h3 className={styles.sectionTitle} style={{ marginTop: "8px" }}>
                Địa chỉ trụ sở chính:
            </h3>
            <AddressSelect
                provinces={provinces}
                communes={communes}
                onProvinceChange={setProvinceCode}
                provinceName="chuSoHuuToChuc_tinh"
                wardName="chuSoHuuToChuc_xa"
                houseNumberName="chuSoHuuToChuc_soNha"
                provinceDefault={dataJson?.chuSoHuuToChuc_tinh || ""}
                wardDefault={dataJson?.chuSoHuuToChuc_xa || ""}
                houseNumberDefault={dataJson?.chuSoHuuToChuc_soNha || ""}
                isLoadingCommunes={loadingCommunes}
            />
            <QuocGiaInput
                name="chuSoHuuToChuc_quocGia"
                defaultValue={dataJson?.chuSoHuuToChuc_quocGia}
                styles={styles}
            />

            <div className={styles.grid2}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Điện thoại:</label>
                    <input
                        type="tel"
                        className={styles.input}
                        name="chuSoHuuToChuc_phone"
                        defaultValue={dataJson?.chuSoHuuToChuc_phone || ""}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Số fax (nếu có):</label>
                    <input
                        type="text"
                        className={styles.input}
                        name="chuSoHuuToChuc_fax"
                        defaultValue={dataJson?.chuSoHuuToChuc_fax || ""}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Thư điện tử (nếu có):</label>
                    <input
                        type="email"
                        className={styles.input}
                        name="chuSoHuuToChuc_email"
                        defaultValue={dataJson?.chuSoHuuToChuc_email || ""}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Website (nếu có):</label>
                    <input
                        type="text"
                        className={styles.input}
                        name="chuSoHuuToChuc_website"
                        defaultValue={dataJson?.chuSoHuuToChuc_website || ""}
                    />
                </div>
            </div>
        </div>
    );
}
