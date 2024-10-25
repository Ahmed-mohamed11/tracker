import React from 'react'
import ApexCharts from 'apexcharts'
import Chart1 from "../../components/Chart-1"
import Chart2 from "../../components/Chart-2"
import Chart3 from "../../components/Chart-3"
import Chart4 from "../../components/Chart-4"
import FormSelect from '../../components/form/FormSelect'
import { Clock, Plane, UserRoundX } from 'lucide-react'

export default function Dashboard() {
    return (
        <div className='mx-10'>
            <h2 className='text-2xl font-bold text-gray-800 py-5'>لوحه الاداء</h2>
            <div className='items-end grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
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
                    <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear' htmlFor="date">تاريخ</label>
                    <input
                        className="bg-gray-50 border border-gray-300 w-full text-gray-900 px-4 py-2 rounded-md transition duration-200 "
                        type="date" id="date" name="date" />
                </div>


                <div className='flex flex-col'>
                    <label className='block mb-2 text-sm font-medium text-gray-900 dark:text-white outline-none focus:border-gray-600 dark:focus:border-gray-100 duration-100 ease-linear' htmlFor="date">تاريخ</label>
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

                <div className='my-5 p-5 border-2 border-gray-300 rounded-md'>
                    <div className='mt-5 flex justify-between bg-themeColor-200 p-4'>
                        <div className='flex items-center gap-2'>
                            <span><Plane size={25} /></span>
                            ألمغادرات اليوميه </div>
                        <div>0 ايام</div>
                    </div>
                    <div className='mt-5 flex justify-between bg-themeColor-200 p-4'>
                        <div className='flex items-center gap-2'>
                            <span><Clock size={25} /></span>
                            ألمغادرات الساعيه</div>
                        <div>0 ساعات</div>
                    </div>
                    <div className='mt-5 flex justify-between bg-themeColor-200 p-4'>
                        <div className='flex items-center gap-2'>
                            <span><UserRoundX size={25} /></span>
                            الغياب </div>
                        <div>2 ايام</div>
                    </div>


                </div>

            </div>
        </div>
    )
}
