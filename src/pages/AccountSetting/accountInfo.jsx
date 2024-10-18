// import React from 'react'

export default function accountInfo() {
    return (
        <div className="p-4">
            <div className="flex flex-col md:flex-row gap-4">

                <div className="w-full md:w-2/4">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">اسم الحساب</label>
                        <input
                            type="text"
                            className="w-full border rounded-md px-3 py-2"
                            placeholder="project FL"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">رمز الحساب</label>
                        <input type="text" className="w-full border rounded-md px-3 py-2" placeholder="PFL" />
                    </div>
                </div>

                <div className="w-full md:w-2/4">
                    <div className="bg-gray-100 rounded-lg p-4 text-center">
                        <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
                        <div className="flex justify-center gap-5">
                            <button className="bg-themeColor-500 text-white px-4 py-2 rounded-lg mr-2">تحميل</button>
                            <button className="bg-red-500 text-white px-4 py-2 rounded-lg">حذف</button>
                        </div>
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-2">
                        الحد الأقصى لحجم الصورة: 2MB
                        <br />
                        الصيغ المسموحة: JPG, PNG, GIF
                    </p>
                </div>

            </div>


        </div>
    )
}
