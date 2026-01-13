import React, { useState, useEffect } from 'react';
import { CustomerList } from '../components/customer';
import { CustomerForm } from '../components/customer';
import { customerService } from '../services/customerService';

interface Customer {
  id: string;
  foundation_id: string;
  customer_number: string;
  customer_type: 'business' | 'private' | 'company';
  corporate_personal_id: string;
  name: string;
  status: 'active' | 'inactive';
  industry_code?: string;
  workplace_number?: string;
  store_id?: string;
  notes?: string;
  created_at: string;
  customer_addresses: Array<{
    id: string;
    customer_id: string;
    address_type: string;
    name?: string;
    address?: string;
    address2?: string;
    postal_code?: string;
    city?: string;
    country?: string;
    country_code?: string;
    is_primary?: boolean;
  }>;
  customer_contacts: Array<{
    id: string;
    customer_id: string;
    phone?: string;
    phone2?: string;
    fax?: string;
    email?: string;
    web_address?: string;
  }>;
}

const CustomerPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [allCustomersData, setAllCustomersData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      // Get foundation ID from user context
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      const foundationId = userData.foundationId || userData.foundation_id || '12345678-1234-1234-1234-123456789012';

      const fetchedCustomers = await customerService.getCustomers(foundationId);

      // Transform the data to match the CustomerList component's expected format
      const transformedCustomers = fetchedCustomers.map((customer: Customer) => ({
        id: customer.id,
        customerId: customer.customer_number,
        name: customer.name,
        orgPersonNumber: customer.corporate_personal_id,
        postalCode: customer.customer_addresses[0]?.postal_code || '',
        city: customer.customer_addresses[0]?.city || '',
        country: customer.customer_addresses[0]?.country || '',
        phone: customer.customer_contacts[0]?.phone || '',
        email: customer.customer_contacts[0]?.email || '',
        status: customer.status,
      }));

      setCustomers(transformedCustomers);
      setAllCustomersData(fetchedCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
      // Set empty array if there's an error
      setCustomers([]);
      setAllCustomersData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleCreateCustomer = () => {
    setEditingCustomer(null);
    setShowForm(true);
  };

  const handleEditCustomer = (customer: any) => {
    // Find the complete customer data using the ID
    const completeCustomer = allCustomersData.find(c => c.id === customer.id);
    
    if (completeCustomer) {
      // Transform the complete customer data to the form format
      const formCustomerData = {
        id: completeCustomer.id,
        customerNumber: completeCustomer.customer_number,
        customerType: completeCustomer.customer_type === 'business' ? 'company' : completeCustomer.customer_type || 'company',
        cinPin: completeCustomer.corporate_personal_id,
        active: completeCustomer.status === 'active' ? 'yes' : 'no',
        name: completeCustomer.name || '',
        phone: completeCustomer.customer_contacts[0]?.phone || '',
        phone2: completeCustomer.customer_contacts[0]?.phone2 || '',
        fax: completeCustomer.customer_contacts[0]?.fax || '',
        email: completeCustomer.customer_contacts[0]?.email || '',
        webAddress: completeCustomer.customer_contacts[0]?.web_address || '',
        invoiceAddress: completeCustomer.customer_addresses[0]?.address || '',
        invoiceAddress2: completeCustomer.customer_addresses[0]?.address2 || '',
        postcode: completeCustomer.customer_addresses[0]?.postal_code || '',
        city: completeCustomer.customer_addresses[0]?.city || '',
        country: completeCustomer.customer_addresses[0]?.country || '',
        countryCode: completeCustomer.customer_addresses[0]?.country_code || '',
        // Delivery address details
        deliveryName: completeCustomer.customer_addresses.find((addr: any) => addr.address_type === 'delivery')?.name || '',
        deliveryAddress: completeCustomer.customer_addresses.find((addr: any) => addr.address_type === 'delivery')?.address || '',
        deliveryAddress2: completeCustomer.customer_addresses.find((addr: any) => addr.address_type === 'delivery')?.address2 || '',
        deliveryPostcode: completeCustomer.customer_addresses.find((addr: any) => addr.address_type === 'delivery')?.postal_code || '',
        deliveryCity: completeCustomer.customer_addresses.find((addr: any) => addr.address_type === 'delivery')?.city || '',
        deliveryCountry: completeCustomer.customer_addresses.find((addr: any) => addr.address_type === 'delivery')?.country || '',
        deliveryCountryCode: completeCustomer.customer_addresses.find((addr: any) => addr.address_type === 'delivery')?.country_code || '',
        deliveryPhone: '',
        deliveryPhone2: '',
        deliveryFax: '',
        industryCode: completeCustomer.industry_code || '',
        workplaceNumber: completeCustomer.workplace_number || '',
        storeId: completeCustomer.store_id || '',
        notes: completeCustomer.notes || '',
      };
      
      setEditingCustomer(formCustomerData);
    } else {
      // Fallback to the basic customer data if complete data not found
      setEditingCustomer(customer);
    }
    
    setShowForm(true);
  };

  const handleSaveCustomer = async (customerData: any) => {
    // Refresh the customer list after saving
    await fetchCustomers();
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
      customers={customers}
      loading={loading}
      onCreateCustomer={handleCreateCustomer}
      onCustomerSelect={handleEditCustomer}
    />
  );
};

export default CustomerPage;