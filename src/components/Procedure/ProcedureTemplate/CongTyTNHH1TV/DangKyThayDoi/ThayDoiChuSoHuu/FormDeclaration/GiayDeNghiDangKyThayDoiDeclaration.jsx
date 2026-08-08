import { forwardRef } from "react";
import GiayDeNghiDangKyThayDoiDeclarationBase from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/ThayDoiGiayChungNhanDoanhNghiep/FormDeclaration/GiayDeNghiDangKyThayDoiDeclaration";

const FIXED_MAIN_OPTION_VALUES = ["A"];
const FIXED_A_OPTION_NAMES = ["a_doiChuSoHuuHuongLoi"];

const GiayDeNghiDangKyThayDoiDeclaration = forwardRef(function GiayDeNghiDangKyThayDoiDeclaration(props, ref) {
    return (
        <GiayDeNghiDangKyThayDoiDeclarationBase
            {...props}
            ref={ref}
            fixedMainOptionValues={FIXED_MAIN_OPTION_VALUES}
            fixedAOptionNames={FIXED_A_OPTION_NAMES}
        />
    );
});

export default GiayDeNghiDangKyThayDoiDeclaration;
