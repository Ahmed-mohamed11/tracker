import React from 'react'

export default function ToggleButton({ titel, label, isChecked, handleToggle }) {
    return (
        <div className="flex items-center gap-2">

            <div className="flex items-center justify-start ">
                <label className="inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        value=""
                        className="sr-only peer"
                        checked={isChecked}
                        onChange={handleToggle}
                    />
                    <div className="relative w-11 h-6 bg-gray-200 rounded-full peer   dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                        {titel}
                    </span>
                </label>
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
        </div>
    )
}