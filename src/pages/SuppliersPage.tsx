import React from 'react';
import SupplierList from '../components/suppliers/SupplierList';

const SuppliersPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SupplierList />
    </div>
  );
};

export default SuppliersPage;
