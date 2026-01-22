import React, { useState, useEffect } from 'react';

interface StaffInformationTabProps {
  onChange?: (data: any) => void;
  onSave?: (data: any) => void;
}

const StaffInformationTab: React.FC<StaffInformationTabProps> = ({ onChange, onSave }) => {
  const [formData, setFormData] = useState({
    employmentId: '',
    firstName: '',
    lastName: '',
    personalId: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    maritalStatus: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    email: '',
    phone: '',
    mobile: '',
    emergencyContact: '',
    nextOfKinName: '',
    nextOfKinRelationship: '',
    nextOfKinPhone: '',
    nextOfKinEmail: '',
    adminRights: false,
    viewOnly: false,
    editPermissions: false,
    accessToPayroll: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData, onChange]);

  const handleTabSave = () => {
    if (onSave) {
      onSave(formData);
    }
  };
  return (
    <div className="grid grid-cols-4 gap-x-6 gap-y-3.5">
      {/* Personal Details Section */}
      <div className="col-span-4">
        <h3 className="text-xs font-semibold text-[#2B2B2B] mb-2">Personal details</h3>
        <div className="grid grid-cols-4 gap-x-6 gap-y-3.5">
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Employment ID <span className="text-[#D32F2F]">*</span>
            </label>
            <input
              type="text"
              name="employmentId"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
              value={formData.employmentId}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              First name <span className="text-[#D32F2F]">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Last name <span className="text-[#D32F2F]">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">
              Personal ID <span className="text-[#D32F2F]">*</span>
            </label>
            <input
              type="text"
              name="personalId"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
              value={formData.personalId}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">Date of birth</label>
            <input
              type="date"
              name="dateOfBirth"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">Gender</label>
            <select
              name="gender"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">Nationality</label>
            <input
              type="text"
              name="nationality"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
              value={formData.nationality}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">Marital status</label>
            <select
              name="maritalStatus"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              value={formData.maritalStatus}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact Details Section */}
      <div className="col-span-4 mt-4">
        <h3 className="text-xs font-semibold text-[#2B2B2B] mb-2">Contact details</h3>
        <div className="grid grid-cols-4 gap-x-6 gap-y-3.5">
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">Address</label>
            <input
              type="text"
              name="address"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">City</label>
            <input
              type="text"
              name="city"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">Postal code</label>
            <input
              type="text"
              name="postalCode"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
              value={formData.postalCode}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">Country</label>
            <input
              type="text"
              name="country"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
              value={formData.country}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">Mobile</label>
            <input
              type="tel"
              name="mobile"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
              value={formData.mobile}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">Emergency contact</label>
            <input
              type="tel"
              name="emergencyContact"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
              value={formData.emergencyContact}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Information for Next of Kin Section */}
      <div className="col-span-4 mt-4">
        <h3 className="text-xs font-semibold text-[#2B2B2B] mb-2">Information for next of kin</h3>
        <div className="grid grid-cols-4 gap-x-6 gap-y-3.5">
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">Name</label>
            <input
              type="text"
              name="nextOfKinName"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
              value={formData.nextOfKinName}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">Relationship</label>
            <input
              type="text"
              name="nextOfKinRelationship"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
              value={formData.nextOfKinRelationship}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">Phone</label>
            <input
              type="tel"
              name="nextOfKinPhone"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
              value={formData.nextOfKinPhone}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-1">
            <label className="block text-xs font-medium text-[#2B2B2B] mb-1">Email</label>
            <input
              type="email"
              name="nextOfKinEmail"
              className="w-full h-7 px-2 text-xs border border-[#DADADA] rounded-[4px] text-[#2B2B2B] bg-white"
              placeholder=""
              value={formData.nextOfKinEmail}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Permissions Section */}
      <div className="col-span-4 mt-4">
        <h3 className="text-xs font-semibold text-[#2B2B2B] mb-2">Permissions</h3>
        <div className="grid grid-cols-4 gap-x-6 gap-y-3.5">
          <div className="col-span-1">
            <label className="flex items-center space-x-1.5">
              <input
                type="checkbox"
                name="adminRights"
                className="w-3.5 h-3.5 border border-[#BDBDBD] text-[#2E7D32]"
                checked={formData.adminRights}
                onChange={handleChange}
              />
              <span className="text-xs text-[#2B2B2B]">Admin rights</span>
            </label>
          </div>
          <div className="col-span-1">
            <label className="flex items-center space-x-1.5">
              <input
                type="checkbox"
                name="viewOnly"
                className="w-3.5 h-3.5 border border-[#BDBDBD] text-[#2E7D32]"
                checked={formData.viewOnly}
                onChange={handleChange}
              />
              <span className="text-xs text-[#2B2B2B]">View only</span>
            </label>
          </div>
          <div className="col-span-1">
            <label className="flex items-center space-x-1.5">
              <input
                type="checkbox"
                name="editPermissions"
                className="w-3.5 h-3.5 border border-[#BDBDBD] text-[#2E7D32]"
                checked={formData.editPermissions}
                onChange={handleChange}
              />
              <span className="text-xs text-[#2B2B2B]">Edit permissions</span>
            </label>
          </div>
          <div className="col-span-1">
            <label className="flex items-center space-x-1.5">
              <input
                type="checkbox"
                name="accessToPayroll"
                className="w-3.5 h-3.5 border border-[#BDBDBD] text-[#2E7D32]"
                checked={formData.accessToPayroll}
                onChange={handleChange}
              />
              <span className="text-xs text-[#2B2B2B]">Access to payroll</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffInformationTab;