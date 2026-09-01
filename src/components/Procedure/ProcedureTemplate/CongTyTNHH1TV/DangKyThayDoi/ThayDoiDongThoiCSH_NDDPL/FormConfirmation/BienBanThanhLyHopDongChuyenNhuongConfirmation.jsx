import React from "react";
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormConfirmation/GiayDeNghiDKDNConfirmation.module.css";
import {
    buildLiquidationPrefillData,
    formatDateValue,
    formatLongDocumentDate,
    formatMoney,
    getCompanyName,
} from "../chuyenNhuong.utils";

const DOCUMENT_STYLE = {
    fontFamily: "'Times New Roman', Times, serif",
    fontSize: "13pt",
    lineHeight: 1.5,
    color: "#000",
};

const valueOrDots = (value, dots = "………………") => (String(value || "").trim() ? value : dots);

function InlineField({ children, marginLeft = "36pt" }) {
    return (
        <span
            className={`${styles.inlineField} inlineField`}
            style={{ display: "inline-block", marginLeft, fontWeight: "inherit", fontStyle: "normal" }}
        >
            {children}
        </span>
    );
}

function PartyInformation({ heading, data, prefix }) {
    return (
        <>
            <p style={{ margin: "12pt 0 4pt" }}>
                <strong>{heading}</strong>
            </p>
            <p style={{ margin: "3pt 0" }}>
                {valueOrDots(data[`${prefix}_xungHo`], "Ông/Bà")}: {valueOrDots(data[`${prefix}_hoTen`])}
            </p>
            <p style={{ margin: "3pt 0" }}>
                Sinh ngày: {valueOrDots(formatDateValue(data[`${prefix}_ngaySinh`]), "…/…/……")}
                <InlineField>Dân tộc: {valueOrDots(data[`${prefix}_danToc`], "……")}</InlineField>
                <InlineField>Quốc tịch: {valueOrDots(data[`${prefix}_quocTich`], "Việt Nam")}</InlineField>
            </p>
            <p style={{ margin: "3pt 0" }}>Số định danh cá nhân: {valueOrDots(data[`${prefix}_cccd`])}</p>
            <p style={{ margin: "3pt 0" }}>Địa chỉ thường trú: {valueOrDots(data[`${prefix}_diaChiThuongTru`])}</p>
            <p style={{ margin: "3pt 0" }}>Địa chỉ liên lạc: {valueOrDots(data[`${prefix}_diaChiLienLac`])}</p>
        </>
    );
}

