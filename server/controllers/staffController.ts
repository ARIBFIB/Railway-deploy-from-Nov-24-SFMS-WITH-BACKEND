import { Request, Response } from 'express';
import { supabase } from '../config/database';

export const createStaffMember = async (req: Request, res: Response) => {
  try {
    const {
      employmentId,
      firstName,
      lastName,
      personalId,
      dateOfBirth,
      gender,
      nationality,
      maritalStatus,
      address,
      city,
      postalCode,
      country,
      email,
      phone,
      mobile,
      emergencyContact,
      nextOfKinName,
      nextOfKinRelationship,
      nextOfKinPhone,
      nextOfKinEmail,
      adminRights,
      viewOnly,
      editPermissions,
      accessToPayroll
    } = req.body;

    // Insert the new staff member into the database
    const { data, error } = await supabase
      .from('staff')
      .insert([{
        employment_id: employmentId,
        first_name: firstName,
        last_name: lastName,
        personal_id: personalId,
        date_of_birth: dateOfBirth,
        gender,
        nationality,
        marital_status: maritalStatus,
        address,
        city,
        postal_code: postalCode,
        country,
        email,
        phone,
        mobile,
        emergency_contact: emergencyContact,
        next_of_kin_name: nextOfKinName,
        next_of_kin_relationship: nextOfKinRelationship,
        next_of_kin_phone: nextOfKinPhone,
        next_of_kin_email: nextOfKinEmail,
        admin_rights: adminRights,
        view_only: viewOnly,
        edit_permissions: editPermissions,
        access_to_payroll: accessToPayroll,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating staff member:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data);
  } catch (err) {
    console.error('Unexpected error creating staff member:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllStaffMembers = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching staff members:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Unexpected error fetching staff members:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};