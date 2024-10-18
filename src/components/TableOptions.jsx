import { Fragment } from 'react';
import { Play } from 'lucide-react';

const TableUser = ({ row, onUserClick }) => {
    return (
        <Fragment>
            <td className="py-4">
                <div className="flex items-center bg-themeColor-200 px-2.5 py-0.5 rounded">
                    <div className="h-2.5 w-2.5 rounded-full bg-themeColor-500 me-2"></div>
                    مستكمل
                </div>
            </td>
            <td
                onClick={() => onUserClick(row)} // استدعاء الدالة عند الضغط على الصورة
                className="py-4 flex w-full items-center justify-center cursor-pointer"
            >
                <img
                    className="w-10 h-10 rounded-full text-center"
                    src={row.image || './default-image.jpg'}  // صورة المستخدم أو صورة افتراضية
                    alt={`${row.first_name} image`} // الاسم كبديل للوصف
                />
            </td>
            <td className="py-4">
                <Play className="mr-[30px] bg-blue-200 w-8 h-8 rounded-full p-2 text-blue-600 text-center" />
            </td>
        </Fragment>
    );
};

export default TableUser;
