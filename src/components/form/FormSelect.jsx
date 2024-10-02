
import React from "react";
import { useI18nContext } from "../../context/i18n-context";

function FormSelect({ label, selectLabel, onChange, options, value, name }) {
  const { t } = useI18nContext();

  return (
    <div>
      <label
        htmlFor={selectLabel}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear"
      >
        {label}
      </label>

      <select
        onChange={onChange}
        id={selectLabel}
        name={name}
        className="bg-gray-50 border border-gray-300 w-full text-gray-900 px-4 py-2 rounded-md transition duration-200 "
        value={value}
      >
        <option value={""}>اختر</option>
        {Array.isArray(options) &&
          options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
      </select>
    </div>
  );
}

export default FormSelect;
