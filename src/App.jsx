import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import "./App.css";
import "./App.scss";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Error404Modern from "./pages/error/404-modern";
import Layout from "./pages/auth/Layout"; // This includes the Login component
import { AdminPages } from "./route/Index";
import { useI18nContext } from "./context/i18n-context";

function App() {
  const [loading, setLoading] = useState(false);
  // const [isDarkMode, setIsDarkMode] = useState(
  //   localStorage.getItem("isDarkMode") === "true" || false
  // );

  const { language } = useI18nContext();
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // const toggleDarkMode = () => {
  //   setIsDarkMode(!isDarkMode);
  //   localStorage.setItem("isDarkMode", !isDarkMode);
  // };

  const [finishDate, setFinishDate] = useState("");
  const [subscriptionWarning, setSubscriptionWarning] = useState(false);

  useEffect(() => {
    if (finishDate) {
      const today = new Date();
      const endSubscriptionDate = new Date(finishDate);
      const differenceInDays =
        (endSubscriptionDate - today) / (1000 * 60 * 60 * 24);

      if (differenceInDays > 0 && differenceInDays <= 7) {
        setSubscriptionWarning(true);
      } else {
        setSubscriptionWarning(false);
      }
    }
  }, [finishDate]);

  // Determine if the current path is for authentication
  const hideNavbar =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register");

  return (
    <div className={`light`} dir={"rtl"}>
      {!hideNavbar && <Navbar subscriptionWarning={subscriptionWarning} />}

      <div className="dark:bg-gray-900 bg-white overflow-x-hidden">
        <div className="w-full items-center justify-center bg-cover bg-no-repeat">
          <Routes>
            {/* Authentication Routes */}
            <Route path="/login" element={<Layout />} />
            {/* Add more auth-related routes here if needed */}

            {/* Protected Admin Routes */}
            <Route
              path="/*"
              element={
                <AdminPages
                  setFinishDate={setFinishDate}
                  loading={setLoading}
                />
              }
            />

            {/* Fallback Route */}
            <Route path="*" element={<Error404Modern />} />
          </Routes>

          <Footer />

          {/* Global Loading Spinner */}
          {loading && (
            <div className="flex justify-center items-center gap-14 h-screen w-full fixed z-50 dark:bg-gray-900 bg-white">
              <div className="dot-spin"></div>
              <p className="text-lg font-medium dark:text-white">
                جاري التحميل ... كن صبورًا
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
