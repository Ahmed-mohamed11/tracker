import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Chart1 from "../../components/Chart-1";
import Chart2 from "../../components/Chart-2";
import Chart3 from "../../components/Chart-3";
import Chart4 from "../../components/Chart-4";
import FormSelect from '../../components/form/FormSelect';

export default function Dashboard() {
    const [branches, setBranches] = useState([]);
    const [entities, setEntities] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedEntity, setSelectedEntity] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [lastLogin, setLastLogin] = useState('');
    const [currentPlan, setCurrentPlan] = useState('');
    const [executeDate, setExecuteDate] = useState('');
    const [finishDate, setFinishDate] = useState('');
    const [totalAttendancePercentage, setTotalAttendancePercentage] = useState(0);
    const [totalHoursOfAttendance, setTotalHoursOfAttendance] = useState(0);
    const [chartData, setChartData] = useState(null);
    const [id, setId] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const branchesResponse = await axios.get('https://bio.skyrsys.com/api/branch/branches/', {
                    headers: { 'Authorization': `Token ${Cookies.get('token')}` },
                });
                setBranches(branchesResponse.data);

                const entitiesResponse = await axios.get('https://bio.skyrsys.com/api/entity/', {
                    headers: { 'Authorization': `Token ${Cookies.get('token')}` },
                });
                setEntities(entitiesResponse.data);

                const employeesResponse = await axios.get('https://bio.skyrsys.com/api/employee/', {
                    headers: { 'Authorization': `Token ${Cookies.get('token')}` },
                });
                setEmployees(employeesResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleDataDisplay = () => {
        const params = new URLSearchParams({
            employee: selectedEmployee,
            branch: selectedBranch,
            entity: selectedEntity,
            start_date: startDate,
            end_date: endDate,
        });

        axios.get(`https://bio.skyrsys.com/api/dashboard/?${params.toString()}`, {
            headers: { 'Authorization': `Token ${Cookies.get('token')}` },
        })
            .then(response => {
                const { first_chart, section_employees, account_informations } = response.data;

                // Prepare Chart1 data
                const attendanceCounts = first_chart.attendance_absent_counts.map(entry => entry.count);
                const attendanceIntimeCounts = first_chart.attendance_intime_counts.map(entry => entry.count);
                const attendanceLateCounts = first_chart.attendance_late_counts.map(entry => entry.count);

                // Use the date from attendance_absent_counts for x-axis categories
                const dates = first_chart.attendance_absent_counts.map(entry => entry.date);

                // Update chartData with new structure
                setChartData({
                    first_chart: {
                        attendance_absent_counts: attendanceCounts.map((count, index) => ({
                            date: dates[index],
                            count: count,
                        })),
                        attendance_intime_counts: attendanceIntimeCounts,
                        attendance_late_counts: attendanceLateCounts,
                    },

                });

                console.log("chartData", chartData);

                // Update Chart3 and Chart4 data
                setTotalAttendancePercentage(section_employees.total_attendance_percentage);
                setTotalHoursOfAttendance(section_employees.total_hours_of_attendance);

                // Account information
                setId(account_informations.account_id);
                setExecuteDate(account_informations.start_date);
                setFinishDate(account_informations.end_date);
                setCurrentPlan(account_informations.current_plan);
                setLastLogin(account_informations.last_login);
            })
            .catch(error => {
                console.error('Error fetching data from API:', error);
            });
    };



    return (
        <div className='mx-10'>
            <h2 className='text-2xl font-bold text-gray-800 py-5'>لوحه الاداء</h2>
            <div className='items-end grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                <div>
                    <FormSelect
                        label="الفرع"
                        options={branches.map(branch => ({ label: branch.branch_name, value: branch.id }))}
                        onChange={e => setSelectedBranch(e.target.value)}
                    />
                </div>
                <div>
                    <FormSelect
                        label="الجهه"
                        options={entities.map(entity => ({ label: entity.ar_name, value: entity.id }))}
                        onChange={e => setSelectedEntity(e.target.value)}
                    />
                </div>
                <div>
                    <FormSelect
                        label="الموظف"
                        options={employees.map(employee => ({ label: employee.first_name, value: employee.id }))}
                        onChange={e => setSelectedEmployee(e.target.value)}
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="startDate" className='block mb-2 text-sm font-medium text-gray-900'>تاريخ البداية</label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        className="bg-gray-50 border border-gray-300 w-full text-gray-900 px-4 py-2 rounded-md"
                        onChange={e => setStartDate(e.target.value)}
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="endDate" className='block mb-2 text-sm font-medium text-gray-900'>تاريخ الانتهاء</label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        className="bg-gray-50 border border-gray-300 w-full text-gray-900 px-4 py-2 rounded-md"
                        onChange={e => setEndDate(e.target.value)}
                    />
                </div>
                <div>
                    <button
                        onClick={handleDataDisplay}
                        className="bg-themeColor-400 border border-gray-300 w-full text-white px-4 py-2 rounded-md"
                    >
                        عرض البيانات
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className='my-5 p-5 border-2 border-gray-300 rounded-md'>
                    <Chart1 chartData={chartData} />
                </div>
                <div className='my-5 p-5 border-2 border-gray-300 rounded-md'>
                    <Chart2 chartData={chartData} />
                </div>
                <div className='md:grid md:grid-cols-2 xl:grid-cols-2 lg:grid-cols-1 gap-4 my-5 p-5 border-2 border-gray-300 rounded-md'>
                    <Chart3
                        totalHoursOfAttendance={totalHoursOfAttendance}
                        totalAttendancePercentage={totalAttendancePercentage} />
                    <Chart4 totalHoursOfAttendance={totalHoursOfAttendance} />
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
                                        <div className="flex gap-2  w-1/2 ">
                                            <span className="font-medium text-gray-900">تاريخ التفعيل</span>
                                            <span className="text-gray-600">{executeDate}</span>
                                        </div>
                                        {/* Expiry Date */}
                                        <div className="flex gap-2 w-1/2">
                                            <span className="font-medium text-gray-900">تاريخ الانتهاء</span>
                                            <span className="text-gray-600">{finishDate}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between gap-12 items-center border-b pb-3">
                                        {/* Subscription Type */}
                                        <div className="flex gap-5 items-center">
                                            <span className="font-medium text-gray-900">نوع الاشتراك</span>
                                            <span className="text-gray-600"> {currentPlan}</span>
                                        </div>
                                        {/* Account Number */}
                                        <div className="flex gap-5 items-center ">
                                            <span className="font-medium text-gray-900">رقم الحساب</span>
                                            <span className="text-gray-600">{id}</span>
                                        </div>
                                    </div>
                                    {/* Last Login */}
                                    <div className="flex justify-center gap-5 items-center border-b pb-3">
                                        <span className="font-medium text-gray-900">آخر تسجيل دخول</span>
                                        <span className="text-gray-600">{lastLogin}</span>                                   </div>
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
    );
}
