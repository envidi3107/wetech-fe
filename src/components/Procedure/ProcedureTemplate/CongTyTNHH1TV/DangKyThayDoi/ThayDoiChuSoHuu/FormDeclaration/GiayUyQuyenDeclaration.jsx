import { forwardRef } from "react";
import GiayUyQuyenDeclarationBase from "@/components/Procedure/ProcedureTemplate/CongTyTNHH2TVTroLen/ThanhLapMoi/FormDeclaration/GiayUyQuyenDeclaration";
import { normalizeDataJson } from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/dangKyThayDoi.constants";
import { useAuth } from "@/context/AuthContext";

const firstValue = (...values) => values.find((value) => value !== undefined && value !== null && value !== "") || "";

const GiayUyQuyenDeclaration = forwardRef(function GiayUyQuyenDeclaration(props, ref) {
    const { user } = useAuth();
    const hasData = props.dataJson !== null && props.dataJson !== undefined;
    const data = normalizeDataJson(props.dataJson);
    const ownerRepresentative = data.daiDienChuSoHuuList?.[0] || {};
    const ownerRepresentativeIdentity = /^\d{9,12}$/.test(ownerRepresentative.giayToPhapLy || "")
        ? ownerRepresentative.giayToPhapLy
        : "";

    // Bên nhận uỷ quyền (Bên B) sẽ tự động điền theo thông tin tài khoản đăng nhập
    const hasRecipientData = Boolean(data.nhanUyQuyen_hoTen || data.nhanUyQuyen_cccd);
    const permanentAddress = user?.permanentAddress || {};
    const currentAddress = user?.currentAddress || {};
    const recipientPrefill = hasRecipientData
        ? {}
        : {
              nhanUyQuyen_hoTen: firstValue(user?.fullname, user?.fullName, user?.name).toUpperCase(),
              nhanUyQuyen_ngaySinh: firstValue(user?.dob, user?.dateOfBirth, user?.ngaySinh, user?.birthDate),
              nhanUyQuyen_gioiTinh: firstValue(user?.gender, user?.gioiTinh),
              nhanUyQuyen_cccd: firstValue(
                  user?.cccd,
                  user?.citizenId,
                  user?.identityNumber,
                  user?.idCard,
                  user?.soDinhDanh,
              ),
              nhanUyQuyen_phone: firstValue(user?.phone, user?.sdt, user?.phoneNumber),
              nhanUyQuyen_email: user?.email || "",
              nhanUyQuyen_danToc: firstValue(user?.ethnicity, user?.danToc, "Kinh"),
              nhanUyQuyen_quocTich: firstValue(user?.nationality, user?.quocTich, "Việt Nam"),
              nhanUyQuyen_thuongTru_tinh: firstValue(permanentAddress.province, user?.thuongTru_tinh),
              nhanUyQuyen_thuongTru_xa: firstValue(permanentAddress.ward, user?.thuongTru_xa),
              nhanUyQuyen_thuongTru_soNha: firstValue(permanentAddress.street, user?.thuongTru_soNha),
              nhanUyQuyen_lienLac_tinh: firstValue(currentAddress.province, user?.lienLac_tinh),
              nhanUyQuyen_lienLac_xa: firstValue(currentAddress.ward, user?.lienLac_xa),
              nhanUyQuyen_lienLac_soNha: firstValue(currentAddress.street, user?.lienLac_soNha),
          };
    const hasRecipientPrefill = Object.values(recipientPrefill).some(Boolean);
    const recipientPrefillKey = [
        "user",
        recipientPrefill.nhanUyQuyen_hoTen || data.nhanUyQuyen_hoTen,
        recipientPrefill.nhanUyQuyen_cccd || data.nhanUyQuyen_cccd,
        recipientPrefill.nhanUyQuyen_phone || data.nhanUyQuyen_phone,
        recipientPrefill.nhanUyQuyen_email || data.nhanUyQuyen_email,
    ].join("|");
    const adaptedData = {
        ...data,
        ...recipientPrefill,
        uyQuyen_hoTen: firstValue(
            data.uyQuyen_hoTen,
            data.chuSoHuu_hoTen,
            ownerRepresentative.hoTen,
            data.nguoiDaiDien_hoTen,
        ).toUpperCase(),
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
        chuHo_ten: firstValue(data.chuHo_ten, data.tenDoanhNghiep, data.tenCongTyVN).toUpperCase(),
    };

    return (
        <GiayUyQuyenDeclarationBase
            {...props}
            ref={ref}
            dataJson={hasData || hasRecipientPrefill ? adaptedData : props.dataJson}
            recipientPrefillKey={recipientPrefillKey}
            procedureActionText="đăng ký thay đổi chủ sở hữu công ty"
        />
    );
});

export default GiayUyQuyenDeclaration;
