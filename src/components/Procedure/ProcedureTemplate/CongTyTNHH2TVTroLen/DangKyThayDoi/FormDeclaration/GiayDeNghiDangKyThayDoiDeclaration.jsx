import { forwardRef } from "react";
import GiayDeNghiDangKyThayDoiDeclarationBase from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/FormDeclaration/GiayDeNghiDangKyThayDoiDeclaration";

const EXCLUDED_A_OPTION_NAMES = ["a_doiCoDong"];

const GiayDeNghiDangKyThayDoiDeclaration = forwardRef(function GiayDeNghiDangKyThayDoiDeclaration(props, ref) {
    return (
        <GiayDeNghiDangKyThayDoiDeclarationBase
            {...props}
            ref={ref}
            excludedAOptionNames={EXCLUDED_A_OPTION_NAMES}
        />
    );
});

export default GiayDeNghiDangKyThayDoiDeclaration;
