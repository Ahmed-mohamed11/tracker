import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import "./App.scss";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Error404Modern from "./pages/error/404-modern";

import { AdminPages } from "./route/Index";
import { useI18nContext } from "./context/i18n-context";

function App() {
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("isDarkMode") === "true" || false
  );
  const [isSidebarOpen, setSidebarOpen] = useState(true);

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

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleWindowResize = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    handleWindowResize();

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <div
      className={`${isDarkMode ? "dark" : "light"}`}
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      <Routes>
        <Route
          path="/*"
          element={
            <div className="flex">
              <div
                className={`w-full md:w-3/12 lg:w-2/12 sm:relative sm:top-0 
            fixed top-16 h-screen bg-gray-100 duration-300 ease-linear z-40 ${isSidebarOpen ? "left-0" : "sm:hidden -left-full"
                  }`}
              >
                <Sidebar
                  isSidebarOpen={isSidebarOpen}
                  closeSidebar={toggleSidebar}
                  dark={isDarkMode}
                />
              </div>
              <div
                className={`${isSidebarOpen
                  ? "w-full sm:w-9/12 md:w-9/12 lg:w-10/12"
                  : "w-full"
                  } dark:bg-gray-900 bg-white overflow-x-hidden`}
              >
                <div
                  className="h-screen w-full items-center
                  justify-center bg-cover bg-no-repeat"
                >
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
                          <Navbar
                            toggleDark={toggleDarkMode}
                            dark={isDarkMode}
                            toggleSidebar={toggleSidebar}
                            isSidebarOpen={isSidebarOpen}
                          />
                          <div className="pt-0 px-4">
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
          }
        />
      </Routes>
    </div>
  );
}

export default App;
