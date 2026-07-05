import React from "react";
import styles from "./DieuLeCongTyConfirmation.module.css";
import { formatDate } from "@/utils/dateTimeUtils";
import {
    DEFAULT_TNHH_COMPANY_NAME_PREFIX,
    getCompanyNamePrefix,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/companyNamePrefix";

const formatCurrency = (value) => {
    if (value === null || value === undefined || value === "") return "";
    const str = value.toString().trim();
    const numStr = str.replace(/\./g, "").replace(/,/g, "");
    if (!isNaN(numStr) && numStr !== "") {
        return Number(numStr).toLocaleString("vi-VN");
    }
    return str;
};

export default function DieuLeCongTyConfirmation({ dataJson }) {
    if (!dataJson) return <p style={{ padding: "20px", textAlign: "center" }}>Đang tải dữ liệu...</p>;
    const companyNamePrefix = getCompanyNamePrefix(dataJson, DEFAULT_TNHH_COMPANY_NAME_PREFIX);

    return (
        <div className={styles.documentContainer}>
            <div className={styles.header}>
                <p className={styles.bold}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                <h3 className={styles.headerSubtitle}>Độc lập - Tự do - Hạnh phúc</h3>
                <p className={styles.title}>ĐIỀU LỆ</p>
                <p className={styles.subTitle}>
                    {companyNamePrefix}{" "}
                    {dataJson.tenCongTyVN?.toUpperCase() || "................................................"}
                </p>
            </div>
            <p className={styles.italicText}>
                Căn cứ Luật Doanh nghiệp số 59/2020/QH14 được Quốc hội thông qua ngày 17 tháng 06 năm 2020 được sửa đổi,
                bổ sung một số điều theo luật số 03/2022/QH15 và luật số 76/2025/QH15 và các văn bản hướng dẫn thi hành
                Luật Doanh nghiệp
            </p>
            <p className={styles.chapterTitle}>CHƯƠNG I. NHỮNG QUY ĐỊNH CHUNG</p>
            <p className={styles.articleTitle}>Điều 1: Hình thức</p>
            <p>
                1. {companyNamePrefix} {dataJson.tenCongTyVN?.toUpperCase() || ".............................."} thuộc
                hình thức Công ty trách nhiệm hữu hạn một thành viên và thuộc sở hữu của cá nhân{" "}
                {dataJson.chuSoHuu_gioiTinh === "Nam" ? "Ông" : "Bà"}{" "}
                {dataJson.chuSoHuu_hoTen || ".............................."}
            </p>
            <p>
                2. Công ty được thành lập và hoạt động hợp pháp tại Việt Nam, thực hiện các hoạt động kinh doanh theo
                quy định của pháp luật.
            </p>
            <p>
                3. Công ty có tư cách pháp nhân kể từ ngày được cấp Giấy chứng nhận Đăng ký doanh nghiệp, có con dấu
                riêng, có tài khoản bằng tiền Việt Nam và ngoại tệ.
            </p>
            <p>
                4. Chủ sở hữu Công ty chịu trách nhiệm về các khoản nợ và nghĩa vụ tài sản khác của Công ty trong phạm
                vi số vốn điều lệ của công ty
            </p>
            <p>
                5. Công ty trách nhiệm hữu hạn một thành viên được phát hành trái phiếu theo quy định của Luật Doanh
                nghiệp 2020 và quy định khác của pháp luật có liên quan; việc phát hành trái phiếu riêng lẻ theo quy
                định tại Điều 128 và Điều 129 của Luật Doanh nghiệp 2020.
            </p>
            <p className={styles.articleTitle}>Điều 2: Tên gọi, trụ sở chính, chi nhánh và văn phòng đại diện</p>
            <p>
                <strong>1. Tên công ty:</strong>
            </p>
            <p>
                Tên công ty viết bằng tiếng Việt (<em>ghi bằng chữ in hoa</em>): {companyNamePrefix}{" "}
                {dataJson.tenCongTyVN?.toUpperCase() || "................................................"}
            </p>
            <p>
                Tên công ty viết bằng tiếng nước ngoài (<em>nếu có</em>):{" "}
                {dataJson.tenCongTyEN || "................................................"}
            </p>
            <p>
                Tên công ty viết tắt (<em>nếu có</em>):{" "}
                {dataJson.tenCongTyVietTat || "................................................"}
            </p>
            <p>
                <strong>2. Địa chỉ trụ sở chính:</strong>
            </p>
            <p>{dataJson.diaChiTruSo || "........................................................................"}</p>
            <p>
                Điện thoại: {dataJson.dienThoai || "..................."}
                <b
                    style={{
                        marginLeft: "20px",
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    Số fax (<em>nếu có</em>): {dataJson.fax || "..................."}
                </b>
            </p>
            <p>
                <>
                    Thư điện tử (<em>nếu có</em>): {dataJson.email || "..................."}
                </>
                <b
                    style={{
                        marginLeft: "20px",
                        fontWeight: "inherit",
                        fontStyle: "normal",
                    }}
                >
                    Website (<em>nếu có</em>): {dataJson.website || "..................."}
                </b>
            </p>
            <p>
                <strong>3. </strong>Công ty có thể thành lập chi nhánh, văn phòng đại diện, địa điểm kinh doanh ở trong
                nước và nước ngoài khi có nhu cầu và phải tuân theo các quy định của pháp luật.
            </p>
            <p>
                <strong>4. </strong>Công ty có thể thành lập liên doanh với các tổ chức và cá nhân trong nước và nước
                ngoài khi được sự nhất trí bằng văn bản của chủ sở hữu công ty và được sự chấp thuận của các cơ quan
                quản lý nhà nước có thẩm quyền.
            </p>
            <p className={styles.articleTitle}>Điều 3: Ngành, nghề kinh doanh</p>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th style={{ width: "40px" }}>
                            <p
                                style={{
                                    margin: 0,
                                    lineHeight: "inherit",
                                    textAlign: "inherit",
                                    font: "inherit",
                                }}
                            >
                                STT
                            </p>
                        </th>
                        <th>
                            <p
                                style={{
                                    margin: 0,
                                    lineHeight: "inherit",
                                    textAlign: "inherit",
                                    font: "inherit",
                                }}
                            >
                                Tên ngành
                            </p>
                        </th>
                        <th style={{ width: "100px" }}>
                            <p
                                style={{
                                    margin: 0,
                                    lineHeight: "inherit",
                                    textAlign: "inherit",
                                    font: "inherit",
                                }}
                            >
                                Mã ngành
                            </p>
                        </th>
                        <th>
                            <p
                                style={{
                                    margin: 0,
                                    lineHeight: "inherit",
                                    textAlign: "inherit",
                                    font: "inherit",
                                }}
                            >
                                Ngành, nghề kinh doanh chính
                                <br />(<em>đánh dấu X</em>)
                            </p>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {dataJson.nganhNgheList && dataJson.nganhNgheList.length > 0 ? (
                        dataJson.nganhNgheList.map((row, idx) => (
                            <tr key={idx}>
                                <td style={{ textAlign: "center" }}>
                                    <p
                                        style={{
                                            margin: 0,
                                            lineHeight: "inherit",
                                            textAlign: "inherit",
                                            font: "inherit",
                                        }}
                                    >
                                        {idx + 1}
                                    </p>
                                </td>
                                <td style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                                    <p
                                        style={{
                                            margin: 0,
                                            lineHeight: "inherit",
                                            textAlign: "inherit",
                                            font: "inherit",
                                        }}
                                    >
                                        {row.tenNganh}
                                        {row.chiTiet && <span style={{ display: "block", marginTop: "4px" }}>{row.chiTiet}</span>}
                                    </p>
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    <p
                                        style={{
                                            margin: 0,
                                            lineHeight: "inherit",
                                            textAlign: "inherit",
                                            font: "inherit",
                                        }}
                                    >
                                        {row.maNganh}
                                    </p>
                                </td>
                                <td style={{ textAlign: "center" }}>
                                    <p
                                        style={{
                                            margin: 0,
                                            lineHeight: "inherit",
                                            textAlign: "inherit",
                                            font: "inherit",
                                        }}
                                    >
                                        {row.laNganhChinh ? "X" : ""}
                                    </p>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td style={{ textAlign: "center" }}>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    1
                                </p>
                            </td>
                            <td>
                                <p
                                    style={{
                                        margin: 0,
                                        lineHeight: "inherit",
                                        textAlign: "inherit",
                                        font: "inherit",
                                    }}
                                >
                                    ................................................
                                </p>
                            </td>
                            <td></td>
                            <td></td>
                        </tr>
                    )}
                </tbody>
            </table>
            <p className={styles.articleTitle}>Điều 4: Chủ sở hữu công ty</p>
            <div className={styles.flexRow}>
                <p>
                    <>Họ và tên: </>
                    {dataJson.chuSoHuu_hoTen || "........................................."}
                </p>
                <p>Giới tính: {dataJson.chuSoHuu_gioiTinh || ".........."}</p>
            </div>
            <div className={styles.flexRow}>
                <p>Sinh ngày: {formatDate(dataJson.chuSoHuu_ngaySinh) || "....................."}</p>
                <p>Dân tộc: {dataJson.chuSoHuu_danToc || "Kinh"}</p>
                <p>Quốc tịch: {dataJson.chuSoHuu_quocTich || "Việt Nam"}</p>
            </div>
            <p>
                Số định danh cá nhân:{" "}
                {dataJson.chuSoHuu_cccd || ".........................................................."}
            </p>
            <p>
                Địa chỉ liên lạc:{" "}
                {[dataJson.chuSoHuu_soNha, dataJson.chuSoHuu_xa, dataJson.chuSoHuu_tinh].filter(Boolean).join(", ") ||
                    ".........................................................."}
            </p>
            <p className={styles.articleTitle}>Điều 5: Vốn điều lệ và thay đổi vốn điều lệ</p>
            <p>1. Vốn điều lệ: </p>
            <p>
                - Vốn bằng tiền mặt:{" "}
                {formatCurrency(dataJson.vonTienMat) || "................................................."} VNĐ
            </p>
            <p>- Vốn bằng tài sản: Không.</p>
            <p>- Vốn khác: Không.</p>
            <p>
                2. Thời hạn góp vốn: Chủ sở hữu công ty phải góp vốn cho công ty đủ và đúng loại tài sản đã cam kết khi
                đăng ký thành lập doanh nghiệp trong thời hạn 90 ngày kể từ ngày được cấp Giấy chứng nhận đăng ký doanh
                nghiệp, không kể thời gian vận chuyển, nhập khẩu tài sản góp vốn, thực hiện thủ tục hành chính để chuyển
                quyền sở hữu tài sản.
            </p>
            <p>3. Thay đổi vốn điều lệ: </p>
            <p>
                a) Công ty thay đổi vốn điều lệ trong các trường hợp: Hoàn trả một phần vốn góp trong vốn điều lệ của
                công ty nếu đã hoạt động kinh doanh liên tục trong hơn 02 năm, kể từ ngày đăng ký doanh nghiệp và bảo
                đảm thanh toán đủ các khoản nợ và nghĩa vụ tài sản khác sau khi đã hoàn trả cho chủ sở hữu;
            </p>
            <p>
                b) Công ty tăng vốn điều lệ bằng việc chủ sở hữu công ty đầu tư thêm hoặc huy động thêm vốn góp của
                người khác. Chủ sở hữu quyết định hình thức tăng và mức tăng vốn điều lệ. Trường hợp tăng vốn điều lệ
                bằng việc huy động thêm phần vốn góp của người khác, công ty sẽ đăng ký chuyển đổi thành Công ty trách
                nhiệm hai thành viên trở lên và công ty phải thông báo thay đổi nội dung đăng ký doanh nghiệp trong thời
                hạn 10 ngày, kể từ ngày hoàn thành việc tăng vốn vốn điều lệ hoặc công ty đăng ký chuyển đổi thành Công
                ty cổ phần theo quy định tại Điều 202 của Luật Doanh nghiệp số 59/2020/QH14 ngày 17/06/2020.
            </p>
            <p className={styles.articleTitle}>Điều 6: Con dấu doanh nghiệp</p>
            <p>
                1. Doanh nghiệp có quyền quyết định về hình thức, số lượng và nội dung con dấu của doanh nghiệp. Nội
                dung con dấu phải thể hiện những thông tin sau đây: a) Tên doanh nghiệp; b) Mã số doanh nghiệp. c) Con
                dấu hình tròn, kích cỡ (3,6 cm), mầu mực dấu đỏ và Doanh nghiệp có một mẫu con dấu thống nhất về nội
                dung, hình thức và kích thước.
            </p>
            <p>
                2. Công ty có 01 con dấu, người đại diện theo pháp luật quản lý, sử dụng đóng vào các văn bản công ty
                phát hành và lưu giữ con dấu thực hiện tại trụ sở công ty và chỉ được mang con dấu ra khỏi trụ sở chính
                khi được Chủ sở hữu chấp thuận bằng văn bản;
            </p>
            <p className={styles.articleTitle}>Điều 7: Quyền và nghĩa vụ của chủ sở hữu công ty</p>
            <p>
                <strong>1. Quyền của chủ sở hữu:</strong>
            </p>
            <p>
                a) Quyết định, nội dung Điều lệ công ty, sửa đổi, bổ sung Điều lệ công ty;
                <br />
                b) Quyết định đầu tư, kinh doanh và quản trị nội bộ công ty, trừ trường hợp Điều lệ công ty có quy định
                khác;
                <br />
                c) Quyết định tăng vốn điều lệ, chuyển nhượng một phần hoặc toàn bộ vốn điều lệ của công ty cho tổ chức,
                cá nhân khác;
                <br />
                d) Quyết định việc sử dụng lợi nhuận sau khi đã hoàn thành nghĩa vụ thuế và các nghĩa vụ tài chính khác
                của công ty;
                <br />
                đ) Quyết định tổ chức lại, giải thể và yêu cầu phá sản công ty;
                <br />
                e) Thu hồi toàn bộ giá trị tài sản của công ty sau khi công ty hoàn thành giải thể hoặc phá sản;
                <br />
                f) Quyền khác theo quy định của Luật Doanh nghiệp số 59/2020/QH14 ngày 17/06/2020 và Điều lệ công ty.
            </p>
            <p>
                <strong>2. Nghĩa vụ của chủ sở hữu:</strong>
            </p>
            <p>
                a) Góp đầy đủ và đúng hạn vốn điều lệ công ty;
                <br />
                b) Tuân thủ Điều lệ công ty;
                <br />
                c) Phải xác định và tách biệt tài sản của chủ sở hữu công ty và tài sản của công ty. Chủ sở hữu công ty
                phải tách biệt các chi tiêu của cá nhân và gia đình mình với các chi tiêu trên cương vị là Chủ tịch công
                ty và Giám đốc;
                <br />
                d) Tuân thủ quy định của pháp luật về hợp đồng và pháp luật có liên quan trong việc mua, bán, vay, cho
                vay, thuê, cho thuê và các giao dịch khác giữa công ty và chủ sở hữu công ty;
                <br />
                đ) Chủ sở hữu công ty chỉ được quyền rút vốn bằng cách chuyển nhượng một phần hoặc toàn bộ vốn điều lệ
                cho tổ chức hoặc cá nhân khác; trường hợp rút một phần hoặc toàn bộ vốn điều lệ đã góp ra khỏi công ty
                dưới hình thức khác thì chủ sở hữu và cá nhân, tổ chức có liên quan phải liên đới chịu trách nhiệm về
                các khoản nợ và nghĩa vụ tài sản khác của công ty;
                <br />
                e) Chủ sở hữu công ty không được rút lợi nhuận khi công ty không thanh toán đủ các khoản nợ và nghĩa vụ
                tài sản khác đến hạn;
                <br />
                f) Thực hiện nghĩa vụ khác theo quy định của Luật Doanh nghiệp số 59/2020/QH14 ngày 17/06/2020 và Điều
                lệ công ty.
            </p>
            <p className={styles.chapterTitle}>CHƯƠNG II. TỔ CHỨC - QUẢN LÝ - HOẠT ĐỘNG</p>
            <p className={styles.articleTitle}>Điều 8: Quyền hạn và nghĩa vụ của công ty </p>
            <p>
                <strong>1. Công ty có các quyền sau:</strong>
                <br />
                a) Tự do kinh doanh trong những ngành, nghề mà luật không cấm.
                <br />
                b) Tự chủ kinh doanh và lựa chọn hình thức tổ chức kinh doanh; chủ động lựa chọn ngành, nghề, địa bàn,
                hình thức kinh doanh; chủ động điều chỉnh quy mô và ngành, nghề kinh doanh.
                <br />
                c) Lựa chọn hình thức, phương thức huy động, phân bổ và sử dụng vốn.
                <br />
                d) Chủ động tìm kiếm thị trường, khách hàng và ký kết hợp đồng.
                <br />
                e) Kinh doanh xuất khẩu, nhập khẩu.
                <br />
                f) Tuyển dụng, thuê và sử dụng lao động theo yêu cầu kinh doanh.
                <br />
                g) Chủ động ứng dụng khoa học và công nghệ để nâng cao hiệu quả kinh doanh và khả năng cạnh tranh.
                <br />
                h) Chiếm hữu, sử dụng, định đoạt tài sản của doanh nghiệp.
                <br />
                i) Từ chối yêu cầu cung cấp nguồn lực không theo quy định của pháp luật
                <br />
                k) Khiếu nại, tố cáo theo quy định của pháp luật về khiếu nại, tố cáo.
                <br />
                l) Tham gia tố tụng theo quy định của pháp luật.
                <br />
                m) Quyền khác theo quy định của luật có liên quan.
            </p>
            <p>
                <strong>2. Công ty có các nghĩa vụ sau:</strong>
                <br />
                a) Đáp ứng đủ điều kiện kinh doanh khi kinh doanh ngành, nghề kinh doanh có điều kiện theo quy định của
                pháp luật và bảo đảm duy trì đủ điều kiện đầu tư kinh doanh đó trong suốt quá trình hoạt động kinh
                doanh.
                <br />
                b) Tổ chức công tác kế toán, lập và nộp báo cáo tài chính trung thực, chính xác, đúng thời hạn theo quy
                định của pháp luật về kế toán, thống kê.
                <br />
                c) Kê khai thuế, nộp thuế và thực hiện các nghĩa vụ tài chính khác theo quy định của pháp luật.
                <br />
                d) Bảo đảm quyền, lợi ích hợp pháp, chính đáng của người lao động theo quy định của pháp luật về lao
                động; không được phân biệt đối xử và xúc phạm danh dự, nhân phẩm của người lao động trong doanh nghiệp;
                không được sử dụng lao động cưỡng bức và lao động trẻ em; hỗ trợ và tạo điều kiện thuận lợi cho người
                lao động tham gia đào tạo nâng cao trình độ, kỹ năng nghề; thực hiện chế độ bảo hiểm xã hội, bảo hiểm
                thất nghiệp, bảo hiểm y tế và bảo hiểm khác cho người lao động theo quy định của pháp luật.
                <br />
                e) Bảo đảm và chịu trách nhiệm về chất lượng hàng hóa, dịch vụ theo tiêu chuẩn do pháp luật quy định
                hoặc tiêu chuẩn đã đăng ký hoặc công bố.
                <br />
                f) Thực hiện đầy đủ, kịp thời các nghĩa vụ về đăng ký doanh nghiệp, đăng ký thay đổi nội dung đăng ký
                doanh nghiệp, công khai thông tin về thành lập và hoạt động, báo cáo và các nghĩa vụ khác theo quy định
                của Luật Doanh nghiệp số 59/2020/QH14 ngày 17/06/2020 và quy định khác của pháp luật có liên quan.
                <br />
                g) Chịu trách nhiệm về tính trung thực, chính xác của thông tin kê khai trong hồ sơ đăng ký doanh nghiệp
                và các báo cáo; trường hợp phát hiện thông tin đã kê khai hoặc báo cáo thiếu chính xác, chưa đầy đủ thì
                phải kịp thời sửa đổi, bổ sung các thông tin đó.
                <br />
                h) Tuân thủ quy định của pháp luật về quốc phòng, an ninh, trật tự, an toàn xã hội, bình đẳng giới, bảo
                vệ tài nguyên, môi trường, bảo vệ di tích lịch sử - văn hóa và danh lam thắng cảnh.
                <br />
                i) Thực hiện nghĩa vụ về đạo đức kinh doanh để bảo đảm quyền, lợi ích hợp pháp của khách hàng và người
                tiêu dùng.
            </p>
            <p className={styles.articleTitle}>Điều 9: Cơ cấu tổ chức quản lý </p>
            <p>
                1. Công ty có chủ tịch công ty và giám đốc.
                <br />
                2. Chủ tịch công ty kiêm nhiệm giám đốc công ty.
                <br />
                3. Quyền, nghĩa vụ, nhiệm vụ cụ thể của giám đốc được quy định tại Điều lệ công ty.
            </p>
            <p className={styles.articleTitle}>Điều 10: Người đại diện theo pháp luật của công ty.</p>
            <p>
                1. Công ty chỉ có duy nhất một người đại diện theo pháp luật. Giám đốc là người đại diện theo pháp luật.
            </p>
            <div className={styles.flexRow}>
                <p>
                    <>Họ và tên: </>
                    {dataJson.nguoiDaiDien_hoTen || "........................................."}
                </p>
                <p>Giới tính: {dataJson.nguoiDaiDien_gioiTinh || ".........."}</p>
            </div>
            <div className={styles.flexRow}>
                <p>Sinh ngày: {formatDate(dataJson.nguoiDaiDien_ngaySinh) || "....................."}</p>
                <p>Dân tộc: {dataJson.nguoiDaiDien_danToc || "Kinh"}</p>
                <p>Quốc tịch: {dataJson.nguoiDaiDien_quocTich || "Việt Nam"}</p>
            </div>
            <p>
                Số định danh cá nhân:{" "}
                {dataJson.nguoiDaiDien_cccd || ".........................................................."}
            </p>
            <p>
                Địa chỉ liên lạc:{" "}
                {[dataJson.nguoiDaiDien_soNha, dataJson.nguoiDaiDien_xa, dataJson.nguoiDaiDien_tinh]
                    .filter(Boolean)
                    .join(", ") || ".........................................................."}
            </p>
            <p>
                <>Chức danh: </>
                {dataJson.nguoiDaiDien_chucDanh || "Giám đốc"}
            </p>
            <p>
                <strong>2. Quyền và nghĩa vụ của người đại diện theo pháp luật.</strong>
            </p>
            <p>
                - Người đại diện theo pháp luật của doanh nghiệp là cá nhân đại diện cho doanh nghiệp thực hiện các
                quyền và nghĩa vụ phát sinh từ giao dịch của doanh nghiệp, đại diện cho doanh nghiệp với tư cách là
                người yêu cầu giải quyết dân sự, nguyên đơn, bị đơn, người có quyền lợi, nghĩa vụ liên quan trước Trọng
                tài, Tòa án và các quyền và nghĩa vụ khác theo quy định của pháp luật.
            </p>
            <p>
                - Người đại diện theo pháp luật của doanh nghiệp phải chịu liên đới với các thiệt hại gây ra cho doanh
                nghiệp theo quy định của pháp luật về dân sự và quy định khác của pháp luật có liên quan.
            </p>
            <p>
                - Người đại diện theo pháp luật của công ty phải cư trú ở Việt Nam và phải ủy quyền bằng văn bản cho
                người khác thực hiện quyền và nghĩa vụ của người đại diện theo pháp luật khi xuất cảnh khỏi Việt Nam.
                Trường hợp này người đại diện vẫn phải chịu trách nhiệm về việc thực hiện quyền và nghĩa vụ đã ủy quyền.
                Trường hợp hết thời hạn ủy quyền theo quy định mà người đại diện theo pháp luật chưa trở lại Việt Nam và
                không có ủy quyền khác thì thực hiện theo quy định sau đây:
            </p>
            <p>
                + Người được ủy quyền tiếp tục thực hiện các quyền và nghĩa vụ của người đại diện theo pháp luật của
                doanh nghiệp tư nhân cho đến khi người đại diện theo pháp luật của doanh nghiệp trở lại làm việc tại
                doanh nghiệp;
            </p>
            <p>
                + Người được ủy quyền tiếp tục thực hiện các quyền và nghĩa vụ của người đại diện theo pháp luật của
                công ty trách nhiệm hữu hạn, công ty cổ phần, công ty hợp danh cho đến khi người đại diện theo pháp luật
                của công ty trở lại làm việc tại công ty hoặc cho đến khi chủ sở hữu công ty, Hội đồng thành viên, Hội
                đồng quản trị quyết định cử người khác làm người đại diện theo pháp luật của doanh nghiệp.
            </p>
            <p>
                - Người đại diện theo pháp luật của doanh nghiệp vắng mặt tại Việt Nam quá 30 ngày mà không ủy quyền cho
                người khác thực hiện các quyền và nghĩa vụ của người đại diện theo pháp luật của doanh nghiệp hoặc chết,
                mất tích, đang bị truy cứu trách nhiệm hình sự, bị tạm giam, đang chấp hành hình phạt tù, đang chấp hành
                biện pháp xử lý hành chính tại cơ sở cai nghiện bắt buộc, cơ sở giáo dục bắt buộc, bị hạn chế hoặc mất
                năng lực hành vi dân sự, có khó khăn trong nhận thức, làm chủ hành vi, bị Tòa án cấm đảm nhiệm chức vụ,
                cấm hành nghề hoặc làm công việc nhất định thì chủ sở hữu công ty cử người khác làm người đại diện theo
                pháp luật của công ty.
            </p>
            <p>Người đại diện theo pháp luật có các quyền và nghĩa vụ sau đây:</p>
            <p>- Tổ chức thực hiện quyết định của Chủ tịch công ty;</p>
            <p>- Quyết định các vấn đề liên quan đến hoạt động kinh doanh hằng ngày của công ty;</p>
            <p>- Tổ chức thực hiện kế hoạch kinh doanh và phương án đầu tư của công ty;</p>
            <p>- Ban hành quy chế quản lý nội bộ của công ty;</p>
            <p>
                - Bổ nhiệm, miễn nhiệm, bãi nhiệm người quản lý trong công ty, trừ các đối tượng thuộc thẩm quyền của
                Chủ tịch công ty;
            </p>
            <p>- Ký kết hợp đồng nhân danh công ty, trừ trường hợp thuộc thẩm quyền của Chủ tịch công ty;</p>
            <p>- Kiến nghị phương án cơ cấu tổ chức công ty;</p>
            <p>- Trình báo cáo quyết toán tài chính hằng năm lên Chủ tịch công ty;</p>
            <p>- Kiến nghị phương án sử dụng lợi nhuận hoặc xử lý lỗ trong kinh doanh;</p>
            <p>- Tuyển dụng lao động;</p>
            <p>
                - Quyền và nghĩa vụ khác được quy định tại Điều lệ công ty, hợp đồng lao động mà Giám đốc ký với Chủ
                tịch công ty.
            </p>
            <p>
                <strong>3. Trách nhiệm của người đại diện theo pháp luật.</strong>
            </p>
            <p>
                a) Thực hiện các quyền và nghĩa vụ được giao một cách trung thực, cẩn trọng, tốt nhất nhằm bảo đảm lợi
                ích hợp pháp của doanh nghiệp;
            </p>
            <p>
                b) Trung thành với lợi ích của doanh nghiệp; không sử dụng thông tin, bí quyết, cơ hội kinh doanh của
                doanh nghiệp, không lạm dụng địa vị, chức vụ và sử dụng tài sản của doanh nghiệp để tư lợi hoặc phục vụ
                lợi ích của tổ chức, cá nhân khác;
            </p>
            <p>
                c) Thông báo kịp thời, đầy đủ, chính xác cho doanh nghiệp về việc người đại diện đó và người có liên
                quan của họ làm chủ hoặc có cổ phần, phần vốn góp chi phối tại các doanh nghiệp khác.
            </p>
            <p>
                Người đại diện theo pháp luật của doanh nghiệp chịu trách nhiệm cá nhân đối với những thiệt hại cho
                doanh nghiệp do vi phạm nghĩa vụ tại Khoản 2 Điều 10 Điều lệ công ty.
            </p>
            <p>
                Người đại diện theo pháp luật của doanh nghiệp là cá nhân đại diện cho doanh nghiệp thực hiện các quyền
                và nghĩa vụ phát sinh từ giao dịch của doanh nghiệp, đại diện cho doanh nghiệp với tư cách người yêu cầu
                giải quyết việc dân sự, nguyên đơn, bị đơn, người có quyền lợi, nghĩa vụ liên quan trước Trọng tài, Tòa
                án và các quyền, nghĩa vụ khác theo quy định của pháp luật.
            </p>
            <p className={styles.articleTitle}>Điều 11: Chủ tịch công ty</p>
            <p>
                1. Chủ sở hữu công ty là Chủ tịch công ty. Chủ tịch công ty nhân danh chủ sở hữu thực hiện các quyền và
                nghĩa vụ của chủ sở hữu công ty; nhân danh công ty thực hiện các quyền và nghĩa vụ của công ty, trừ
                quyền và nghĩa vụ của Giám đốc; chịu trách nhiệm trước pháp luật và chủ sở hữu công ty về việc thực hiện
                các quyền và nghĩa vụ được giao theo quy định của pháp luật liên quan và Điều lệ công ty.
            </p>
            <p>
                2. Quyền, nghĩa vụ và chế độ làm việc của Chủ tịch công ty đối với chủ sở hữu công ty được thực hiện
                theo quy định tại Điều lệ công ty và pháp luật liên quan.
            </p>
            <p>
                3. Quyết định của Chủ tịch công ty về thực hiện quyền và nghĩa vụ của chủ sở hữu công ty có hiệu lực kể
                từ ngày được chủ sở hữu công ty phê duyệt, trừ trường hợp Điều lệ công ty có quy định khác.
            </p>
            <p className={styles.articleTitle}>Điều 12: Giám đốc Công ty </p>
            <p>1. Giám đốc phải có các tiêu chuẩn và điều kiện sau đây:</p>
            <p>
                a) Có đủ năng lực hành vi dân sự và không thuộc đối tượng không được quản lý doanh nghiệp theo quy định
                tại khoản 2 Điều 18 của Luật Doanh nghiệp số 59/2020/QH14 ngày 17/06/2020.
            </p>
            <p>
                b) Có trình độ chuyên môn, kinh nghiệm trong quản trị kinh doanh của công ty, nếu Điều lệ công ty không
                có quy định khác.
            </p>
            <p>
                2. Giám đốc công ty điều hành hoạt động kinh doanh hằng ngày của công ty. Giám đốc chịu trách nhiệm
                trước pháp luật và Chủ tịch công ty về việc thực hiện quyền và nghĩa vụ của mình.
            </p>
            <p>Giám đốc công ty có các quyền và nghĩa vụ sau:</p>
            <p>a) Tổ chức thực hiện quyết định của Chủ tịch công ty;</p>
            <p>b) Quyết định các vấn đề liên quan đến hoạt động kinh doanh hằng ngày của công ty;</p>
            <p>c) Tổ chức thực hiện kế hoạch kinh doanh và phương án đầu tư của công ty;</p>
            <p>d) Ban hành quy chế quản lý nội bộ của công ty;</p>
            <p>
                đ) Bổ nhiệm, miễn nhiệm, bãi nhiệm người quản lý trong công ty, trừ các đối tượng thuộc thẩm quyền của
                Chủ tịch công ty;
            </p>
            <p>e) Ký kết hợp đồng nhân danh công ty, trừ trường hợp thuộc thẩm quyền của Chủ tịch công ty;</p>
            <p>f) Kiến nghị phương án cơ cấu tổ chức công ty;</p>
            <p>g) Trình báo cáo quyết toán tài chính hằng năm lên Chủ tịch công ty;</p>
            <p>h) Kiến nghị phương án sử dụng lợi nhuận hoặc xử lý lỗ trong kinh doanh;</p>
            <p>i) Tuyển dụng lao động;</p>
            <p>
                j) Quyền và nghĩa vụ khác được quy định tại Điều lệ công ty, hợp đồng lao động mà Giám đốc ký với Chủ
                tịch công ty.
            </p>
            <p className={styles.articleTitle}>Điều 13: Trách nhiệm của chủ tịch công ty, giám đốc</p>
            <p>
                1. Tuân thủ pháp luật, Điều lệ công ty, quyết định của chủ sở hữu công ty trong việc thực hiện các quyền
                và nghĩa vụ được giao.
            </p>
            <p>
                2. Thực hiện các quyền và nghĩa vụ được giao một cách trung thực, cẩn trọng, tốt nhất nhằm bảo đảm lợi
                ích hợp pháp tối đa của công ty và chủ sở hữu công ty.
            </p>
            <p>
                3. Trung thành với lợi ích của công ty và chủ sở hữu công ty; không sử dụng thông tin, bí quyết, cơ hội
                kinh doanh của công ty, lạm dụng địa vị, chức vụ và sử dụng tài sản của công ty để tư lợi hoặc phục vụ
                lợi ích của tổ chức, cá nhân khác.
            </p>
            <p>
                4. Thông báo kịp thời, đầy đủ và chính xác cho công ty về doanh nghiệp mà họ và người có liên quan của
                họ làm chủ sở hữu hoặc có cổ phần, phần vốn góp chi phối. Thông báo này được niêm yết tại trụ sở chính
                và chi nhánh của công ty.
            </p>
            <p>
                5. Quyền và nghĩa vụ khác theo quy định của Luật Doanh nghiệp số 59/2020/QH14 ngày 17/06/2020 và Điều lệ
                công ty.
            </p>
            <p className={styles.articleTitle}>Điều 14: Thể thức thông qua quyết định của công ty</p>
            <p>Quyết định của chủ sở hữu công ty được lập thành văn bản và có hiệu lực kể từ ngày được ký.</p>
            <p className={styles.articleTitle}>Điều 15: Bộ máy giúp việc</p>
            <p>
                1. Giúp việc Giám đốc có thể có 1 hoặc 2 phó giám đốc. Phó Giám đốc điều hành một hoặc một số lĩnh vực
                hoạt động của Công ty theo sự phân công của Giám đốc.
                <br />
                2. Kế toán trưởng Công ty giúp Giám đốc chỉ đạo tổ chức, thực hiện công tác kế toán, thống kê của Công
                ty. Quyền hạn và trách nhiệm của kế toán trưởng tuân theo quy định pháp luật.
            </p>
            <p className={styles.articleTitle}>
                Điều 16: Hợp đồng, giao dịch của công ty với những người có liên quan{" "}
            </p>
            <p>
                Hợp đồng, giao dịch giữa công ty với chủ sở hữu công ty hoặc người có liên quan của chủ sở hữu công ty
                phải được ghi chép lại và lưu giữ thành hồ sơ riêng của công ty.
            </p>
            <p className={styles.articleTitle}>Điều 17: Quản lý lao động</p>
            <p>
                1. Người lao động được tuyển dụng vào làm việc tại Công ty theo chế độ hợp đồng lao động, được hưởng các
                quyền và có các nghĩa vụ theo quy định của Bộ luật lao động của nước Cộng hòa xã hội Chủ nghĩa Việt Nam,
                Nội quy lao động và quy chế lương thưởng của Công ty.
                <br />
                2. Giám đốc Công ty là người quyết định tuyển dụng lao động, trên cơ sở người lao động có trình độ học
                vấn và trình độ chuyên môn phù hợp với công việc và theo quy chế do Chủ tịch Công ty ban hành.
            </p>
            <p className={styles.articleTitle}>Điều 18: Tổ chức đảng và tổ chức xã hội trong Công ty </p>
            <p>
                1. Tổ chức Đảng Cộng Sản Việt Nam trong Công ty là một bộ phận và chịu sự lãnh đạo của công ty, hoạt
                động theo hiến pháp, pháp luật của Nhà nước Cộng hòa xã hội Chủ nghĩa Việt Nam và Điều lệ Đảng Cộng Sản
                Việt Nam.
                <br />
                2. Tổ chức Công đoàn và các tổ chức chính trị xã hội khác của Công ty, hoạt động theo Hiến pháp, pháp
                luật của Nhà nước Cộng hòa xã hội Chủ nghĩa Việt Nam và điều lệ của các tổ chức đó.
            </p>
            <p className={styles.chapterTitle}>CHƯƠNG III. TÀI CHÍNH, KẾ TOÁN</p>
            <p className={styles.articleTitle}>Điều 19: Năm tài chính và báo cáo tài chính của Công ty </p>
            <p>
                1. Năm tài chính của Công ty bắt đầu từ ngày 01 tháng 01 và kết thúc vào cuối ngày 31 tháng 12 năm dương
                lịch. Riêng năm tài chính đầu tiên được tính từ ngày Công ty được cấp Giấy chứng nhận đăng ký doanh
                nghiệp và kết thúc vào cuối ngày 31 tháng 12 năm đó.
                <br />
                2. Công ty thực hiện hạch toán theo hệ thống tài khoản, chế độ chứng từ theo quy định của pháp luật về
                kế toán, thống kê và các hướng dẫn của Bộ Tài chính.
                <br />
                3. Việc thu chi tài chính của Công ty được thực hiện theo quy định của pháp luật.
                <br />
                4. Trong vòng 90 ngày kể từ khi kết thúc năm tài chính, Công ty nộp báo cáo tài chính theo quy định của
                pháp luật.
            </p>
            <p className={styles.articleTitle}>
                Điều 20: Thù lao, tiền lương và lợi ích khác của người quản lý Công ty{" "}
            </p>
            <p>
                1. Người quản lý công ty được hưởng thù lao hoặc tiền lương và lợi ích khác theo kết quả và hiệu quả
                kinh doanh của công ty.
                <br />
                2. Chủ sở hữu công ty quyết định mức thù lao, tiền lương và lợi ích khác của Chủ tịch công ty. Thù lao,
                tiền lương và lợi ích khác của người quản lý công ty được tính vào chi phí kinh doanh theo quy định của
                pháp luật về thuế, pháp luật có liên quan và được thể hiện thành mục riêng trong báo cáo tài chính hằng
                năm của công ty.
            </p>
            <p className={styles.articleTitle}>Điều 21: Phân phối lợi nhuận của công ty và xử lý lỗ trong kinh doanh</p>
            <p>
                21.1. Hằng năm, sau khi thực hiện nghĩa vụ tài chính với Nhà nước, công ty trích từ lợi nhuận sau thuế
                để lập các quỹ sau đây:
            </p>
            <p>- Quỹ dự trữ bổ sung vốn điều lệ: 5%</p>
            <p>- Quỹ phát triển sản xuất kinh doanh: 10%</p>
            <p>- Quỹ khen thưởng phúc lợi: 5%</p>
            <p>- Các quỹ khác theo quy định của pháp luật.</p>
            <p>
                21.2. Các quỹ khác sẽ do Chủ tịch Công ty quyết định tùy thuộc vào tình hình kinh doanh và phù hợp với
                các quy định của pháp luật.
            </p>
            <p>
                21.3. Chủ sở hữu Công ty chỉ được rút lợi nhuận của Công ty khi Công ty thanh toán đủ các khoản và các
                nghĩa vụ tài sản khác đến hạn phải trả trong trường hợp công ty bị lỗ trong kinh doanh.
            </p>
            <p>21.4. Xử lý lỗ trong kinh doanh</p>
            <p>
                Trường hợp nếu có hoạt động kinh doanh bị lỗ thì được bù trừ số lỗ vào thu nhập chịu thuế của các hoạt
                động kinh doanh có thu nhập. Phần thu nhập còn lại sau khi bù trừ áp dụng mức thuế suất thuế thu nhập
                doanh nghiệp của hoạt động kinh doanh còn thu nhập.
            </p>
            <p>- Nếu lãi thì chuyển lỗ, nếu lỗ thì không được chuyển lỗ từ kỳ trước sang.</p>
            <p>
                - Số lỗ được chuyển toàn bộ và liên tục vào thu nhập (thu nhập chịu thuế đã trừ thu nhập miễn thuế) của
                những năm tiếp theo.
            </p>
            <p>
                - Thời gian chuyển lỗ không quá 5 năm kể từ năm tiếp sau năm phát sinh lỗ, nếu số lỗ phát sinh chưa
                chuyển hết thì sẽ không được chuyển vào thu nhập của các năm tiếp sau.
            </p>
            <p className={styles.chapterTitle}>CHƯƠNG IV. TỐ TỤNG TRANH CHẤP, GIẢI THỂ, THANH LÝ, PHÁ SẢN</p>
            <p className={styles.articleTitle}>Điều 22: Tố tụng tranh chấp</p>
            <p>
                1. Tranh chấp nội bộ, Công ty có thể giải quyết trên phương thức tự thỏa thuận nội bộ, nếu không được sẽ
                thông qua cơ quan pháp luật có thẩm quyền.
            </p>
            <p>
                2. Tranh chấp bên ngoài, Công ty có quyền bình đẳng trước pháp luật với mọi pháp nhân, thể nhân khi có
                tố tụng tranh chấp. Đại diện hợp pháp của công ty sẽ đại diện cho công ty trước pháp luật.
            </p>
            <p className={styles.articleTitle}>Điều 23: Giải thể công ty</p>
            <p>Công ty giải thể trong các trường hợp sau:</p>
            <p>1. Theo quyết định của chủ sở hữu;</p>
            <p>2. Bị thu hồi Giấy chứng nhận đăng ký doanh nghiệp.</p>
            <p className={styles.articleTitle}>Điều 24: Thủ tục giải thể và thanh lý tài sản</p>
            <p>
                <strong>A. Thủ tục giải thế</strong>
            </p>
            <p>1. Chủ sở hữu Công ty thông qua quyết định giải thể với các nội dung chủ yếu:</p>
            <p>a) Tên, địa chỉ trụ sở chính của doanh nghiệp;</p>
            <p>b) Lý do giải thể;</p>
            <p>
                c) Thời hạn, thủ tục thanh lý hợp đồng và thanh toán các khoản nợ của doanh nghiệp; thời hạn thanh toán
                nợ, thanh lý hợp đồng không được vượt quá 06 tháng, kể từ ngày thông qua quyết định giải thể;
            </p>
            <p>d) Phương án xử lý các nghĩa vụ phát sinh từ hợp đồng lao động;</p>
            <p>đ) Họ, tên, chữ ký của chủ sở hữu.</p>
            <p>2. Chủ sở hữu công ty trực tiếp tổ chức thanh lý tài sản doanh nghiệp.</p>
            <p>
                3. Trong thời hạn 07 ngày làm việc kể từ ngày thông qua, quyết định giải thể phải được gửi đến Cơ quan
                đăng ký kinh doanh, cơ quan thuế, người lao động trong doanh nghiệp, đăng quyết định giải thể trên Cổng
                thông tin quốc gia về đăng ký doanh nghiệp và phải được niêm yết công khai tại trụ sở chính, chi nhánh,
                văn phòng đại diện của doanh nghiệp.
            </p>
            <p>
                Trường hợp còn nghĩa vụ tài chính chưa thanh toán thì phải gửi kèm theo quyết định giải thể phương án
                giải quyết nợ đến các chủ nợ, người có quyền, lợi và nghĩa vụ có liên quan. Thông báo phải có tên, địa
                chỉ của chủ nợ; số nợ, thời hạn, địa điểm và phương thức thanh toán số nợ đó; cách thức và thời hạn giải
                quyết khiếu nại của chủ nợ.
            </p>
            <p>4. Các khoản nợ được thanh toán theo thứ tự sau đây:</p>
            <p>
                a) Các khoản nợ lương, trợ cấp thôi việc, bảo hiểm xã hội theo quy định của pháp luật và các quyền lợi
                khác của người lao động theo thỏa ước lao động tập thể và hợp đồng lao động đã ký kết;
            </p>
            <p>b) Nợ thuế;</p>
            <p>c) Các khoản nợ khác.</p>
            <p>
                5. Sau khi đã thanh toán hết các khoản nợ và chi phí giải thể doanh nghiệp, phần còn lại thuộc về chủ sở
                hữu công ty.
            </p>
            <p>
                6. Người đại diện gửi đề nghị giải thể cho Cơ quan đăng ký kinh doanh trong 05 ngày làm việc kể từ ngày
                thanh toán hết các khoản nợ.
            </p>
            <p>
                7. Trường hợp công ty bị thu hồi giấy chứng nhận đăng ký kinh doanh, việc giải thể theo trình tự, thủ
                tục sau đây:
            </p>
            <p>
                a) Trong thời hạn 10 ngày, kể từ ngày nhận được quyết định thu hồi Giấy chứng nhận đăng ký doanh nghiệp
                hoặc quyết định của Tòa án có hiệu lực, công ty phải triệu tập họp để quyết định giải thể. Quyết định
                giải thể và bản sao quyết định thu hồi Giấy chứng nhận đăng ký doanh nghiệp hoặc quyết định của Tòa án
                có hiệu lực phải được gửi đến Cơ quan đăng ký kinh doanh, cơ quan thuế, người lao động trong doanh
                nghiệp và phải được niêm yết công khai tại trụ sở chính và chi nhánh của doanh nghiệp. Đối với trường
                hợp mà pháp luật yêu cầu phải đăng báo thì quyết định giải thể doanh nghiệp phải được đăng ít nhất trên
                một tờ báo viết hoặc báo điện tử trong ba số liên tiếp.
            </p>
            <p>
                b) Trường hợp công ty còn nghĩa vụ tài chính chưa thanh toán thì phải đồng thời gửi kèm theo quyết định
                giải thể của doanh nghiệp phương án giải quyết nợ đến các chủ nợ, người có quyền lợi và nghĩa vụ có liên
                quan. Thông báo phải có tên, địa chỉ của chủ nợ; số nợ, thời hạn, địa điểm và phương thức thanh toán số
                nợ đó; cách thức và thời hạn giải quyết khiếu nại của chủ nợ.
            </p>
            <p>c) Việc thanh toán các khoản nợ của doanh nghiệp được thực hiện theo thứ tự:</p>
            <p>
                - Các khoản nợ lương, trợ cấp thôi việc, bảo hiểm xã hội theo quy định của pháp luật và các quyền lợi
                khác của người lao động theo thỏa ước lao động tập thể và hợp đồng lao động đã ký kết;
            </p>
            <p>- Nợ thuế;</p>
            <p>- Các khoản nợ khác.</p>
            <p>
                d) Người đại diện của doanh nghiệp gửi đề nghị giải thể cho Cơ quan đăng ký kinh doanh trong 05 ngày làm
                việc, kể từ ngày thanh toán hết các khoản nợ của doanh nghiệp.
            </p>
            <p>
                <strong>B. Thủ tục thanh lý tài sản</strong>
            </p>
            <p>
                <em>Bước 1: Kiểm kê, đánh giá tài sản cần thanh lý</em>
            </p>
            <p>- Xác định rõ tài sản cần thanh lý: tên, mã tài sản, nguyên giá, giá trị còn lại,...</p>
            <p>- Lập biên bản kiểm kê tài sản.</p>
            <p>- Xác định lý do thanh lý: hư hỏng, không sử dụng, công nghệ lạc hậu,...</p>
            <p>
                <em>Bước 2: Lập hội đồng thanh lý tài sản</em>
            </p>
            <p>
                - Do Giám đốc ký quyết định thành lập hội đồng thanh lý (gồm các thành viên: đại diện ban giám đốc, kế
                toán, kỹ thuật, thủ kho,...)
            </p>
            <p>- Hội đồng tổ chức kiểm tra thực tế và lập biên bản đề xuất thanh lý.</p>
            <p>
                <em>Bước 3: Quyết định thanh lý tài sản</em>
            </p>
            <p>- Căn cứ biên bản của Chủ sở hữu đưa ra quyết định thanh lý tài sản.</p>
            <p>
                <em>Bước 4: Tổ chức thanh lý</em>
            </p>
            <p>- Bán đấu giá công khai hoặc chỉ định (nếu không có nhu cầu đấu giá).</p>
            <p>- Lập hợp đồng mua bán thanh lý (nếu bán cho bên ngoài).</p>
            <p>- Xuất hóa đơn, thu tiền nếu có phát sinh doanh thu.</p>
            <p>
                <em>Bước 5: Lưu hồ sơ</em>
            </p>
            <p>Hồ sơ thanh lý gồm:</p>
            <p>- Biên bản kiểm kê</p>
            <p>- Quyết định thành lập hội đồng thanh lý</p>
            <p>- Biên bản họp hội đồng thanh lý</p>
            <p>- Quyết định thanh lý</p>
            <p>- Hợp đồng bán (nếu có)</p>
            <p>- Hóa đơn GTGT (nếu có)</p>
            <p>- Biên bản giao nhận</p>
            <p>- Phiếu xuất kho</p>
            <p>- Chứng từ kế toán</p>
            <p className={styles.articleTitle}>Điều 25: Phá sản</p>
            <p>Việc phá sản Công ty được thực hiện theo thủ tục của pháp luật về phá sản.</p>
            <p className={styles.chapterTitle}>CHƯƠNG V. TỔ CHỨC THỰC HIỆN</p>
            <p className={styles.articleTitle}>Điều 26: Đối tượng áp dụng</p>
            <p>
                Điều lệ này được áp dụng cho {companyNamePrefix}{" "}
                {dataJson.tenCongTyVN?.toUpperCase() || ".............................."}. Mọi nhân viên trong công ty
                có trách nhiệm thi hành nghiêm chỉnh điều lệ này.
            </p>
            <p className={styles.articleTitle}>Điều 27: Sửa đổi, bổ sung</p>
            <p>Điều lệ này có thể được sửa đổi, bổ sung theo quyết định của chủ sở hữu công ty. </p>
            <p className={styles.articleTitle}>Điều 28: Hiệu lực </p>
            <p>
                Điều lệ này gồm 05 (năm) chương, 28 (hai tám) điều và đã được công ty thông qua ngày{" "}
                {dataJson.ngayThongQua ? formatDate(dataJson.ngayThongQua) : "....................."}. Điều lệ này có
                hiệu lực kể từ ngày được Chủ sở hữu công ty thông qua.
            </p>
            <table className={`${styles.signatureTable} signature-even-table no-border`}>
                <tbody>
                    <tr>
                        <td className={styles.signatureCell} style={{ border: "none", textAlign: "center" }}>
                            <p className={styles.bold} style={{ textAlign: "center" }}>
                                CHỦ SỞ HỮU
                            </p>
                            <p className={styles.signatureName} style={{ textAlign: "center" }}>
                                <em>(Ký, ghi rõ họ tên)</em>
                            </p>
                        </td>
                        <td className={styles.signatureCell} style={{ border: "none", textAlign: "center" }}>
                            <p className={styles.bold} style={{ textAlign: "center" }}>
                                NGƯỜI ĐẠI DIỆN THEO PHÁP LUẬT CỦA CÔNG TY
                            </p>
                            <p className={styles.signatureName} style={{ textAlign: "center" }}>
                                <em>(Ký, ghi rõ họ tên)</em>
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
