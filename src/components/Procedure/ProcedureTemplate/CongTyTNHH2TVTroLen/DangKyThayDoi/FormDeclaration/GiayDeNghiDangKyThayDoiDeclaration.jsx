import GiayDeNghiDangKyThayDoiDeclarationBase from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/FormDeclaration/GiayDeNghiDangKyThayDoiDeclaration";

const EXCLUDED_A_OPTION_NAMES = ["a_doiCoDong"];

export default function GiayDeNghiDangKyThayDoiDeclaration(props) {
    return (
        <GiayDeNghiDangKyThayDoiDeclarationBase
            {...props}
            excludedAOptionNames={EXCLUDED_A_OPTION_NAMES}
        />
    );
}
