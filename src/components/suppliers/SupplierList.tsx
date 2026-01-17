import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit3, Mail, Printer, ChevronLeft, ChevronRight } from 'lucide-react';
import SupplierForm from './SupplierForm';
import { supplierService, type Supplier } from '../../services/supplierService';

const SupplierList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSupplierId, setEditingSupplierId] = useState<string | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchSuppliers();
  }, []);
  
  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const data = await supplierService.getAll();
      setSuppliers(data);
      // Calculate total pages based on data (assuming 10 items per page)
      const pages = Math.ceil(data.length / 10) || 1;
      setTotalPages(pages);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      // Set a default page count if there's an error
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowClick = (supplierId: string) => {
    setEditingSupplierId(supplierId);
    setShowForm(true);
  };

  const handleCreateNew = () => {
    setEditingSupplierId(null);
    setShowForm(true);
  };

  const handleBackToList = () => {
    setShowForm(false);
    setEditingSupplierId(null);
    fetchSuppliers(); // Refresh the supplier list when returning from form
    setCurrentPage(1); // Go to first page to see newly added suppliers
  };

  return (
    <div className="w-full bg-white">
      {showForm ? (
        <SupplierForm 
          supplierId={editingSupplierId || undefined}
          onGoBackToList={handleBackToList}
        />
      ) : (
        <>
          {/* Top Header Bar */}
          <div className="h-[56px] flex items-center justify-between px-4 border-b border-[#E6E6E6]">
            <h1 className="text-[14px] font-semibold text-[#333333] tracking-[0.4px] uppercase">
              DIRECTORY - SUPPLIERS
            </h1>
            
            <div className="flex items-center">
              <div className="relative w-[340px] mr-3">
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                  <Search size={14} className="text-[#8C8C8C]" />
                </div>
                <input
                  type="text"
                  placeholder="Supplier number, Name, CIN/PIN, Bg/Pg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 text-[13px] font-normal text-[#9E9E9E] bg-white border border-[#D9D9D9] rounded-sm"
                />
              </div>
              <button className="text-[12px] font-normal text-[#007BFF] hover:underline mr-4">
                Extended search
              </button>
              <button 
                onClick={handleCreateNew}
                className="h-8 px-3.5 bg-[#FFC107] text-black text-[13px] font-semibold rounded-full flex items-center hover:bg-[#FFB300] transition-colors"
              >
                <Plus size={12} className="mr-1.5" />
                Create supplier
              </button>
            </div>
          </div>

          {/* Secondary Action Row */}
          <div className="h-10 flex items-center justify-end px-4 border-b border-[#EFEFEF] gap-6">
            <button className="flex items-center text-[12px] text-[#4F4F4F]">
              <Edit3 size={14} className="text-[#4F4F4F] mr-1.5" />
              Bulk
            </button>
            <button className="flex items-center text-[12px] text-[#4F4F4F]">
              <Mail size={14} className="text-[#4F4F4F] mr-1.5" />
              Invite suppliers to e-invoice
            </button>
            <button className="flex items-center text-[12px] text-[#4F4F4F]">
              <Printer size={14} className="text-[#4F4F4F] mr-1.5" />
              Print list
            </button>
          </div>

          {/* Filter Tabs Section */}
          <div className="px-4 py-3 flex gap-2">
            <button className="h-7 px-3 text-[12px] font-medium border border-[#D0D0D0] rounded text-[#333333] bg-white">
              All
            </button>
            <button className="h-7 px-3 text-[12px] font-medium border border-[#7A7A7A] rounded text-[#333333] bg-white">
              Active
            </button>
            <button className="h-7 px-3 text-[12px] font-medium border border-[#D0D0D0] rounded text-[#333333] bg-white">
              Inactive
            </button>
          </div>

          {/* Pagination (Top Right) */}
          <div className="flex justify-end px-4 py-2">
            <div className="flex items-center">
              <button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                className={`w-7 h-7 flex items-center justify-center text-[14px] ${currentPage === 1 ? 'text-[#7A7A7A]' : 'text-[#7A7A7A] hover:bg-gray-100'}`}
              >
                <ChevronLeft size={14} />
              </button>
              
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`w-7 h-7 flex items-center justify-center text-[12px] ${
                    currentPage === index + 1 
                      ? 'bg-[#0A8F3C] text-white' 
                      : 'text-[#7A7A7A] hover:bg-gray-100'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              
              <button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className={`w-7 h-7 flex items-center justify-center text-[14px] ${currentPage === totalPages ? 'text-[#7A7A7A]' : 'text-[#7A7A7A] hover:bg-gray-100'}`}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="mx-4 mb-4 border border-[#E0E0E0] rounded-[6px] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="h-9 bg-[#F5F5F5] border-b-[2px] border-[#BDBDBD]">
                  <th className="w-9 px-2 text-[12px] font-semibold text-[#333333] uppercase text-left">Checkbox</th>
                  <th className="w-20 px-2 text-[12px] font-semibold text-[#333333] uppercase text-left">ID</th>
                  <th className="w-40 px-2 text-[12px] font-semibold text-[#333333] uppercase text-left">Name</th>
                  <th className="w-24 px-2 text-[12px] font-semibold text-[#333333] uppercase text-left">CIN/PIN</th>
                  <th className="w-20 px-2 text-[12px] font-semibold text-[#333333] uppercase text-left">Address</th>
                  <th className="w-32 px-2 text-[12px] font-semibold text-[#333333] uppercase text-left">Phone</th>
                  <th className="w-48 px-2 text-[12px] font-semibold text-[#333333] uppercase text-left">E-mail</th>
                  <th className="w-24 px-2 text-[12px] font-semibold text-[#333333] uppercase text-left">Status</th>
                  <th className="w-32 px-2 text-[12px] font-semibold text-[#333333] uppercase text-left">Created</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr 
                    key={supplier.id} 
                    onClick={() => handleRowClick(supplier.id!)}
                    className="h-9 text-[12px] text-[#333333] bg-white border-b border-[#EEEEEE] hover:bg-[#F9F9F9] cursor-pointer"
                  >
                    <td className="px-2">
                      <input 
                        type="checkbox" 
                        onClick={(e) => e.stopPropagation()}
                        className="w-3.5 h-3.5 border border-[#9E9E9E] rounded-sm"
                      />
                    </td>
                    <td className="px-2">{supplier.id?.substring(0, 4)}</td>
                    <td className="px-2">{supplier.supplier_name}</td>
                    <td className="px-2">{supplier.corporate_personal_id}</td>
                    <td className="px-2">{supplier.address || ''}</td>
                    <td className="px-2">{supplier.phone || ''}</td>
                    <td className="px-2">{supplier.email || ''}</td>
                    <td className="px-2">{supplier.status || ''}</td>
                    <td className="px-2">{supplier.created_at?.substring(0, 10) || ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Action Bar */}
          <div className="h-[56px] flex items-center justify-between px-4 bg-white border-t border-[#E6E6E6]">
            <div className="flex items-center">
              <button className="h-8 px-4 bg-[#D6D6D6] text-white text-[12px] rounded-full disabled:opacity-50">
                Delete
              </button>
              <span className="ml-3 text-[12px] text-[#6F6F6F]">(0 selected)</span>
            </div>
            <div className="flex gap-2">
              <button className="h-8 px-4 bg-[#D6D6D6] text-white text-[12px] rounded-full">
                Deactivate
              </button>
              <button className="h-8 px-4 bg-[#9CCFB0] text-white text-[12px] rounded-full">
                Activate
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SupplierList;