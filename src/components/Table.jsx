'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const PaginationControls = ({ currentPage, totalPages, paginate }) => (
  <div className="flex justify-end items-center p-4 gap-4">
    <button
      onClick={() => paginate(currentPage - 1)}
      disabled={currentPage === 1}
      className="flex items-center gap-2 text-gray-500"
    >
      <CaretRight size={18} weight="bold" />

    </button>
    <div className="space-x-2 hidden md:block">
      {Array.from({ length: totalPages }, (_, i) => (

        <button
          key={i + 1}
          onClick={() => paginate(i + 1)}
          className={`px-4 py-2 gap-3 text-sm rounded-md ${i + 1 === currentPage ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}`}
        >
          {i + 1}
        </button>
      ))}
    </div>
    <button
      onClick={() => paginate(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="flex items-center gap-2 text-gray-500"
    >
      <CaretLeft size={18} weight="bold" />

    </button>
  </div>
);

const Table = ({ data, headers, actions, userImage }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // حساب إجمالي عدد الصفحات
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // تقطيع البيانات بناءً على الصفحة الحالية
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  const confirmDelete = useCallback((rowId) => {
    MySwal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('Deleted:', rowId); // حذف الصف
        MySwal.fire('Deleted!', 'Your item has been deleted.', 'success');
      }
    });
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-right border-collapse table-auto">
        <thead>
          <tr className="bg-gray-200">
            {headers.map(header => (
              <th
                key={header.key}
                className="p-4 border-b text-center px-6" // إضافة px-6 لضبط المسافات الثابتة
                style={{ whiteSpace: 'nowrap' }}
              >
                {header.label}
              </th>
            ))}
            {userImage &&
              <>
                <th className="p-4 border-b text-center px-6">الحاله</th>
                <th className="p-4 border-b text-center px-6">الصوره</th>
                <th className="p-4 border-b text-center px-6">الصوت</th>
              </>
            }
            {actions && <th className="p-4 border-b text-center px-6">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b">
                {headers.map(header => (
                  <td
                    key={header.key}
                    className="p-4 text-center px-6" // توسيط النصوص وإضافة التباعد الثابت
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {row[header.key]}
                  </td>
                ))}
                {userImage && (
                  <>
                    {userImage(row)}
                  </>
                )}
                {actions && (
                  <td className="p-4 text-center px-6">
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length + (actions ? 1 : 0)} className="p-4 text-center">No data available</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* تفعيل عناصر التحكم في الترقيم */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={setCurrentPage}
      />
    </div>
  );
};

export default Table;
