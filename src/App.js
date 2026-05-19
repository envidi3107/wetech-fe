import React, { useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginForm from "./pages/User/LoginForm/LoginForm";
import RegisterForm from "./pages/User/RegisterForm/RegisterForm";
import ForgotPassword from "./pages/User/ForgotPassword/ForgotPassword";
import UpdatePassword from "./pages/User/UpdatePassword/UpdatePassword";
import Home from "./pages/User/Home/Home";
import ListCourses from "./pages/User/ListCourses/ListCourses";
import CourseFilter from "./pages/User/CourseFilter/CourseFilter";
import DetailCourse from "./pages/User/DetailCourse/DetailCourse";
import ListProcedures from "./pages/User/ListProcedures/ListProcedures";
import SearchProfile from "./pages/User/SearchProcedure/SearchProcedure";
import ProcedureFilter from "./pages/User/ProcedureFilter/ProcedureFilter";
import ContactUs from "./pages/User/ContactUs/ContactUs";
import Profile from "./pages/User/Profile/Profile";
import NotFoundPage from "./pages/User/NotFoundPage/NotFoundPage";
import FaqPage from "./pages/User/FaqPage/FaqPage";
import ProcessProcedure from "./pages/User/ProcessProcedure/ProcessProcedure";
import RegisterPayment from "./pages/User/RegisterPayment/RegisterPayment";
import ScanQR from "./pages/User/ScanQR/ScanQR";
import DashBoard from "./pages/Admin/DashBoard/DashBoard";
import ListCustomer from "./pages/Admin/ListCustomer/ListCustomer";
import Transactions from "./pages/Admin/Transactions/Transactions";
import ListCourse from "./pages/Admin/ListCourse/ListCourse";
import ListProcedure from "./pages/Admin/ListProcedure/ListProcedure";
import ProcedureManager from "./pages/Admin/ProcedureManager/ProcedureManager";
import CourseManager from "./pages/Admin/CourseManager/CourseManager";
import MyCourses from "./pages/User/MyCourses/MyCourses";
import ChangePassword from "./pages/User/ChangePassword/ChangePassword";
import CartPage from "./pages/User/CartPage/CartPage";
import ChatWidget from "./components/ChatWidget/ChatWidget";
import AdminApiLoading from "./components/AdminApiLoading/AdminApiLoading";
import { CartProvider } from "./context/CartContext";
import { NotificationProvider, NotificationContext } from "./context/NotificationContext";
import Notification from "./components/Notification/Notification";
import { setNotificationHelper } from "./utils/notificationHelper";

function AppContent() {
    const notificationContext = useContext(NotificationContext);
    const location = useLocation();
    const hideChatWidget = location.pathname.startsWith("/process-procedure");

    useEffect(() => {
        if (notificationContext) {
            setNotificationHelper(notificationContext);
        }
    }, [notificationContext]);

    const withAdminLoading = (element) => <AdminApiLoading>{element}</AdminApiLoading>;

    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/update-password" element={<UpdatePassword />} />
                <Route path="/list-courses" element={<ListCourses />} />
                <Route path="/my-courses" element={<MyCourses />} />
                <Route path="/course-filter/:category" element={<CourseFilter />} />
                <Route path="/course-filter" element={<CourseFilter />} />
                <Route path="/procedure-filter" element={<ProcedureFilter />} />
                <Route path="/detail-course/:courseId" element={<DetailCourse />} />
                <Route path="/list-procedures/:typeCompany" element={<ListProcedures />} />
                <Route path="/process-procedure/:id_procedure" element={<ProcessProcedure />} />
                <Route path="/procedure/search" element={<SearchProfile />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/not-found" element={<NotFoundPage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/register-payment/:idTransaction" element={<RegisterPayment />} />
                <Route path="/scan-qr/:idTransaction" element={<ScanQR />} />

                <Route path="/dashboard" element={withAdminLoading(<DashBoard />)} />
                <Route path="/list-customer" element={withAdminLoading(<ListCustomer />)} />
                <Route path="/sales" element={withAdminLoading(<Transactions />)} />
                <Route path="/list-course" element={withAdminLoading(<ListCourse />)} />
                <Route path="/list-procedure" element={withAdminLoading(<ListProcedure />)} />
                <Route path="/create-procedure" element={withAdminLoading(<ProcedureManager />)} />
                <Route path="/manage-procedure/:procedureId" element={withAdminLoading(<ProcedureManager />)} />
                <Route path="/manage-course/:courseId" element={withAdminLoading(<CourseManager />)} />
                <Route path="/cart" element={<CartPage />} />

                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Notification />
            <ChatWidget hidden={hideChatWidget} />
        </>
    );
}

function App() {
    return (
        <NotificationProvider>
            <AuthProvider>
                <CartProvider>
                    <Router>
                        <AppContent />
                    </Router>
                </CartProvider>
            </AuthProvider>
        </NotificationProvider>
    );
}

export default App;
