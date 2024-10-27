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

  // تحديث قيمة البريد الإلكتروني في حالة النموذج
  const handleEmailInput = (e) => {
    setFormData({ ...formData, email: e.target.value });
  };

  // تحديث قيمة كلمة المرور في حالة النموذج
  const handlePasswordChange = (e) => {
    setFormData({ ...formData, password: e.target.value });
  };

  // التحكم في عرض/إخفاء كلمة المرور
  const handleShowPass = () => {
    setShowPass(!showPass);
  };

  // التعامل مع عملية تسجيل الدخول
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
      // طلب تسجيل الدخول إلى API
      const response = await axios.post(
        "https://bio.skyrsys.com/api/company/login/",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      console.log("Response Data:", response.data);

      const data = response.data;

      if (!data || !data.token) {
        throw new Error("Invalid response structure");
      }

      const token = data.token;

      // حفظ الـ token في الكوكيز
      Cookies.set("token", token, { expires: 1 / 24, path: "/" });

      // حفظ بيانات المستخدم في localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: data.company.email,
          isAdmin: data.is_admin, // حالة الأدمن
          companyName: data.company.company_name, // اسم الشركة
          companyLogo: data.company.company_logo, // شعار الشركة
          companyCode: data.company.company_code, // كود الشركة
        })
      );

      setLoading(false);

      // توجيه المستخدم إلى لوحة التحكم
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

  // التحقق من وجود token لتحديد ما إذا كان المستخدم قد سجل الدخول بالفعل
  useEffect(() => {
    const token = Cookies.get("token"); // استرجاع token من الكوكيز
    if (token) {
      navigate(`${import.meta.env.VITE_PUBLIC_URL}/`); // توجيه إذا كان المستخدم مسجلاً الدخول
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
