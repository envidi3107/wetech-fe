import React, { useState, useMemo } from 'react';
import styles from './NganhNgheModal.module.css';
import maNganhNgheData from '@/assets/maNganhNghe.json';

export default function NganhNgheModal({ isOpen, onClose, onSelect, options = maNganhNgheData }) {
    const [searchTerm, setSearchTerm] = useState("");
    const flattenedOptions = Array.isArray(options) ? options : maNganhNgheData;

    const filteredOptions = useMemo(() => {
        if (!searchTerm) return flattenedOptions;
        const lowerTerm = searchTerm.toLowerCase();
        return flattenedOptions.filter(
            (o) =>
                (o.title || "").toLowerCase().includes(lowerTerm) ||
                (o.maNganh && o.maNganh.toLowerCase().includes(lowerTerm))
        );
    }, [searchTerm, flattenedOptions]);

    const handleSelect = (opt) => {
        // Lấy mã cấp 4. Nếu dài hơn 4 ký tự thì cắt 4 ký tự đầu, ngắn hơn thì thêm số 0 ở đầu.
        let maCap4 = String(opt.maNganh);
        if (maCap4.length >= 4) {
            maCap4 = maCap4.substring(0, 4);
        } else {
            maCap4 = maCap4.padEnd(4, "0");
        }

        onSelect({
            ...opt,
            maNganh: maCap4
        });
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Tìm kiếm mã ngành</h3>
                    <button type="button" className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>
                <div className={styles.body}>
                    <input
                        type="search"
                        className={styles.searchInput}
                        placeholder="Nhập tên hoặc mã ngành để tìm kiếm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                    <div className={styles.tableContainer}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th style={{ width: '100px' }}>Mã ngành</th>
                                    <th>Tên ngành</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOptions.length > 0 ? (
                                    filteredOptions.map((opt, idx) => (
                                        <tr key={idx} onClick={() => handleSelect(opt)} className={styles.row}>
                                            <td className={styles.tdCenter}>{opt.maNganh}</td>
                                            <td>{opt.title}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={2} className={styles.empty}>Không tìm thấy kết quả</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
