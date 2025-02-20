import { Eye, EyeClosed } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import FormEmail from "../../../../components/form/FormEmail";
import FormPassword from "../../../../components/form/FormPassword";

export default function FormLogin({
  buttonText,
  handlePasswordChange,
  handleEmailInput,
  handleSubmitLogin,
  formData,
  errors,
  showPass,
  handleShowPass
}) {
  return (
    <form className="bg-white shadow-xl rounded-xl px-6 py-8 space-y-6 max-w-md md:ml-auto w-full" onSubmit={handleSubmitLogin}>
      <h3 className="text-3xl font-extrabold mb-12">تسجيل الدخول</h3>

      <div>
        <FormEmail
          name="email"
          type="email"
          placeholder="Email"
          required
          label="البريد الالكتروني"
          // value={formData.email}
          value="admin@admin.com"
          onChange={handleEmailInput}
          error={errors.email}
        />
      </div>
      <div>
        <FormPassword
          name="password"
          type={showPass ? "text" : "password"}
          placeholder="كلمة المرور"
          required
          label="كلمة المرور"
          // value={formData.password}
          value="admin"
          onChange={handlePasswordChange}
          error={errors.password}
          handleShowPass={handleShowPass}
          showPass={showPass}
        />
      </div>
      <div className="text-sm text-right">
        <Link to="/forgot-password" className="text-blue-600 font-semibold hover:underline">
          نسيت كلمه المرور?
        </Link>
      </div>
      <div>
        <button type="submit" className="w-full shadow-xl py-3 px-6 text-sm font-semibold rounded-md text-white bg-gray-800 hover:bg-[#222] focus:outline-none">
          {buttonText}
        </button>
      </div>
    </form>
  );
}
