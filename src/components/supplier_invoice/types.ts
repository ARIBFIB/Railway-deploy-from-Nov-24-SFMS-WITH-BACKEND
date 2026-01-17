// Supplier Invoice Type Definition
export interface SupplierInvoice {
  id: string;
  supplier: string;
  invoiceDate: string;
  dueDate: string;
  ocr: string;
  invoiceNumber: string;
  total: number;
  vat: number;
  currency: string;
  rate: number;
  unit: number;
  ourReference: string;
  codingTemplate: string;
  bankGiro: string;
  plusGiro: string;
  supplierReference: string;
  typeOfVat: 'normal' | 'uif' | 'rev_tax';
  createdAt: string;
  updatedAt: string;
}