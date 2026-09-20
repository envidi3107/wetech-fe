import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

// PHẢI khớp với giá trị `top` của .dataJsonToolbar trong DeclarationForms.module.css.
const DOCK_TOP = 130;
const ROLL_DURATION_MS = 350;

/**
 * Hook dùng cho toolbar chứa nút "Tải lại dữ liệu" (.dataJsonToolbar).
 *
 * Cốt lõi việc "luôn hiển thị" được giao hoàn toàn cho CSS `position: sticky;
 * top: 130px;` (xem DeclarationForms.module.css) - trình duyệt tự đảm bảo
 * toolbar dính lại ngay dưới header cố định trong suốt phần còn lại của form,
 * không phụ thuộc vào bất kỳ tính toán JS nào nên luôn đáng tin cậy.
 *
 * Hook này chỉ theo dõi thêm một việc PHỤ (không ảnh hưởng tới việc hiển thị
 * ở trên nếu thất bại): biết thời điểm toolbar THỰC SỰ đã dính lại (isStuck)
 * để bật hiệu ứng "lăn" (trượt + xoay) và dồn nút sang góc phải.
 */
export default function useStickyReloadToolbar() {
    // Dùng callback ref (thay vì useRef) vì toolbar có thể mount TRỄ: form khai báo
    // render nhánh "Đang tải biểu mẫu..." trước khi `forms` về từ API, nên ở lần
    // mount đầu tiên phần tử toolbar chưa tồn tại. Với useRef + useEffect([]) thì
    // effect chỉ chạy đúng một lần lúc đó, thấy ref null rồi thoát và KHÔNG BAO GIỜ
    // gắn lại listener khi toolbar thật sự xuất hiện - hậu quả là isStuck luôn false
    // và hiệu ứng dồn nút sang phải không bao giờ chạy (form xác nhận không dính lỗi
    // này vì nó chỉ mount khi `forms` đã có sẵn). Lưu element vào state để effect
    // chạy lại đúng thời điểm nó vào/rời DOM.
    const [toolbarEl, setToolbarEl] = useState(null);
    const toolbarRef = useCallback((node) => {
        setToolbarEl(node);
    }, []);
    const buttonWrapRef = useRef(null);
    const [isStuck, setIsStuck] = useState(false);
    const preToggleLeftRef = useRef(null);

    useEffect(() => {
        if (!toolbarEl) return undefined;

        let rafId = null;

        const measure = () => {
            rafId = null;
            const rect = toolbarEl.getBoundingClientRect();
            const next = rect.top <= DOCK_TOP + 1;

            setIsStuck((prev) => {
                if (prev === next) return prev;
                // Ghi lại vị trí ngang của nút NGAY TRƯỚC khi trạng thái đổi, để
                // useLayoutEffect bên dưới biết phải "lăn" từ đâu tới đâu.
                if (buttonWrapRef.current) {
                    preToggleLeftRef.current = buttonWrapRef.current.getBoundingClientRect().left;
                }
                return next;
            });
        };

        const onScrollOrResize = () => {
            if (rafId) return;
            rafId = requestAnimationFrame(measure);
        };

        measure();
        window.addEventListener("scroll", onScrollOrResize, { passive: true });
        window.addEventListener("resize", onScrollOrResize);

        return () => {
            window.removeEventListener("scroll", onScrollOrResize);
            window.removeEventListener("resize", onScrollOrResize);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [toolbarEl]);

    // Kỹ thuật FLIP (First - Last - Invert - Play): ngay khi justify-content đổi,
    // trình duyệt đã "nhảy" nút sang vị trí mới trong cùng 1 frame (thuộc tính này
    // không animate được). Ta đo lệch giữa vị trí cũ và vị trí mới, dùng transform
    // để nút TRÔNG như vẫn ở chỗ cũ, rồi cho transition chạy transform về 0 → mắt
    // thấy nút trượt mượt đúng hướng (trái ⇄ phải) thay vì giật ngược.
    useLayoutEffect(() => {
        const el = buttonWrapRef.current;
        const beforeLeft = preToggleLeftRef.current;
        preToggleLeftRef.current = null;
        if (!el || beforeLeft === null) return;

        const afterLeft = el.getBoundingClientRect().left;
        const deltaX = beforeLeft - afterLeft;
        if (Math.abs(deltaX) < 1) return;

        const spin = deltaX < 0 ? -360 : 360; // lăn sang phải → xoay thuận chiều kim đồng hồ, ngược lại thì xoay lùi

        el.style.transition = "none";
        el.style.transform = `translateX(${deltaX}px) rotate(${spin}deg)`;
        // Ép trình duyệt áp dụng transform ở trên ngay lập tức trước khi bật transition
        void el.offsetHeight;

        requestAnimationFrame(() => {
            el.style.transition = `transform ${ROLL_DURATION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;
            el.style.transform = "translateX(0) rotate(0deg)";
        });
    }, [isStuck]);

    return { toolbarRef, buttonWrapRef, isStuck };
}
