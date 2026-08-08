import { forwardRef } from "react";
import GiayUyQuyenDeclarationBase from "@/components/Procedure/ProcedureTemplate/CongTyTNHH2TVTroLen/ThanhLapMoi/FormDeclaration/GiayUyQuyenDeclaration";
import { normalizeDataJson } from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/dangKyThayDoi.constants";

const firstValue = (...values) => values.find((value) => value !== undefined && value !== null && value !== "") || "";

const GiayUyQuyenDeclaration = forwardRef(function GiayUyQuyenDeclaration(props, ref) {
    const hasData = props.dataJson !== null && props.dataJson !== undefined;
    const data = normalizeDataJson(props.dataJson);
    const ownerRepresentative = data.daiDienChuSoHuuList?.[0] || {};
    const ownerRepresentativeIdentity = /^\d{9,12}$/.test(ownerRepresentative.giayToPhapLy || "")
        ? ownerRepresentative.giayToPhapLy
        : "";
    const adaptedData = {
        ...data,
        uyQuyen_hoTen: firstValue(
            data.uyQuyen_hoTen,
            data.chuSoHuu_hoTen,
            ownerRepresentative.hoTen,
            data.nguoiDaiDien_hoTen,
        ),
        uyQuyen_ngaySinh: firstValue(
            data.uyQuyen_ngaySinh,
            data.chuSoHuu_ngaySinh,
            ownerRepresentative.ngaySinh,
            data.nguoiDaiDien_ngaySinh,
        ),
        uyQuyen_gioiTinh: firstValue(
            data.uyQuyen_gioiTinh,
            data.chuSoHuu_gioiTinh,
            ownerRepresentative.gioiTinh,
            data.nguoiDaiDien_gioiTinh,
        ),
        uyQuyen_cccd: firstValue(
            data.uyQuyen_cccd,
            data.chuSoHuu_cccd,
            ownerRepresentativeIdentity,
            data.nguoiDaiDien_cccd,
        ),
        uyQuyen_phone: firstValue(data.uyQuyen_phone, data.chuSoHuu_phone, data.nguoiDaiDien_phone),
        uyQuyen_email: firstValue(data.uyQuyen_email, data.chuSoHuu_email, data.nguoiDaiDien_email),
        uyQuyen_tinh: firstValue(
            data.uyQuyen_tinh,
            data.chuSoHuu_lienLac_tinh,
            data.chuSoHuu_tinh,
            data.chuSoHuu_thuongTru_tinh,
            data.nguoiDaiDien_tinh,
        ),
        uyQuyen_xa: firstValue(
            data.uyQuyen_xa,
            data.chuSoHuu_lienLac_xa,
            data.chuSoHuu_xa,
            data.chuSoHuu_thuongTru_xa,
            data.nguoiDaiDien_xa,
        ),
        uyQuyen_soNha: firstValue(
            data.uyQuyen_soNha,
            data.chuSoHuu_lienLac_soNha,
            data.chuSoHuu_soNha,
            data.chuSoHuu_thuongTru_soNha,
            data.nguoiDaiDien_soNha,
        ),
        chuHo_ten: firstValue(data.chuHo_ten, data.tenDoanhNghiep, data.tenCongTyVN),
    };

    return (
        <GiayUyQuyenDeclarationBase
            {...props}
            ref={ref}
            dataJson={hasData ? adaptedData : props.dataJson}
            procedureActionText="đăng ký thay đổi chủ sở hữu công ty"
        />
    );
});

export default GiayUyQuyenDeclaration;
