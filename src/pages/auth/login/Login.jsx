import { useEffect, useState } from "react";
import FormLogin from "./form/FormLogin";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ErrorAlert } from "../../../components/Alert";
import Cookies from "js-cookie"; // استيراد مكتبة js-cookie

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailInput = (e) => {
    setFormData({ ...formData, email: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setFormData({ ...formData, password: e.target.value });
  };

  const handleShowPass = () => {
    setShowPass(!showPass);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://bio.skyrsys.com/api/company/login/",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      console.log("Response Data:", response.data); // Check response structure

      const data = response.data?.data || response.data;

      if (!data || !data.token) {
        throw new Error("Invalid response structure");
      }

      const token = data.token;

      // Set the token in cookies for easy access
      Cookies.set("token", token, { expires: 7, path: "/" }); // Store the token with a 7-day expiration

      // Store additional values in localStorage
      localStorage.setItem("email", data.company.email);
      localStorage.setItem("is_admin", data.is_admin); // تأكد من أن is_admin موجود في البيانات المسترجعة
      localStorage.setItem("id", data.id);

      setLoading(false);

      // Redirect to dashboard
      navigate(`${import.meta.env.VITE_PUBLIC_URL}/`);
    } catch (error) {
      console.error("Login Error:", error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Error in login details, check email and password";
      setErrorMsg(message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get("token"); // Retrieve token from cookies
    if (token) {
      navigate(`${import.meta.env.VITE_PUBLIC_URL}/`); // Redirect if the user is already logged in
    }
  }, [navigate]);

  return (
    <div className="col-span-1 min-h-screen flex items-center justify-center lg:justify-between w-full mx-auto gap-x-10">
      {loading && (
        <div className="flex justify-center items-center gap-14 h-screen w-full fixed z-50 dark:bg-gray-900 bg-white">
          <div className="dot-spin"></div>
          <p className="text-lg font-medium dark:text-white">
            جاري التحميل ... كن صبورًا
          </p>
        </div>
      )}
      {errorMsg && (
        <ErrorAlert
          title={"Error"}
          text={errorMsg}
          closeClick={() => setErrorMsg("")}
        />
      )}
      <FormLogin
        buttonText="تسجيل الدخول"
        handlePasswordChange={handlePasswordChange}
        handleEmailInput={handleEmailInput}
        handleSubmitLogin={handleLogin}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        showPass={showPass}
        handleShowPass={handleShowPass}
      />
    </div>
  );
}
