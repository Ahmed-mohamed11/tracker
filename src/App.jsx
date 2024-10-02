import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import "./App.scss";

import Navbar from "./components/Navbar";
import Error404Modern from "./pages/error/404-modern";

import { AdminPages } from "./route/Index";
import { useI18nContext } from "./context/i18n-context";

function App() {
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("isDarkMode") === "true" || false
  );

  const { language } = useI18nContext();

  useEffect(() => {
    setLoading(true);
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 600);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("isDarkMode", !isDarkMode);
  };

  return (
    <div
      className={`${isDarkMode ? "dark" : "light"}`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <Navbar toggleDark={toggleDarkMode} dark={isDarkMode} />

      <div className="dark:bg-gray-900 bg-white overflow-x-hidden">
        <div className="h-screen w-full items-center justify-center bg-cover bg-no-repeat">
          <Routes>
            <Route
              path="/*"
              element={
                <>
                  {loading && (
                    <div className="flex justify-center items-center gap-14 h-screen w-full fixed z-50 dark:bg-gray-900 bg-white">
                      <div className="dot-spin"></div>
                      <p className="text-lg font-medium dark:text-white">
                        جاري التحميل ... كن صبورًا
                      </p>
                    </div>
                  )}
                  <div className="pt-4 px-4">
                    <Routes>
                      <Route
                        path="/*"
                        element={<AdminPages loading={setLoading} />}
                      />
                      <Route path="/*" element={<Error404Modern />} />
                    </Routes>
                  </div>
                </>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
