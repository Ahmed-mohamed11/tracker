'use client';
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { CaretLeft, CaretRight, Eye, Plus, MagnifyingGlass, Trash } from '@phosphor-icons/react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { BiEdit } from 'react-icons/bi';

const MySwal = withReactContent(Swal);

const PaginationControls = ({ currentPage, totalPages, paginate }) => (
  <div className="flex justify-end items-center p-4 gap-4">
    <button
      onClick={() => paginate(currentPage - 1)}
      disabled={currentPage === 1}
      className="flex items-center gap-2 text-gray-500"
    >
      <CaretLeft size={18} weight="bold" />
    </button>
    <div className="space-x-2 hidden md:block">
      {Array.from({ length: Math.min(6, totalPages) }, (_, i) => {
        const page = Math.floor((currentPage - 1) / 6) * 6 + i + 1;
        return (
          page <= totalPages && (
            <button
              key={page}
              onClick={() => paginate(page)}
              className={`px-4 py-2 text-sm rounded-md ${page === currentPage ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}`}
            >
              {page}
            </button>
          )
        );
      })}
    </div>
    <button
      onClick={() => paginate(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="flex items-center gap-2 text-gray-500"
    >
      <CaretRight size={18} weight="bold" />
    </button>
  </div>
);

const Table = ({ data, headers, openCreate, openPreview, openEdit, onDelete, addItemLabel }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(item =>
      headers.some(header =>
        String(item[header.key])
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, data, headers]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
        onDelete(rowId);
        MySwal.fire('Deleted!', 'Your item has been deleted.', 'success');
      }
    });
  }, [onDelete]);
  const handleOpenCreate = () => {
    console.log('Open Create button clicked');
    openCreate(); // Ensure this triggers the correct function
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center justify-between p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="border p-2 rounded-md"
          />
          <MagnifyingGlass size={20} className="absolute right-3 top-2 text-gray-500" />
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-green-500 text-white px-4 py-2 rounded-md"
        >
          <Plus size={20} className="inline mr-2" />
          {addItemLabel}
        </button>

      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            {headers.map(header => (
              <th key={header.key} className="p-4 border-b">{header.label}</th>
            ))}
            <th className="p-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b">
                {headers.map(header => (
                  <td key={header.key} className="p-4">{row[header.key]}</td>
                ))}
                <td className="p-4 flex items-center justify-center gap-2">
                  <button onClick={() => openPreview(row.id)} className="text-blue-500">
                    <Eye size={20} />
                  </button>
                  <button onClick={() => confirmDelete(row.id)} className="text-gray-500">
                    <Trash size={20} />
                  </button>
                  <button onClick={() => openEdit(row.id)} className="text-gray-500">
                    <BiEdit size={20} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length + 1} className="p-4 text-center">No data available</td>
            </tr>
          )}
        </tbody>
      </table>

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        paginate={setCurrentPage}
      />
    </div>
  );
};

export default Table;
