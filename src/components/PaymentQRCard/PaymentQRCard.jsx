import React, { useState, useImperativeHandle, forwardRef } from "react";
import styles from "@/pages/User/ScanQR/ScanQR.module.css";
import Tooltip from "@/components/Tooltip/Tooltip";
import SuccessPayment from "@/components/SuccessPayment/SuccessPayment";
import FailurePayment from "@/components/FailurePayment/FailurePayment";

const formatPrice = (price) => new Intl.NumberFormat("vi-VN").format(price || 0);

const PaymentQRCard = forwardRef(function PaymentQRCard(
    { amount, code, timeLeft, onCheckTransaction, onPaymentSuccess, txDetails },
    ref,
) {
    const [showPopup, setShowPopup] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [checking, setChecking] = useState(false);

    const stk = "0989466992";
    // const stk = "0345798572";

    useImperativeHandle(ref, () => ({
        triggerSuccess() {
            setIsSuccess(true);
            setShowPopup(true);
        },
        triggerFailure() {
            setIsSuccess(false);
            setShowPopup(true);
        },
    }));

    const minutes = Math.floor((timeLeft || 0) / 60);
    const seconds = (timeLeft || 0) % 60;
    const qrUrl = `https://qr.sepay.vn/img?acc=${stk}&bank=MBBank&amount=${amount}&des=${code}&template=compact`;

    const handleCheck = async () => {
        if (!onCheckTransaction || checking) return;
        setChecking(true);
        try {
            const success = await onCheckTransaction();
            setIsSuccess(!!success);
            setShowPopup(true);
        } catch {
            setIsSuccess(false);
            setShowPopup(true);
        } finally {
            setChecking(false);
        }
    };

    return (
        <>
            <div className={styles["payment-container-qr"]}>
                {/* LEFT: payment info */}
                <div className={styles["payment-info-container"]}>
                    <h3>Thông tin thanh toán</h3>
                    <table className={styles["order-info"]}>
                        <tbody>
                            <tr className={styles["info-item-qr-page"]}>
                                <td>Nhà cung cấp</td>
                                <td>LE THI LAN</td>
                            </tr>
                            <tr className={styles["info-item-qr-page"]}>
                                <td>Số điện thoại</td>
                                <td>
                                    <Tooltip text="Nhấn để sao chép" copyValue={stk}>
                                        {stk}
                                    </Tooltip>
                                </td>
                            </tr>
                            <tr className={styles["info-item-qr-page"]}>
                                <td>Ngân hàng</td>
                                <td>MB Bank</td>
                            </tr>
                            <tr className={styles["info-item-qr-page"]}>
                                <td>Nội dung</td>
                                <td>
                                    <Tooltip text="Nhấn để sao chép" copyValue={code}>
                                        {code}
                                    </Tooltip>
                                </td>
                            </tr>
                            <tr className={styles.amount}>
                                <td>Số tiền</td>
                                <td>{formatPrice(amount)}đ</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="2">
                                    <div className={styles["countdown"]}>
                                        <p>Đơn hàng sẽ hết hạn sau:</p>
                                        <div className={styles["timer"]}>
                                            <div className={styles["time-box"]}>
                                                <span className={styles["time-value"]}>
                                                    {minutes.toString().padStart(2, "0")}
                                                </span>
                                                <span className={styles["time-label"]}>Phút</span>
                                            </div>
                                            <div className={styles["time-box"]}>
                                                <span className={styles["time-value"]}>
                                                    {seconds.toString().padStart(2, "00")}
                                                </span>
                                                <span className={styles["time-label"]}>Giây</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* RIGHT: QR */}
                <div className={styles["qr-section"]}>
                    <h3>Quét mã QR thanh toán trực tiếp</h3>
                    <div className={styles["qr-box"]}>
                        <img src={qrUrl} alt="QR Code" />
                        <p>Lê Thị Lan - {stk}</p>
                    </div>
                    <p className={styles["qr-note"]}>Mở ứng dụng ngân hàng để Quét Mã QR</p>
                    <button className={styles["check-transaction-btn"]} onClick={handleCheck} disabled={checking}>
                        {checking ? "Đang kiểm tra..." : "Kiểm tra giao dịch"}
                    </button>
                </div>
            </div>

            {/* Popups */}
            {showPopup && isSuccess && (
                <SuccessPayment
                    txDetails={txDetails}
                    onClose={() => {
                        setShowPopup(false);
                        if (onPaymentSuccess) onPaymentSuccess();
                    }}
                />
            )}
            {showPopup && !isSuccess && <FailurePayment onClose={() => setShowPopup(false)} />}
        </>
    );
});

export default PaymentQRCard;
