import GiayDeNghiDangKyThayDoiNguoiDaiDienPhapLuatConfirmationBase from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/FormConfirmation/GiayDeNghiDangKyThayDoiNguoiDaiDienPhapLuatConfirmation";
import {
    CO_PHAN_COMPANY_NAME_PREFIX_OPTIONS,
    DEFAULT_CO_PHAN_COMPANY_NAME_PREFIX,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/companyNamePrefix";

export default function GiayDeNghiDangKyThayDoiNguoiDaiDienPhapLuatConfirmation(props) {
    return (
        <GiayDeNghiDangKyThayDoiNguoiDaiDienPhapLuatConfirmationBase
            {...props}
            companyNamePrefixOptions={CO_PHAN_COMPANY_NAME_PREFIX_OPTIONS}
            defaultCompanyNamePrefix={DEFAULT_CO_PHAN_COMPANY_NAME_PREFIX}
        />
    );
}
