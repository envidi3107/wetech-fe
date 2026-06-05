import { forwardRef } from "react";
import GiayDeNghiDangKyThayDoiNguoiDaiDienPhapLuatDeclarationBase from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/FormDeclaration/GiayDeNghiDangKyThayDoiNguoiDaiDienPhapLuatDeclaration";
import {
    CO_PHAN_COMPANY_NAME_PREFIX_OPTIONS,
    DEFAULT_CO_PHAN_COMPANY_NAME_PREFIX,
} from "@/components/Procedure/ProcedureTemplate/SharedFormComponents/FormSections/companyNamePrefix";

const GiayDeNghiDangKyThayDoiNguoiDaiDienPhapLuatDeclaration = forwardRef(
    function GiayDeNghiDangKyThayDoiNguoiDaiDienPhapLuatDeclaration(props, ref) {
        return (
            <GiayDeNghiDangKyThayDoiNguoiDaiDienPhapLuatDeclarationBase
                {...props}
                ref={ref}
                companyNamePrefixOptions={CO_PHAN_COMPANY_NAME_PREFIX_OPTIONS}
                defaultCompanyNamePrefix={DEFAULT_CO_PHAN_COMPANY_NAME_PREFIX}
            />
        );
    },
);

export default GiayDeNghiDangKyThayDoiNguoiDaiDienPhapLuatDeclaration;