export default function BienBanThanhLyHopDongChuyenNhuongConfirmation({ dataJson }) {
    const data = buildLiquidationPrefillData(dataJson);
    const companyName = getCompanyName(data) || "CÔNG TY TNHH ………………";
    const companyNameUpper = companyName.toLocaleUpperCase("vi-VN");
    const settlementAmount = valueOrDots(formatMoney(data.thanhLy_soTien));
    const settlementWords = valueOrDots(data.thanhLy_soTienBangChu);
    const transferRatio = valueOrDots(data.thanhLy_tyLe, "……");
    const contractNumber = valueOrDots(data.thanhLy_hopDongSo, "…/…/HĐ-CN");

    return (
        <div className={styles.container} style={DOCUMENT_STYLE}>
            <table
                className="document-header-table no-border"
                style={{ width: "100%", borderCollapse: "collapse", border: "none", ...DOCUMENT_STYLE }}
            >
                <tbody>
                    <tr>
                        <td style={{ width: "45%", border: "none", textAlign: "center", verticalAlign: "top" }}>
                            <p style={{ margin: 0, textAlign: "center" }}>
                                <strong>{companyNameUpper}</strong>
                            </p>
                            <p style={{ margin: "2pt 0 0", textAlign: "center" }}>---------</p>
                            <p style={{ margin: "8pt 0 0", textAlign: "center" }}>
                                Số: {valueOrDots(data.thanhLy_so, "…/…/BBTL")}
                            </p>
                        </td>
                        <td style={{ width: "55%", border: "none", textAlign: "center", verticalAlign: "top" }}>
                            <p style={{ margin: 0, textAlign: "center" }}>
                                <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong>
                            </p>
                            <p style={{ margin: "2pt 0 0", textAlign: "center" }}>
                                <strong>
                                    <u>Độc lập - Tự do - Hạnh phúc</u>
                                </strong>
                            </p>
                            <p style={{ margin: "8pt 0 0", textAlign: "center" }}>
                                <em>{formatLongDocumentDate(data.thanhLy_ngay, data.thanhLy_diaDiem)}</em>
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>

            <h2 style={{ margin: "20pt 0 0", textAlign: "center", fontSize: "13pt" }}>BIÊN BẢN THANH LÝ</h2>
            <p style={{ margin: "2pt 0 14pt", textAlign: "center" }}>
                <strong>HỢP ĐỒNG CHUYỂN NHƯỢNG PHẦN VỐN GÓP</strong>
            </p>

            <div className={styles.content} style={DOCUMENT_STYLE}>
                <p style={{ margin: "6pt 0" }}>
                    Hôm nay, vào lúc {valueOrDots(data.thanhLy_gio, "……")} giờ, ngày{" "}
                    {valueOrDots(formatDateValue(data.thanhLy_ngay), "…/…/……")}, tại trụ sở {companyName} tại địa chỉ:{" "}
                    {valueOrDots(data.hopDong_diaChiCongTy)}, chúng tôi gồm:
                </p>

                <PartyInformation heading="Bên chuyển nhượng (Sau đây gọi tắt là Bên A):" data={data} prefix="benA" />
                <PartyInformation
                    heading="Bên nhận chuyển nhượng (Sau đây gọi tắt là Bên B):"
                    data={data}
                    prefix="benB"
                />

                <p style={{ margin: "10pt 0 6pt" }}>
                    Hai bên thống nhất thanh lý Hợp đồng chuyển nhượng phần vốn góp số {contractNumber} ký kết ngày{" "}
                    {valueOrDots(formatDateValue(data.thanhLy_hopDongNgay), "…/…/……")}, với nội dung cụ thể như sau:
                </p>
                <p style={{ margin: "6pt 0" }}>
                    Bên A đã ký kết và thực hiện việc chuyển nhượng phần vốn góp thuộc quyền sở hữu của mình trong{" "}
                    {companyName} cho Bên B theo đúng nội dung mà hai bên đã thỏa thuận trong hợp đồng, cụ thể:
                </p>
                <p style={{ margin: "6pt 0" }}>
                    Bên chuyển nhượng ({valueOrDots(data.benA_xungHo, "Ông/Bà")} {valueOrDots(data.benA_hoTen)}) đã
                    nhận đủ {settlementAmount} đồng ({" "}
                    {settlementWords}); Bên nhận chuyển nhượng đã thanh toán đủ số tiền nêu trên, tương ứng với{" "}
                    {transferRatio}% tổng vốn điều lệ Công ty cho Bên chuyển nhượng.
                </p>
                <p style={{ margin: "6pt 0" }}>
                    Kể từ thời điểm ký kết Biên bản thanh lý hợp đồng này, hai bên chấm dứt mọi quyền và nghĩa vụ đã
                    thỏa thuận trong Hợp đồng chuyển nhượng phần vốn góp số {contractNumber}.
                </p>
                <p style={{ margin: "6pt 0" }}>
                    Biên bản này bao gồm 02 (hai) trang, được lập thành 02 (hai) bản; mỗi bên giữ 01 (một) bản có giá
                    trị pháp lý như nhau.
                </p>

                <table
                    className="party-signature-table no-border"
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        border: "none",
                        marginTop: "18pt",
                        ...DOCUMENT_STYLE,
                    }}
                >
                    <tbody>
                        <tr>
                            <td style={{ width: "50%", border: "none", textAlign: "center", verticalAlign: "top" }}>
                                <p style={{ margin: 0, textAlign: "center" }}>
                                    <strong>BÊN A</strong>
                                </p>
                                <p style={{ margin: 0, textAlign: "center" }}>
                                    <em>(Ký và ghi rõ họ tên)</em>
                                </p>
                                <p style={{ margin: "56pt 0 0", textAlign: "center" }}>{data.benA_hoTen || ""}</p>
                            </td>
                            <td style={{ width: "50%", border: "none", textAlign: "center", verticalAlign: "top" }}>
                                <p style={{ margin: 0, textAlign: "center" }}>
                                    <strong>BÊN B</strong>
                                </p>
                                <p style={{ margin: 0, textAlign: "center" }}>
                                    <em>(Ký và ghi rõ họ tên)</em>
                                </p>
                                <p style={{ margin: "56pt 0 0", textAlign: "center" }}>{data.benB_hoTen || ""}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p style={{ margin: "22pt 0 6pt", textAlign: "center" }}>
                    <strong>XÁC NHẬN CỦA CÔNG TY</strong>
                </p>
                <p style={{ margin: "3pt 0" }}>
                    {companyName} xác nhận Bên A ({valueOrDots(data.benA_xungHo, "Ông/Bà")}{" "}
                    {valueOrDots(data.benA_hoTen)}) tự nguyện chuyển nhượng {transferRatio}% vốn điều lệ trong{" "}
                    {companyName}, giá trị vốn góp là {settlementAmount} đồng ({settlementWords}) cho Bên B (
                    {valueOrDots(data.benB_xungHo, "Ông/Bà")} {valueOrDots(data.benB_hoTen)}). Hợp đồng chuyển nhượng
                    trên đã
                    hoàn thành vào ngày {valueOrDots(formatDateValue(data.thanhLy_ngayHoanThanh), "…/…/……")}.
                </p>

                <table
                    className="signature-table no-border"
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        border: "none",
                        marginTop: "16pt",
                        ...DOCUMENT_STYLE,
                    }}
                >
                    <tbody>
                        <tr>
                            <td className="signature-spacer" style={{ border: "none" }}>
                                &nbsp;
                            </td>
                            <td className="signature-cell" style={{ border: "none", textAlign: "center" }}>
                                <p style={{ margin: 0, textAlign: "center" }}>
                                    <strong>NGƯỜI ĐẠI DIỆN THEO PHÁP LUẬT CỦA DOANH NGHIỆP</strong>
                                </p>
                                <p style={{ margin: 0, textAlign: "center" }}>
                                    <em>(Ký và đóng dấu)</em>
                                </p>
                                <p style={{ margin: "64pt 0 0", textAlign: "center" }}>
                                    {data.nguoiDaiDien_hoTen || ""}
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
