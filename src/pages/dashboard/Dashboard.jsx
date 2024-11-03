import React, { useEffect, useState } from 'react';
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

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await axios.get('https://bio.skyrsys.com/api/branch/branches/', {
                    headers: { 'Authorization': `Token ${Cookies.get('token')}` },
                });
                setBranches(response.data);
            } catch (error) {
                console.error('Error fetching branches:', error);
            }
        };

        const fetchEntities = async () => {
            try {
                const response = await axios.get('https://bio.skyrsys.com/api/entity/', {
                    headers: { 'Authorization': `Token ${Cookies.get('token')}` },
                });
                setEntities(response.data);
            } catch (error) {
                console.error('Error fetching entities:', error);
            }
        };

        const fetchEmployees = async () => {
            try {
                const response = await axios.get('https://bio.skyrsys.com/api/employee/', {
                    headers: { 'Authorization': `Token ${Cookies.get('token')}` },
                });
                setEmployees(response.data);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchBranches();
        fetchEntities();
        fetchEmployees();
    }, []);

    const handleDataDisplay = () => {
        // إنشاء المعلمات GET
        const params = new URLSearchParams({
            employee: selectedEmployee,
            branch: selectedBranch,
            entity: selectedEntity,
            start_date: startDate,
            end_date: endDate,
        });

        // رابط API مع المعلمات
        const url = `https://bio.skyrsys.com/api/dashboard/?${params.toString()}`;

        // تنفيذ الطلب GET
        axios.get(url, {
            headers: {
                'Authorization': `Token ${Cookies.get('token')}`,
            }
        })
            .then(response => {
                console.log('Response from API:', response.data);
                // التعامل مع البيانات المستلمة هنا
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
                        options={branches.map(branch => ({
                            label: branch.branch_name,
                            value: branch.id,
                        }))}
                        onChange={e => setSelectedBranch(e.target.value)}
                    />
                </div>
                <div>
                    <FormSelect
                        label="الجهه"
                        options={entities.map(entity => ({
                            label: entity.ar_name,
                            value: entity.id,
                        }))}
                        onChange={e => setSelectedEntity(e.target.value)}
                    />
                </div>
                <div>
                    <FormSelect
                        label="الموظف"
                        options={employees.map(employee => ({
                            label: employee.first_name,
                            value: employee.id,
                        }))}
                        onChange={e => setSelectedEmployee(e.target.value)}
                    />
                </div>
                <div className='flex flex-col'>
                    <label className='block mb-2 text-sm font-medium text-gray-900' htmlFor="startDate">تاريخ البداية</label>
                    <input
                        className="bg-gray-50 border border-gray-300 w-full text-gray-900 px-4 py-2 rounded-md"
                        type="date" id="startDate" name="startDate"
                        onChange={e => setStartDate(e.target.value)} // تحديث التاريخ
                    />
                </div>
                <div className='flex flex-col'>
                    <label className='block mb-2 text-sm font-medium text-gray-900' htmlFor="endDate">تاريخ الانتهاء</label>
                    <input
                        className="bg-gray-50 border border-gray-300 w-full text-gray-900 px-4 py-2 rounded-md"
                        type="date" id="endDate" name="endDate"
                        onChange={e => setEndDate(e.target.value)} // تحديث التاريخ
                    />
                </div>
                <div>
                    <button
                        className="bg-themeColor-400 border border-gray-300 w-full text-white px-4 py-2 rounded-md"
                        onClick={handleDataDisplay}
                    >
                        عرض البيانات
                    </button>
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
            </div>
        </div>
    );
}
