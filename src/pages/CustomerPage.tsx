import React, { useState } from 'react';
import { CustomerList } from '../components/customer';
import { CustomerForm } from '../components/customer';

const CustomerPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);

  const handleCreateCustomer = () => {
    setEditingCustomer(null);
    setShowForm(true);
  };

  const handleEditCustomer = (customer: any) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleSaveCustomer = (customerData: any) => {
    // Here you would typically save the customer data
    console.log('Saving customer:', customerData);
    setShowForm(false);
    setEditingCustomer(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  if (showForm) {
    return (
      <div className="bg-[#F7F7F7] min-h-screen">
        <div className="max-w-[1320px] mx-auto px-6 py-4">
          <CustomerForm 
            initialData={editingCustomer || undefined}
            onSave={handleSaveCustomer}
            onCancel={handleCancel}
          />
        </div>
      </div>
    );
  }

  return (
    <CustomerList 
      customers={[
        {
          id: '1',
          customerId: 'C001',
          name: 'ABC Company Ltd',
          orgPersonNumber: '123456-7890',
          postalCode: '12345',
          city: 'Stockholm',
          country: 'Sweden',
          phone: '+46 70 123 45 67',
          email: 'contact@abccompany.se',
          status: 'active'
        },
        {
          id: '2',
          customerId: 'C002',
          name: 'XYZ Industries AB',
          orgPersonNumber: '987654-3210',
          postalCode: '54321',
          city: 'Gothenburg',
          country: 'Sweden',
          phone: '+46 31 987 65 43',
          email: 'info@xyzindustries.se',
          status: 'active'
        },
        {
          id: '3',
          customerId: 'C003',
          name: 'John Doe Consulting',
          orgPersonNumber: '19850101-1234',
          postalCode: '23456',
          city: 'Malmö',
          country: 'Sweden',
          phone: '+46 40 112 23 44',
          email: 'john@johndoe.se',
          status: 'inactive'
        }
      ]}
      onCreateCustomer={handleCreateCustomer}
      onCustomerSelect={handleEditCustomer}
    />
  );
};

export default CustomerPage;