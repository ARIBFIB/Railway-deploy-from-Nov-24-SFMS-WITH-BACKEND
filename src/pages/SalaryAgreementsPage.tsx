import React, { useEffect, useState } from 'react';
import { Search, Plus, Copy, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { CreateSalaryAgreementModal } from '../components/CreateSalaryAgreementModal';
import { salaryAgreementsService } from '../services/salaryAgreementsService';

interface SalaryAgreement {
  id: string;
  name: string;
  staffType: string;
  agreementTemplate: string;
}

// Loaded from backend
const mockAgreements: SalaryAgreement[] = [];

export const SalaryAgreementsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [agreements, setAgreements] = useState<SalaryAgreement[]>(mockAgreements);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await salaryAgreementsService.list();
        if (!mounted) return;
        // Map API -> UI
        const mapped: SalaryAgreement[] = data.map(a => ({
          id: a.id,
          name: a.name,
          staffType: a.staff_type,
          agreementTemplate: a.agreement_template
        }));
        setAgreements(mapped);
      } catch (e) {
        console.error('Failed to load salary agreements', e);
        setAgreements([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filteredAgreements = agreements.filter(agreement =>
    agreement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agreement.staffType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agreement.agreementTemplate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAgreements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAgreements = filteredAgreements.slice(startIndex, endIndex);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCopyAgreement = () => {
    console.log('Copy agreement clicked');
  };

  const handleCreateNew = () => {
    setShowCreateModal(true);
  };

  const handleCreateModalClose = () => {
    setShowCreateModal(false);
  };

  const handleCreateModalSave = (agreementData: any) => {
    console.log('New salary agreement created:', agreementData);
    // Here you would typically add the new agreement to your data
    setShowCreateModal(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const PaginationControls = ({ position }: { position: 'top' | 'bottom' }) => (
    <div className={`flex items-center justify-between ${position === 'top' ? 'mb-4' : 'mt-4'}`}>
      <div></div>
      <div className="flex items-center space-x-2">
        <select
          value={itemsPerPage}
          onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
          className="px-2 py-1 border border-gray-300 rounded text-sm"
        >
          <option value={6}>6</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
        <span className="text-sm text-gray-600">of {filteredAgreements.length}</span>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            className="px-2 py-1 bg-green-600 text-white text-sm rounded"
          >
            {currentPage}
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-1 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase">Salary Agreements - List</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Name, personnel type, contract template"
              value={searchTerm}
              onChange={handleSearch}
              className="w-80"
            />
          </div>
          <Button
            onClick={handleCopyAgreement}
            className="bg-gray-700 hover:bg-gray-800 text-white font-medium flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy agreement
          </Button>
          <Button
            onClick={handleCreateNew}
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create new
          </Button>
        </div>
      </div>

      {/* Top Pagination Controls */}
      <PaginationControls position="top" />

      {/* Table Section */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  NAME
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  STAFF TYPE
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">
                  AGREEMENT TEMPLATE
                </th>
              </tr>
            </thead>
            <tbody>
              {currentAgreements.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-gray-500">
                    No agreements found
                  </td>
                </tr>
              ) : (
                currentAgreements.map((agreement) => (
                  <tr 
                    key={agreement.id} 
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {agreement.name}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {agreement.staffType}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">
                      {agreement.agreementTemplate}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Bottom Pagination Controls */}
      <PaginationControls position="bottom" />

      {/* Create Salary Agreement Modal */}
      <CreateSalaryAgreementModal
        isOpen={showCreateModal}
        onClose={handleCreateModalClose}
        onSave={handleCreateModalSave}
      />
    </div>
  );
};
