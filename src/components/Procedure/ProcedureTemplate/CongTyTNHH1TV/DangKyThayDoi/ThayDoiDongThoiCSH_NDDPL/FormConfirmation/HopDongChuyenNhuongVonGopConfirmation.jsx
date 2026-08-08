import React from "react";
import styles from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormConfirmation/GiayDeNghiDKDNConfirmation.module.css";
import {
    buildContractPrefillData,
    formatDateValue,
    formatLongDate,
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
            <p style={{ margin: "3pt 0" }}>Ông/Bà: {valueOrDots(data[`${prefix}_hoTen`])}</p>
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

export default function HopDongChuyenNhuongVonGopConfirmation({ dataJson }) {
    const data = buildContractPrefillData(dataJson);
    const companyName = getCompanyName(data) || "CÔNG TY TNHH ………………";
    const companyNameUpper = companyName.toLocaleUpperCase("vi-VN");
    const contributionValue = valueOrDots(formatMoney(data.chuyenNhuong_giaTri));
    const contributionWords = valueOrDots(data.chuyenNhuong_giaTriBangChu);
    const transferPrice = valueOrDots(formatMoney(data.chuyenNhuong_gia));
    const transferPriceWords = valueOrDots(data.chuyenNhuong_giaBangChu);
    const transferRatio = valueOrDots(data.chuyenNhuong_tyLe, "……");

    return (
        <div className={styles.container} style={DOCUMENT_STYLE}>
            <p style={{ margin: 0, textAlign: "center" }}>
                <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong>
            </p>
            <p style={{ margin: "2pt 0 0", textAlign: "center" }}>
                <strong>
                    <u>Độc lập - Tự do - Hạnh phúc</u>
                </strong>
            </p>

            <h2 style={{ margin: "18pt 0 0", textAlign: "center", fontSize: "13pt" }}>
                HỢP ĐỒNG CHUYỂN NHƯỢNG PHẦN VỐN GÓP
            </h2>
            <p style={{ margin: "3pt 0 14pt", textAlign: "center" }}>
                (Số: {valueOrDots(data.hopDong_so, `…/…/HĐ-CN`)})
            </p>

            <div className={styles.content} style={DOCUMENT_STYLE}>
                <p style={{ margin: "6pt 0" }}>
                    Hôm nay, {formatLongDate(data.hopDong_ngayKy)}, tại trụ sở {companyName} tại địa chỉ:{" "}
                    {valueOrDots(data.hopDong_diaChiCongTy)}.
                </p>
                <p style={{ margin: "6pt 0" }}>Chúng tôi gồm có:</p>

                <PartyInformation heading="I- Bên A (Bên chuyển nhượng):" data={data} prefix="benA" />
                <p style={{ margin: "3pt 0" }}>
                    Sở hữu {transferRatio}% vốn điều lệ {companyName}, giá trị vốn góp là {contributionValue} đồng ({" "}
                    {contributionWords}). (Giấy chứng nhận đăng ký doanh nghiệp số: {valueOrDots(data.maSoDoanhNghiep)}{" "}
                    do {valueOrDots(data.hopDong_coQuanDangKy)} cấp lần đầu ngày{" "}
                    {valueOrDots(formatDateValue(data.hopDong_ngayCapLanDau), "…/…/……")}; đăng ký thay đổi lần thứ{" "}
                    {valueOrDots(data.hopDong_lanThayDoi, "……")} ngày{" "}
                    {valueOrDots(formatDateValue(data.hopDong_ngayThayDoi), "…/…/……")}).
                </p>

                <PartyInformation heading="II- Bên B (Bên nhận chuyển nhượng):" data={data} prefix="benB" />

                <p style={{ margin: "10pt 0 6pt" }}>
                    Sau khi bàn bạc, các bên thống nhất ký kết hợp đồng chuyển nhượng phần vốn góp như sau:
                </p>
                <p style={{ margin: "8pt 0 3pt" }}>
                    <strong>Điều 1: Đối tượng của hợp đồng</strong>
                </p>
                <p style={{ margin: "3pt 0" }}>
                    Bên A tự nguyện chuyển nhượng {transferRatio}% vốn điều lệ trong {companyName}, giá trị vốn góp là{" "}
                    {contributionValue} đồng ({contributionWords}) cho Bên B.
                </p>

                <p style={{ margin: "8pt 0 3pt" }}>
                    <strong>Điều 2: Giá chuyển nhượng</strong>
                </p>
                <p style={{ margin: "3pt 0" }}>
                    Giá chuyển nhượng: {transferPrice} đồng ({transferPriceWords}).
                </p>

                <p style={{ margin: "8pt 0 3pt" }}>
                    <strong>Điều 3: Phương thức, thời hạn và điều kiện thanh toán</strong>
                </p>
                <p style={{ margin: "3pt 0" }}>Phương thức thanh toán: Thanh toán bằng tiền Việt Nam đồng.</p>
                <p style={{ margin: "3pt 0" }}>
                    Ngay sau khi hợp đồng được ký kết, Bên B phải thanh toán cho Bên A giá trị phần vốn góp tại thời
                    điểm chuyển nhượng là {transferRatio}% vốn điều lệ trong {companyName}, giá trị vốn góp là{" "}
                    {contributionValue} đồng ({contributionWords}) bằng tiền Việt Nam đồng.
                </p>
                <p style={{ margin: "3pt 0" }}>
                    Ngay sau khi Bên B thanh toán đủ giá trị chuyển nhượng là {transferPrice} đồng ({transferPriceWords}
                    ) cho Bên A, toàn bộ {transferRatio}% vốn góp của Bên A trị giá {contributionValue} đồng ({" "}
                    {contributionWords}) trong {companyName} thuộc sở hữu của Bên B.
                </p>

                <p style={{ margin: "8pt 0 3pt" }}>
                    <strong>Điều 4: Trách nhiệm của các bên</strong>
                </p>
                <p style={{ margin: "3pt 0" }}>
                    <strong>1. Trách nhiệm của Bên A:</strong>
                </p>
                <p style={{ margin: "3pt 0" }}>
                    - Chuyển giao đầy đủ quyền và nghĩa vụ sở hữu phần vốn góp của mình trong {companyName} cho Bên B;
                </p>
                <p style={{ margin: "3pt 0" }}>
                    - Ký các giấy tờ, văn bản để thực hiện hoàn tất thủ tục chuyển nhượng cho Bên B;
                </p>
                <p style={{ margin: "3pt 0" }}>
                    - Bên A có trách nhiệm nộp mọi loại thuế, phí liên quan đến việc chuyển nhượng phần vốn góp của mình
                    theo quy định của pháp luật.
                </p>
                <p style={{ margin: "3pt 0" }}>
                    <strong>2. Trách nhiệm của Bên B:</strong>
                </p>
                <p style={{ margin: "3pt 0" }}>- Thanh toán đầy đủ và đúng hạn giá trị phần vốn chuyển nhượng;</p>
                <p style={{ margin: "3pt 0" }}>
                    - Tuân thủ Điều lệ, nội quy, quy chế và các quy định hợp pháp khác của {companyName};
                </p>
                <p style={{ margin: "3pt 0" }}>
                    - Thực hiện các quyền, nghĩa vụ; được hưởng các lợi ích và gánh chịu những rủi ro của thành viên
                    Công ty theo quy định của pháp luật kể từ ngày thanh toán xong phần chuyển nhượng.
                </p>

                <p style={{ margin: "8pt 0 3pt" }}>
                    <strong>Điều 5: Điều khoản chung</strong>
                </p>
                <p style={{ margin: "3pt 0" }}>- Hợp đồng này được ký dưới sự chứng kiến của {companyName}.</p>
                <p style={{ margin: "3pt 0" }}>
                    - Trong quá trình thực hiện hợp đồng này, nếu có vướng mắc hoặc khó khăn thì các bên phải kịp thời
                    thông báo cho nhau biết và cùng nhau bàn bạc giải quyết trên tinh thần hợp tác, tuân theo các quy
                    định của pháp luật.
                </p>
                <p style={{ margin: "3pt 0" }}>
                    - Không bên nào được tự ý thay đổi nội dung của hợp đồng này nếu không được sự đồng ý của bên còn
                    lại.
                </p>
                <p style={{ margin: "3pt 0" }}>
                    Hợp đồng này có hiệu lực kể từ ngày ký; được lập thành 03 bản có giá trị pháp lý như nhau, 01 bản
                    gửi cho {companyName} để lưu hồ sơ Công ty; mỗi bên giữ 01 bản để theo dõi và thực hiện./.
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
                                    <strong>BÊN CHUYỂN NHƯỢNG</strong>
                                </p>
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
                                    <strong>BÊN NHẬN CHUYỂN NHƯỢNG</strong>
                                </p>
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

                <table
                    className="signature-table no-border"
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        border: "none",
                        marginTop: "22pt",
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
                                    <strong>XÁC NHẬN CỦA {companyNameUpper}</strong>
                                </p>
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
