import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";
import FormSelect from "../../../../components/form/FormSelect";
import axios from 'axios';
import Cookies from 'js-cookie';

export default function ChangePlan({ requestData, closeModal, fetchData }) {
    const [requestDetails, setRequestDetails] = useState(requestData);
    const [isVisible, setIsVisible] = useState(false);
    const [formData, setFormData] = useState({
        company_id: 0,
        plan_id: 0,
    });
    const [plans, setPlans] = useState([]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: parseInt(value, 10),
        }));
    }, []);

    useEffect(() => {
        if (requestData) {
            setRequestDetails(requestData);
            setFormData(prevData => ({
                ...prevData,
                company_id: requestData.id,
                plan_id: requestData.current_plan_id
            }));
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [requestData]);

    const getPlans = useCallback(async () => {
        try {
            const response = await axios.get('https://bio.skyrsys.com/api/plan/plans/', {
                headers: {
                    'Authorization': `Token ${Cookies.get('token')}`,
                },
            });
            setPlans(response.data);
        } catch (error) {
            console.error('Error getting plans:', error.response?.data || error.message);
            setPlans([]);
        }
    }, []);

    useEffect(() => {
        getPlans();
    }, [getPlans]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.plan_id) {
            alert("يرجى اختيار خطة.");
            return;
        }

        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('لم يتم العثور على الرمز في الكوكيز');
                return;
            }

            const requestBody = {
                company_id: formData.company_id,
                plan_id: formData.plan_id
            };

            const response = await axios.patch('https://bio.skyrsys.com/api/superadmin/change-plan/', requestBody, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            console.log('تمت إضافة طلب التسجيل بنجاح:', response.data);

            // Fetch updated data
            await fetchData();

            // Close the modal after the data has been refreshed
            closeModal();

        } catch (error) {
            console.error('خطأ في إضافة طلب التسجيل:', error.response?.data || error.message);
        }
    };


    if (!requestDetails) return <div>Loading...</div>;

    return (
        <div className={`w-full fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className={`w-1/3 max-w-5xl p-10 pt-5 rounded-lg overflow-hidden bg-white shadow-lg transition-transform transform ${isVisible ? 'translate-y-0' : '-translate-y-full'} duration-300`}>
                <div className="p-2 mb-4 flex justify-between items-center">
                    <h2 className="text-gray-600 font-bold">تغيير الخطة</h2>
                    <X className="text-gray-600 cursor-pointer" onClick={closeModal} />
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="w-full">
                        <FormSelect
                            label="نوع الخطة"
                            name="plan_id"
                            options={plans.map(plan => ({
                                value: plan.id,
                                label: `${plan.type} - ${plan.name}`,
                            }))}
                            onChange={handleChange}
                            value={formData.plan_id}
                        />
                    </div>

                    <div className="mt-4 gap-4 p-4 flex justify-around items-center">
                        <button type="submit" className="w-1/2 bg-blue-500 text-white px-4 py-2 rounded">تأكيد</button>
                        <button type="button" className="w-1/2 bg-red-500 text-white px-4 py-2 rounded" onClick={closeModal}>رفض</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
