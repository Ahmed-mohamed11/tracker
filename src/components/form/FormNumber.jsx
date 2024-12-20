import React from "react";

function FormNumber({
  label,
  name,
  value,
  placeholder,
  required,
  onChange,
  min,
  lang
}) {
  
  return (
    <div>
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear"
      >
        {label}
      </label>
      <input
        type="number"
        name={name}
        id={name}
        value={value}
        className="bg-gray-50 border border-gray-300
              text-gray-900 text-sm rounded-md
              block w-full p-2.5 dark:bg-gray-700
              dark:border-gray-600 dark:placeholder-gray-400
              dark:text-white outline-none
              focus:border-orange-400 dark:focus:border-orange-400
              duration-100 ease-linear"
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        min={min}
        lang={lang}
      />
    </div>
  );
}

export default FormNumber;
