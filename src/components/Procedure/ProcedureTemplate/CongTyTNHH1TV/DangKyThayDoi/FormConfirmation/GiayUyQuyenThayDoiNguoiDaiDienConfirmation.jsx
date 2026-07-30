import GiayUyQuyenConfirmationBase from "@/components/Procedure/ProcedureTemplate/CongTyTNHH2TVTroLen/ThanhLapMoi/FormConfirmation/GiayUyQuyenConfirmation";
import { normalizeDataJson } from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/dangKyThayDoi.constants";

export default function GiayUyQuyenThayDoiNguoiDaiDienConfirmation({ dataJson }) {
    if (!dataJson) return null;

    const data = normalizeDataJson(dataJson);
    const adaptedData = {
        ...data,
        chuHo_ten: data.chuHo_ten || data.tenDoanhNghiep || data.tenCongTyVN || "",
    };

    return (
        <GiayUyQuyenConfirmationBase
            dataJson={adaptedData}
            procedureActionText="đăng ký thay đổi người đại diện theo pháp luật"
        />
    );
}
