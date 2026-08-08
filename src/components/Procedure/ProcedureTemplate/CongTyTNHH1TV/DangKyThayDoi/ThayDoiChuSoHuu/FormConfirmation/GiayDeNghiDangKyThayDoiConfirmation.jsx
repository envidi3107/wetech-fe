import GiayDeNghiDangKyThayDoiConfirmationBase from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/FormConfirmation/GiayDeNghiDangKyThayDoiConfirmation";
import { A_CHANGE_OPTIONS } from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/dangKyThayDoi.constants";

const EXCLUDED_A_OPTION_NAMES = A_CHANGE_OPTIONS.filter((option) => option.name !== "a_doiChuSoHuuHuongLoi").map(
    (option) => option.name,
);

export default function GiayDeNghiDangKyThayDoiConfirmation(props) {
    return <GiayDeNghiDangKyThayDoiConfirmationBase {...props} excludedAOptionNames={EXCLUDED_A_OPTION_NAMES} />;
}
