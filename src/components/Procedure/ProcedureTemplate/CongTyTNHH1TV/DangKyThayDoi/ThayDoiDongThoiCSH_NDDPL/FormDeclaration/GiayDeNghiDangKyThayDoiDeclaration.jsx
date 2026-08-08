import { forwardRef, useMemo } from "react";
import GiayDeNghiDangKyThayDoiDeclarationBase from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/ThayDoiGiayChungNhanDoanhNghiep/FormDeclaration/GiayDeNghiDangKyThayDoiDeclaration";
import { normalizeDataJson } from "@/components/Procedure/ProcedureTemplate/CongTyTNHH1TV/DangKyThayDoi/dangKyThayDoi.constants";

const FIXED_A_OPTION_NAMES = ["a_doiThongTinThue", "a_doiChuSoHuuHuongLoi"];

const GiayDeNghiDangKyThayDoiDeclaration = forwardRef(function GiayDeNghiDangKyThayDoiDeclaration(props, ref) {
    const adaptedData = useMemo(() => {
        const data = normalizeDataJson(props.dataJson);
        return {
            ...data,
            cshHuongLoi_truongHopA: data.cshHuongLoi_truongHopA ?? "true",
        };
    }, [props.dataJson]);

    return (
        <GiayDeNghiDangKyThayDoiDeclarationBase
            {...props}
            ref={ref}
            dataJson={adaptedData}
            fixedMainOptionValues={["A"]}
            fixedAOptionNames={FIXED_A_OPTION_NAMES}
        />
    );
});

export default GiayDeNghiDangKyThayDoiDeclaration;
