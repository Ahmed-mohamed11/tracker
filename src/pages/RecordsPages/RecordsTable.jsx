import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import AddRecords from './AddRecords'; // استيراد المكون CreateStage
import PreviewRecords from './PreviewProjects'; // تأكد من صحة المسار
import { FaPlus } from "react-icons/fa"; // أيقونة الإضافة
import Table from '../../components/Table'; // تأكد من صحة المسار
import { t } from 'i18next'; // تأكد من إعداد i18n بشكل صحيح

const RecordsTable = ({ openCreate, refreshData }) => {
    const [modalType, setModalType] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [selectedVoiceId, setSelectedVoiceId] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            const token = Cookies.get('token');
            console.log("Retrieved Token:", token); // سجل التوكن
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            const response = await axios.get('https://bio.skyrsys.com/api/company/voices/', {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });

            const voices = response.data;

            if (voices.length > 0) {
                const headers = Object.keys(voices[0]);
                setTableHeaders(headers.map(header => ({ key: header, label: header })));

                setTableData(voices);
            } else {
                setTableHeaders([]);
                setTableData([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error.response?.data || error.message);
            if (error.response) {
                // تحقق من تفاصيل الخطأ المحددة
                if (error.response.status === 401) {
                    console.error('Unauthorized access: ', error.response.data.detail);
                } else if (error.response.status === 404) {
                    console.error('Resource not found');
                } else {
                    console.error('An error occurred');
                }
            }
        }
    }, []);

    const handleCloseForm = () => {
        setModalType(null);
    };

    useEffect(() => {
        fetchData();
    }, [fetchData, refreshData]);

    const addNewVoiceToTable = (newVoice) => {
        setTableData((prevData) => [...prevData, newVoice]);
    };

    const handleDelete = async (id) => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('No token found in cookies');
                return;
            }

            await axios.delete(`https://bio.skyrsys.com/api/company/voices/${id}/`, {
                headers: {
                    "Authorization": `Token ${token}`, // تأكد من إضافة التوكن هنا
                    "Content-Type": "application/json",
                },
            });

            setTableData((prevData) => prevData.filter(voice => voice.id !== id));
        } catch (error) {
            console.error('Error deleting voice:', error.response?.data || error.message);
        }
    };

    const handleEdit = (id) => {
        console.log(`Edit voice with id: ${id}`);
    };

    const handlePreview = (id) => {
        setSelectedVoiceId(id);
        setModalType('preview');
    };

    const handleCreate = () => {
        setModalType('create');
    };

    return (
        <div className="min-h-screen mt-5 font-sans" dir="rtl">
            <div className="lg:max-w-7xl w-full mx-auto">
                <div className=" flex items-center justify-between p-4 bg-themeColor-500  border-b">
                    <h2 className="text-2xl font-semibold text-white">الصوتيات</h2>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleCreate} // استدعاء الدالة عند الضغط
                            className="border-2 flex items-center justify-center p-2 rounded-full bg-themeColor-600 text-white hover:bg-themeColor-700 transition duration-200"
                        >
                            <FaPlus size={18} />
                        </button>
                    </div>
                </div>

                <div className="w-full flex items-center justify-between p-4 border-b"></div>

                <Table
                    data={tableData}
                    headers={tableHeaders}
                    openCreate={handleCreate}
                    openPreview={handlePreview}
                    openEdit={handleEdit}
                    onDelete={handleDelete}
                    addItemLabel="إضافة تسجيل صوتي"
                />

                {modalType === 'preview' && (
                    <PreviewRecords
                        closeModal={() => setModalType(null)}
                        voiceId={selectedVoiceId}
                    />
                )}
                {modalType === "create" && (
                    <AddRecords // استخدام CreateStage بدلاً من AddRecords
                        closeModal={handleCloseForm}
                        modal={modalType === "create"}
                        refreshData={fetchData} // استخدام fetchData لتحديث البيانات بعد الإضافة
                    />
                )}
            </div>
        </div>
    );
};

export default RecordsTable;
