 import Chart1 from "../../components/Chart-1"
import Chart2 from "../../components/Chart-2"
import Chart3 from "../../components/Chart-3"
import Chart4 from "../../components/Chart-4"
import FormSelect from '../../components/form/FormSelect'
 
export default function Dashboard() {
    return (
        <div className='mx-10'>
            <h2 className='text-2xl font-bold text-gray-800 py-5'>لوحه الاداء</h2>
            <div className='items-end grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                <div>
                    <FormSelect
                        label="الفرع"
                        options={[
                            { label: 'الفرع 1', value: '1' },
                            { label: 'الفرع 2', value: '2' },
                            { label: 'الفرع 3', value: '3' },
                        ]}
                    />
                </div>
                <div>
                    <FormSelect
                        label="الجهه"
                        options={[
                            { label: 'الجهه 1', value: '1' },
                            { label: 'الجهه 2', value: '2' },
                            { label: 'الجهه 3', value: '3' },
                        ]}
                    />
                </div>
                <div>
                    <FormSelect
                        label="الموظف"
                        options={[
                            { label: 'الجهه 1', value: '1' },
                            { label: 'الجهه 2', value: '2' },
                            { label: 'الجهه 3', value: '3' },
                        ]}
                    />
                </div>


                <div className='flex flex-col'>
                    <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear' htmlFor="date">تاريخ البداية</label>
                    <input
                        className="bg-gray-50 border border-gray-300 w-full text-gray-900 px-4 py-2 rounded-md transition duration-200 "
                        type="date" id="date" name="date" />
                </div>


                <div className='flex flex-col'>
                    <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear' htmlFor="date">تاريخ الانتهاء</label>
                    <input
                        className="bg-gray-50 border border-gray-300 w-full text-gray-900 px-4 py-2 rounded-md transition duration-200 "
                        type="date" id="date" name="date" />
                </div>

                <div>
                    <button
                        className="bg-themeColor-400 border border-gray-300 w-full text-white px-4 py-2 rounded-md transition duration-200 "
                    >عرض البيانات </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className='my-5 p-5 border-2 border-gray-300 rounded-md'>
                    <Chart1 />
                </div>

                <div className='my-5 p-5 border-2 border-gray-300 rounded-md'>
                    <Chart2 />
                </div>

                <div className='md:grid md:grid-cols-2 xl:grid-cols-2 lg:grid-cols-1 gap-4 my-5 p-5 border-2 border-gray-300 rounded-md'>
                    <Chart3 className="w-full" />
                    <Chart4 className="w-full" />
                </div>

                <div className=" py-4 px-4 sm:px-6 lg:px-8" dir="rtl">
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                                <h1 className="text-2xl font-bold text-white text-right">معلومات الحساب</h1>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Account Status Card */}
                                <div className="bg-blue-50 rounded-xl p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                        <span className="font-semibold text-blue-900">حساب نشط</span>
                                    </div>
                                </div>

                                {/* Account Details */}
                                <div className="space-y-4 ">
                                    {/* Activation Date */}
                                    <div className="flex justify-between gap-12 items-center border-b pb-3">
                                    <div className="flex gap-5 items-center w-1/2 ">
                                        <span className="font-medium text-gray-900">تاريخ التفعيل</span>
                                        <span className="text-gray-600">2023/06/15</span>
                                    </div>

                                    {/* Expiry Date */}
                                    <div className="flex gap-5 items-center">
                                        <span className="font-medium text-gray-900">تاريخ الانتهاء</span>
                                        <span className="text-gray-600">2024/06/15</span>
                                    </div>
                                    </div>
                                    <div className="flex justify-between gap-12 items-center border-b pb-3">

                                    {/* Subscription Type */}
                                    <div className="flex gap-5 items-center">
                                        <span className="font-medium text-gray-900">نوع الاشتراك</span>
                                        <span className="text-gray-600">الباقة الذهبية</span>
                                    </div>

                                    {/* Account Number */}
                                    <div className="flex gap-5 items-center ">
                                        <span className="font-medium text-gray-900">رقم الحساب</span>
                                        <span className="text-gray-600">AC-123456789</span>
                                    </div>
                                    </div>
                                    {/* Last Login */}
                                    <div className="flex justify-center gap-5 items-center border-b pb-3">
                                        <span className="font-medium text-gray-900">آخر تسجيل دخول</span>
                                        <span className="text-gray-600">2023/12/25 12:30 PM</span>
                                    </div>
                                </div>

                                {/* Usage Statistics */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 text-right">إحصائيات الاستخدام</h3>
                                    <div className="space-y-3">
                                        <div className="relative pt-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-semibold inline-block text-blue-600">
                                                    75%
                                                </span>
                                                <span className="text-xs font-semibold inline-block text-blue-600">
                                                    المساحة المستخدمة
                                                </span>
                                            </div>
                                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-100">
                                                <div className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 w-3/4 transition-all duration-500"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                            
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
