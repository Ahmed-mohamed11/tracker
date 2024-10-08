import { Eye, Play, Trash } from 'lucide-react'
import { Fragment } from 'react'
import { BiEdit } from 'react-icons/bi'

const TableActions = () => {
    return (
        <div className="flex gap-2">
            <button onClick={() => openPreview && openPreview(row)} className="text-blue-500">
                <Eye size={20} />
            </button>
            <button onClick={() => console.log('Delete function')} className="text-gray-500">
                <Trash size={20} />
            </button>
            <button onClick={() => console.log('Edit function')} className="text-gray-500">
                <BiEdit size={20} />
            </button>
        </div>
    )
};

const TableUser = () => {
    return (
        <Fragment>
            <td className="py-4">
                <div className="flex items-center bg-themeColor-200 px-2.5 py-0.5 rounded">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>
                    مستكمل
                </div>
            </td>
            <td className="py-4 flex w-full items-center justify-center">
                <img className="w-10 h-10 rounded-full text-center" src="data:image/jpeg;base64,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" alt="Jese image" />
            </td>

            <td className="py-4">
                <Play className="mr-[30px] bg-blue-200 w-8 h-8 rounded-full p-2 text-blue-600  text-center" />
            </td>
        </Fragment >
    )
}

export { TableActions, TableUser };

