export default function BaoHiemXaHoiSection({ dataJson, styles, note }) {
    return (
        <div className={styles.sectionGroup}>
            <h3 className={styles.sectionTitle}>Thông tin về việc đóng bảo hiểm xã hội:</h3>
            {note && <div className={styles.note}>{note}</div>}
            <div className={styles.formGroup}>
                <label className={styles.label}>
                    Phương thức đóng bảo hiểm xã hội (chọn 1 trong 3 phương thức):{" "}
                    <span className={styles.required}>*</span>
                </label>
                <div className={styles.radioGroup}>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="phuongThucDongBHXH"
                            value="hang_thang"
                            className={styles.radioInput}
                            defaultChecked={
                                !dataJson?.phuongThucDongBHXH || dataJson.phuongThucDongBHXH === "hang_thang"
                            }
                            required
                        />{" "}
                        Hàng tháng
                    </label>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="phuongThucDongBHXH"
                            value="3_thang"
                            className={styles.radioInput}
                            defaultChecked={dataJson?.phuongThucDongBHXH === "3_thang"}
                        />{" "}
                        03 tháng một lần
                    </label>
                    <label className={styles.radioLabel}>
                        <input
                            type="radio"
                            name="phuongThucDongBHXH"
                            value="6_thang"
                            className={styles.radioInput}
                            defaultChecked={dataJson?.phuongThucDongBHXH === "6_thang"}
                        />{" "}
                        06 tháng một lần
                    </label>
                </div>
            </div>
        </div>
    );
}
