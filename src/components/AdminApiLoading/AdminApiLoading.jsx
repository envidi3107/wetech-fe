import React, { useLayoutEffect, useState } from "react";
import Overlay from "@/components/Loading/Overlay/Overlay";
import { authAxios, publicAxios } from "@/services/axios-instance";

const AdminApiLoading = ({ children }) => {
    const [pendingRequests, setPendingRequests] = useState(0);

    useLayoutEffect(() => {
        const startLoading = (config) => {
            setPendingRequests((count) => count + 1);
            return config;
        };

        const stopLoading = (value) => {
            setPendingRequests((count) => Math.max(count - 1, 0));
            return value;
        };

        const stopLoadingWithError = (error) => {
            setPendingRequests((count) => Math.max(count - 1, 0));
            return Promise.reject(error);
        };

        const authRequestInterceptor = authAxios.interceptors.request.use(startLoading, stopLoadingWithError);
        const authResponseInterceptor = authAxios.interceptors.response.use(stopLoading, stopLoadingWithError);
        const publicRequestInterceptor = publicAxios.interceptors.request.use(startLoading, stopLoadingWithError);
        const publicResponseInterceptor = publicAxios.interceptors.response.use(stopLoading, stopLoadingWithError);

        return () => {
            authAxios.interceptors.request.eject(authRequestInterceptor);
            authAxios.interceptors.response.eject(authResponseInterceptor);
            publicAxios.interceptors.request.eject(publicRequestInterceptor);
            publicAxios.interceptors.response.eject(publicResponseInterceptor);
        };
    }, []);

    return (
        <>
            {pendingRequests > 0 && <Overlay />}
            {children}
        </>
    );
};

export default AdminApiLoading;
