import { useEffect, useState, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";

 import Login from "./pages/auth/login/Login";
  import { useI18nContext } from "./context/i18n-context";
 
const secretKey = "s3cr3t$Key@123!";

const decryptFromSessionStorage = (key) => {
  const encryptedValue = sessionStorage.getItem(key);
  if (encryptedValue) {
    const decryptedValue = CryptoJS.AES.decrypt(encryptedValue, secretKey).toString(CryptoJS.enc.Utf8);
    return decryptedValue;
  }
  return null;
};

function App() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("isDarkMode") === "true" || false
  );
  const [isLoginPage, setIsLoginPage] = useState(false); // New state for toggling login page
  const { language } = useI18nContext();

  const token = decryptFromSessionStorage("token");

   useEffect(() => {
    if (!token) {
      sessionStorage.clear();
      navigate(`${import.meta.env.VITE_PUBLIC_URL}/login`);
    }
  }, [navigate, token]);

  const handleLogin = useCallback(() => {
    setIsLoginPage(true); // Change to login page on successful login
  }, []);

  const handleLogout = useCallback(() => {
    sessionStorage.clear();
    localStorage.removeItem("id");
    setIsLoginPage(false); // Switch back  to before-login page
    navigate(`${import.meta.env.VITE_PUBLIC_URL}/login`);
  }, [navigate]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("isDarkMode", !isDarkMode);
  };

  return (
    <div className={`${isDarkMode ? "dark" : "light"}`} dir={language === "ar" ? "rtl" : "ltr"}>
      {isLoginPage ? (
        // Render Login page
        <Routes>
          <Route
            path={`${import.meta.env.VITE_PUBLIC_URL}/login`}
            element={
              <>
                <div className="bg-gray-100 space-y-9 overflow-x-hidden">
                  {loading && (
                    <div className="flex justify-center items-center gap-14 h-screen w-full fixed z-50 dark:bg-gray-900 bg-white">
                      <div className="dot-spin"></div>
                      <p className="text-lg font-medium dark:text-white">Loading... Please wait</p>
                    </div>
                  )}
                  <Login navigate={navigate} loading={setLoading} onLogIn={handleLogin} />
                </div>
              </>
            }
          />
        </Routes>
      ) : (
        // Render BeforeLogin page
        <div>sd</div> // Pass function to switch to login
      )}
    </div>
  );
}

export default App;
