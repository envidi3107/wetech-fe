import GiayDeNghiDangKyThayDoiConfirmationBase from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/FormConfirmation/GiayDeNghiDangKyThayDoiConfirmation";

const EXCLUDED_A_OPTION_NAMES = ["a_doiCoDong", "a_doiVonDauTuDNTN"];

export default function GiayDeNghiDangKyThayDoiConfirmation(props) {
    return <GiayDeNghiDangKyThayDoiConfirmationBase {...props} excludedAOptionNames={EXCLUDED_A_OPTION_NAMES} />;
}
