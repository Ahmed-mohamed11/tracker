import { useState, useEffect } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';
import { X } from "@phosphor-icons/react";
import FormSelect from "../../components/form/FormSelect";
import { toast } from "react-toastify";

const AddDepartures = ({ closeModal, modal, onDepartureAdd }) => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState("");

    // Fetch employee data on component mount
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const token = Cookies.get('token');
                const response = await axios.get('https://bio.skyrsys.com/api/employee/', {
                    headers: { 'Authorization': `Token ${token}` },
                });
                setEmployees(response.data);
            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        };

        fetchEmployees();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = Cookies.get('token');
            await axios.post('https://bio.skyrsys.com/api/activity/departures/',
                { employee_id: selectedEmployee },
                { headers: { 'Authorization': `Token ${token}` } }
            );

            toast.success('Employee departure added successfully.');
            onDepartureAdd(); // Optional callback if needed
            closeModal();
        } catch (error) {
            // Check if there's a response from the backend with error details
            if (error.response && error.response.data) {
                const errorMessage = error.response.data.detail || 'Error adding employee departure.';
                toast.error(errorMessage);
            } else {
                toast.error("Network error. Please try again.");
            }
            console.error("Error adding employee departure:", error);
        }
    };

    return (
        <div
            onClick={(e) => e.target === e.currentTarget && closeModal()}
            className={`createStudent ${modal ? "visible" : "invisible"} fixed inset-0 z-50 flex items-center justify-center`}
        >
            <div className="absolute inset-0 bg-black opacity-600 bg-opacity-50"></div>

            <div className="rounded-lg p-4 bg-white w-full max-w-md shadow-lg relative">
                <div className="flex items-center justify-between mb-4">
                    <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                        <X size={18} weight="bold" />
                    </button>
                    <h2 className="text-black text-lg font-semibold">إضافة المغادرة</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <FormSelect
                        label="اختيار الموظف"
                        value={selectedEmployee}
                        name="employee"
                        onChange={(e) => setSelectedEmployee(e.target.value)}
                        options={employees.map(employee => ({
                            label: `${employee.first_name} ${employee.last_name}`,
                            value: employee.id,
                        }))}
                    />

                    <div className="mt-4">
                        <button type="submit" className="w-full bg-themeColor-600 text-white py-2 rounded-md hover:bg-themeColor-700">
                            إضافة المغادرة
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDepartures;
