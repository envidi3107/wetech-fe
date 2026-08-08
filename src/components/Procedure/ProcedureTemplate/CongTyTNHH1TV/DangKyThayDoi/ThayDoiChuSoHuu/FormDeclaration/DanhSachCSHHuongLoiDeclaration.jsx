import { forwardRef } from "react";
import DanhSachCSHHuongLoiDeclarationBase from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/ThanhLapMoi/FormDeclaration/DanhSachCSHHuongLoiDeclaration";
import { normalizeDataJson } from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/dangKyThayDoi.constants";

const joinValues = (...values) => values.filter(Boolean).join(", ");

const DanhSachCSHHuongLoiDeclaration = forwardRef(function DanhSachCSHHuongLoiDeclaration(props, ref) {
    const hasData = props.dataJson !== null && props.dataJson !== undefined;
    const data = normalizeDataJson(props.dataJson);
    const shouldPrefillIndividualOwner =
        !data.cshHuongLoiList?.length && data.loaiChuSoHuu !== "to_chuc" && !!data.chuSoHuu_hoTen;
    const ownerLegalDocument = data.chuSoHuu_cccd
        ? data.chuSoHuu_cccd
        : joinValues(data.chuSoHuu_soHoChieu, data.chuSoHuu_ngayCapHoChieu, data.chuSoHuu_noiCapHoChieu);
    const adaptedData = shouldPrefillIndividualOwner
        ? {
              ...data,
              cshHuongLoiList: [
                  {
                      hoTen: data.chuSoHuu_hoTen,
                      ngaySinh: data.chuSoHuu_ngaySinh || "",
                      gioiTinh: data.chuSoHuu_gioiTinh || "",
                      giaTo: ownerLegalDocument,
                      diaChiLienLac: joinValues(
                          data.chuSoHuu_soNha,
                          data.chuSoHuu_xa,
                          data.chuSoHuu_tinh,
                          data.chuSoHuu_lienLac_quocGia,
                      ),
                      tyLeSoHuuVon: "100",
                      tyLeSoHuuBieuQuyet: "",
                      quyenChiPhoi: "",
                      ghiChu: "Chủ sở hữu công ty",
                  },
              ],
          }
        : data;

    return (
        <DanhSachCSHHuongLoiDeclarationBase {...props} ref={ref} dataJson={hasData ? adaptedData : props.dataJson} />
    );
});

export default DanhSachCSHHuongLoiDeclaration;
