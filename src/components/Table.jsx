// src/components/Table.jsx

import React from 'react';

const Table = ({ data, headers, openCreate, openPreview, openEdit, onDelete, addItemLabel }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {headers.map(header => (
              <th
                key={header.key}
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header.label}
              </th>
            ))}
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">إجراءات</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={item.id}>
              {headers.map(header => (
                <td key={header.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item[header.key]}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => openPreview(item.id)}
                  className="text-indigo-600 hover:text-indigo-900 mr-2"
                >
                  معاينة
                </button>
                <button
                  onClick={() => openEdit(item.id)}
                  className="text-yellow-600 hover:text-yellow-900 mr-2"
                >
                  تحرير
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
