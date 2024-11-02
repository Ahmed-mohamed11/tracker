import { useEffect, useState } from "react";
import { X, ChevronDown, ChevronRight } from "lucide-react";
import Cookies from 'js-cookie';
import axios from 'axios';


export default function AddEmployeeForm({ handleClose, handleAddEmployee }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [expandedGroups, setExpandedGroups] = useState([]);
    const [branchesList, setBranchesList] = useState([]);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(''); // Error state
    const toggleDropdown = () => setIsOpen(!isOpen);
    const toggleGroup = (groupName) => {
        setExpandedGroups((prev) =>
            prev.includes(groupName)
                ? prev.filter((name) => name !== groupName)
                : [...prev, groupName]
        );
    };
    const handleItemClick = (itemId, groupName) => {
        setSelectedItems((prev) => {
            if (itemId === 'تحديد الكل') {
                const group = options.find((g) => g.name === groupName);
                const allSelected = group.items.every((i) => prev.includes(i.id));
                return allSelected
                    ? prev.filter((i) => !group.items.map(item => item.id).includes(i))
                    : [...new Set([...prev, ...group.items.map(item => item.id)])];
            } else {
                return prev.includes(itemId)
                    ? prev.filter((i) => i !== itemId)
                    : [...prev, itemId];
            }
        });
    };
    const isGroupSelected = (groupName) => {
        const group = options.find((g) => g.name === groupName);
        return group.items.every((item) => selectedItems.includes(item.id));
    };
    const isAllSelected = () => {
        const allItems = options.flatMap((group) => group.items.map(item => item.id));
        return allItems.every((item) => selectedItems.includes(item));
    };

    const handleSelectAll = () => {
        if (isAllSelected()) {
            setSelectedItems([]);
        } else {
            const allItems = options.flatMap((group) => group.items.map(item => item.id));
            setSelectedItems(allItems);
        }
    };
    const fetchBranches = async () => {
        try {
            const token = Cookies.get('token');
            if (!token) {
                console.error('لم يتم العثور على الرمز في الكوكيز');
                return;
            }

            const response = await axios.get('https://bio.skyrsys.com/api/working-hours/branchs-list/', {
                headers: { 'Authorization': `Token ${token}` },
            });

            setBranchesList(response.data);

            // إضافة سجل للتحقق من هيكل البيانات
            console.log("Fetched branches data:", response.data);

            const transformedOptions = response.data.map(branch => ({
                name: branch.branch_name,
                items: branch.entities.map(entity => ({
                    id: entity.id,
                    ar_name: entity.ar_name
                }))
            }));

            setOptions(transformedOptions);
        } catch (error) {
            console.error("Error fetching branches:", error);
        }
    };
    useEffect(() => {
        fetchBranches();
    }, []);

    const handleSave = () => {
        const selectedEmployeesIds = selectedItems.filter(Boolean); // تأكد من أن جميع القيم صالحة
        if (selectedEmployeesIds.length > 0) {
            handleAddEmployee(selectedEmployeesIds); // أرسل الـ idات فقط
            handleClose();
        } else {
            console.log("No employee IDs found.");
        }
    };



    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-2xl relative">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                    <X className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-semibold mb-6 text-center">أضف موظف</h2>
                {loading && <p>جارٍ التحميل...</p>} {/* Loading indicator */}
                {error && <p className="text-red-500">{error}</p>} {/* Error message */}
                <div className="w-80 font-sans">
                    <div className="relative mb-4">
                        <button
                            onClick={toggleDropdown}
                            className="flex items-center justify-between w-full px-4 py-2 text-right bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        >
                            <span className="text-gray-700 font-medium">
                                {selectedItems.length > 0
                                    ? `تم اختيار ${selectedItems.length} عنصر`
                                    : 'اختر العناصر'}
                            </span>
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                        </button>
                        {isOpen && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                                <div className="max-h-60 overflow-y-auto">
                                    <label className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition-colors duration-150">
                                        <input
                                            type="checkbox"
                                            checked={isAllSelected()}
                                            onChange={handleSelectAll}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <span className="mr-3 text-sm font-medium text-gray-700">تحديد الكل</span>
                                    </label>
                                    {options.map((group) => (
                                        <div key={group.name} className="border-b border-gray-200 last:border-b-0">
                                            <div
                                                className="flex items-center justify-between px-4 py-2 bg-gray-50 cursor-pointer transition-colors duration-150"
                                                onClick={() => toggleGroup(group.name)}
                                            >
                                                <span className="text-sm font-medium text-gray-700">{group.name}</span>
                                                <ChevronRight
                                                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expandedGroups.includes(group.name) ? 'transform rotate-90' : ''
                                                        }`}
                                                />
                                            </div>
                                            {expandedGroups.includes(group.name) && (
                                                <div className="pr-4 pb-2">
                                                    <label className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-150">
                                                        <input
                                                            type="checkbox"
                                                            checked={isGroupSelected(group.name)}
                                                            onChange={() => handleItemClick('تحديد الكل', group.name)}
                                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                        />
                                                        <span className="mr-3 text-sm font-medium text-gray-700">تحديد الكل</span>
                                                    </label>
                                                    {group.items.map((item) => (
                                                        <label key={item.id} className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-150">
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedItems.includes(item.id)}
                                                                onChange={() => handleItemClick(item.id, group.name)}
                                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                            />
                                                            <span className="mr-3 text-sm font-medium text-gray-700">{item.ar_name}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleSave}
                        className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                        حفظ
                    </button>
                </div>
            </div>
        </div>
    );
}
