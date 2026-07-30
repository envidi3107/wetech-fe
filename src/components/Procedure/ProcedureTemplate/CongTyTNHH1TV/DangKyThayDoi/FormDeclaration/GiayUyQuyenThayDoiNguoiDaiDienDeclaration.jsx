import { forwardRef } from "react";
import GiayUyQuyenDeclarationBase from "@/components/Procedure/ProcedureTemplate/CongTyTNHH2TVTroLen/ThanhLapMoi/FormDeclaration/GiayUyQuyenDeclaration";
import { normalizeDataJson } from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/dangKyThayDoi.constants";
import { useAuth } from "@/context/AuthContext";

const firstValue = (...values) => values.find((value) => value !== undefined && value !== null && value !== "") || "";

const GiayUyQuyenThayDoiNguoiDaiDienDeclaration = forwardRef(
    function GiayUyQuyenThayDoiNguoiDaiDienDeclaration(props, ref) {
        const { user } = useAuth();
        const hasData = props.dataJson !== null && props.dataJson !== undefined;
        const data = normalizeDataJson(props.dataJson);
        const hasRecipientData = Boolean(data.nhanUyQuyen_hoTen || data.nhanUyQuyen_cccd);
        const hasAccountantData = Boolean(data.keToan_hoTen || data.keToan_cccd);
        const permanentAddress = user?.permanentAddress || {};
        const currentAddress = user?.currentAddress || {};
        const recipientSource = hasAccountantData
            ? {
                  hoTen: data.keToan_hoTen,
                  ngaySinh: data.keToan_ngaySinh,
                  gioiTinh: data.keToan_gioiTinh,
                  cccd: data.keToan_cccd,
                  phone: data.keToan_phone,
                  email: data.keToan_email,
                  danToc: data.keToan_danToc,
                  quocTich: data.keToan_quocTich || "Việt Nam",
                  thuongTruTinh: data.keToan_thuongTru_tinh,
                  thuongTruXa: data.keToan_thuongTru_xa,
                  thuongTruSoNha: data.keToan_thuongTru_soNha,
                  lienLacTinh: firstValue(data.keToan_lienLac_tinh, data.keToan_tinh),
                  lienLacXa: firstValue(data.keToan_lienLac_xa, data.keToan_xa),
                  lienLacSoNha: firstValue(data.keToan_lienLac_soNha, data.keToan_soNha),
              }
            : {
                  hoTen: firstValue(user?.fullname, user?.fullName, user?.name),
                  ngaySinh: firstValue(user?.dob, user?.dateOfBirth, user?.ngaySinh, user?.birthDate),
                  gioiTinh: firstValue(user?.gender, user?.gioiTinh),
                  cccd: firstValue(user?.cccd, user?.citizenId, user?.identityNumber, user?.idCard, user?.soDinhDanh),
                  phone: firstValue(user?.phone, user?.sdt, user?.phoneNumber),
                  email: user?.email || "",
                  danToc: firstValue(user?.ethnicity, user?.danToc),
                  quocTich: firstValue(user?.nationality, user?.quocTich, "Việt Nam"),
                  thuongTruTinh: firstValue(permanentAddress.province, user?.thuongTru_tinh),
                  thuongTruXa: firstValue(permanentAddress.ward, user?.thuongTru_xa),
                  thuongTruSoNha: firstValue(permanentAddress.street, user?.thuongTru_soNha),
                  lienLacTinh: firstValue(currentAddress.province, user?.lienLac_tinh),
                  lienLacXa: firstValue(currentAddress.ward, user?.lienLac_xa),
                  lienLacSoNha: firstValue(currentAddress.street, user?.lienLac_soNha),
              };
        const recipientPrefill = hasRecipientData
            ? {}
            : {
                  nhanUyQuyen_hoTen: data.nhanUyQuyen_hoTen || recipientSource.hoTen || "",
                  nhanUyQuyen_ngaySinh: data.nhanUyQuyen_ngaySinh || recipientSource.ngaySinh || "",
                  nhanUyQuyen_gioiTinh: data.nhanUyQuyen_gioiTinh || recipientSource.gioiTinh || "",
                  nhanUyQuyen_cccd: data.nhanUyQuyen_cccd || recipientSource.cccd || "",
                  nhanUyQuyen_phone: data.nhanUyQuyen_phone || recipientSource.phone || "",
                  nhanUyQuyen_email: data.nhanUyQuyen_email || recipientSource.email || "",
                  nhanUyQuyen_danToc: data.nhanUyQuyen_danToc || recipientSource.danToc || "Kinh",
                  nhanUyQuyen_quocTich: data.nhanUyQuyen_quocTich || recipientSource.quocTich || "Việt Nam",
                  nhanUyQuyen_thuongTru_tinh: data.nhanUyQuyen_thuongTru_tinh || recipientSource.thuongTruTinh || "",
                  nhanUyQuyen_thuongTru_xa: data.nhanUyQuyen_thuongTru_xa || recipientSource.thuongTruXa || "",
                  nhanUyQuyen_thuongTru_soNha: data.nhanUyQuyen_thuongTru_soNha || recipientSource.thuongTruSoNha || "",
                  nhanUyQuyen_lienLac_tinh: data.nhanUyQuyen_lienLac_tinh || recipientSource.lienLacTinh || "",
                  nhanUyQuyen_lienLac_xa: data.nhanUyQuyen_lienLac_xa || recipientSource.lienLacXa || "",
                  nhanUyQuyen_lienLac_soNha: data.nhanUyQuyen_lienLac_soNha || recipientSource.lienLacSoNha || "",
              };
        const adaptedData = {
            ...data,
            ...recipientPrefill,
            uyQuyen_hoTen: data.uyQuyen_hoTen || data.nguoiDaiDien_hoTen || data.giamDoc_hoTen || "",
            uyQuyen_ngaySinh: data.uyQuyen_ngaySinh || data.nguoiDaiDien_ngaySinh || data.giamDoc_ngaySinh || "",
            uyQuyen_gioiTinh: data.uyQuyen_gioiTinh || data.nguoiDaiDien_gioiTinh || data.giamDoc_gioiTinh || "",
            uyQuyen_cccd: data.uyQuyen_cccd || data.nguoiDaiDien_cccd || data.giamDoc_cccd || "",
            uyQuyen_phone: data.uyQuyen_phone || data.nguoiDaiDien_phone || data.giamDoc_phone || "",
            uyQuyen_email: data.uyQuyen_email || data.nguoiDaiDien_email || "",
            uyQuyen_tinh: data.uyQuyen_tinh || data.nguoiDaiDien_tinh || "",
            uyQuyen_xa: data.uyQuyen_xa || data.nguoiDaiDien_xa || "",
            uyQuyen_soNha: data.uyQuyen_soNha || data.nguoiDaiDien_soNha || "",
            chuHo_ten: data.chuHo_ten || data.tenDoanhNghiep || data.tenCongTyVN || "",
        };
        const hasRecipientPrefill = Object.values(recipientPrefill).some(Boolean);
        const recipientPrefillKey = [
            hasAccountantData ? "accountant" : "user",
            adaptedData.nhanUyQuyen_hoTen,
            adaptedData.nhanUyQuyen_cccd,
            adaptedData.nhanUyQuyen_phone,
            adaptedData.nhanUyQuyen_email,
        ].join("|");

        return (
            <GiayUyQuyenDeclarationBase
                {...props}
                ref={ref}
                dataJson={hasData || hasRecipientPrefill ? adaptedData : props.dataJson}
                recipientPrefillKey={recipientPrefillKey}
                procedureActionText="đăng ký thay đổi người đại diện theo pháp luật"
            />
        );
    },
);

export default GiayUyQuyenThayDoiNguoiDaiDienDeclaration;
