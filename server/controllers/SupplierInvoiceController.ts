import { Response } from 'express';
import { supabase } from '../config/database';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

export class SupplierInvoiceController {
    static getSupplierInvoices = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const { foundation_id } = req.query;

        if (!foundation_id) {
            throw createError('Foundation ID is required', 400);
        }

        let query = supabase
            .from('supplier_invoices')
            .select(`
        *,
        suppliers(id, name, supplier_number),
        supplier_invoice_items(*),
        received_by_profile:profiles!supplier_invoices_received_by_fkey(full_name),
        approved_by_profile:profiles!supplier_invoices_approved_by_fkey(full_name)
      `)
            .eq('foundation_id', foundation_id)
            .order('created_at', { ascending: false });

        // Filter by status if provided
        if (req.query.status) {
            query = query.eq('status', req.query.status);
        }

        // Filter by supplier if provided
        if (req.query.supplier_id) {
            query = query.eq('supplier_id', req.query.supplier_id);
        }

        // Search functionality
        if (req.query.search) {
            query = query.or(`invoice_number.ilike.%${req.query.search}%,supplier_invoice_number.ilike.%${req.query.search}%`);
        }

        const { data: invoices, error } = await query;

        if (error) {
            throw createError(error.message, 500);
        }

        res.json({
            invoices: invoices || [],
            total: invoices?.length || 0
        });
    });

    static getSupplierInvoiceById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const { id } = req.params;
        const { foundation_id } = req.query;

        const { data: invoice, error } = await supabase
            .from('supplier_invoices')
            .select(`
        *,
        suppliers(id, name, supplier_number),
        supplier_invoice_items(*),
        profiles!supplier_invoices_received_by_fkey(full_name),
        profiles!supplier_invoices_approved_by_fkey(full_name)
      `)
            .eq('id', id)
            .eq('foundation_id', foundation_id)
            .single();

        if (error) {
            throw createError('Supplier invoice not found', 404);
        }

        res.json({ invoice });
    });

    static createSupplierInvoice = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const { foundation_id } = req.query;
        const {
            supplier_id,
            supplier_invoice_number,
            invoice_date,
            due_date,
            total_amount,
            currency,
            notes,
            items = []
        } = req.body;

        if (!foundation_id) {
            throw createError('Foundation ID is required', 400);
        }

        if (!invoice_date) {
            throw createError('Invoice date is required', 400);
        }

        // Generate internal invoice number
        const { data: lastInvoice } = await supabase
            .from('supplier_invoices')
            .select('invoice_number')
            .eq('foundation_id', foundation_id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        const nextNumber = lastInvoice ? parseInt(lastInvoice.invoice_number.split('-').pop() || '0') + 1 : 1;
        const invoice_number = `SI-${new Date().getFullYear()}-${nextNumber.toString().padStart(4, '0')}`;

        // Create invoice
        const { data: invoice, error: invoiceError } = await supabase
            .from('supplier_invoices')
            .insert({
                foundation_id,
                supplier_id,
                invoice_number,
                supplier_invoice_number,
                invoice_date,
                due_date: due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                total_amount: total_amount || 0,
                currency: currency || 'SEK',
                status: 'received',
                notes,
                received_by: req.user?.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (invoiceError) {
            throw createError(invoiceError.message, 400);
        }

        // Create items if provided
        if (items && items.length > 0) {
            const invoiceItems = items.map((item: any) => ({
                supplier_invoice_id: invoice.id,
                description: item.description,
                quantity: item.quantity,
                unit_price: item.unit_price,
                tax_rate: item.tax_rate || 25,
                created_at: new Date().toISOString()
            }));

            const { error: itemsError } = await supabase
                .from('supplier_invoice_items')
                .insert(invoiceItems);

            if (itemsError) {
                // Clean up
                await supabase.from('supplier_invoices').delete().eq('id', invoice.id);
                throw createError('Failed to create invoice items', 400);
            }
        }

        res.status(201).json({
            message: 'Supplier invoice created successfully',
            invoice
        });
    });

    static updateSupplierInvoice = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const { id } = req.params;
        const { foundation_id } = req.query;
        const updateData = req.body;
        const { items, ...invoiceUpdateData } = updateData;

        const { data: invoice, error: invoiceError } = await supabase
            .from('supplier_invoices')
            .update({
                ...invoiceUpdateData,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('foundation_id', foundation_id)
            .select()
            .single();

        if (invoiceError) {
            throw createError('Supplier invoice not found or update failed', 404);
        }

        // Update items if provided (simplified: delete all and recreate)
        if (items !== undefined) {
            await supabase
                .from('supplier_invoice_items')
                .delete()
                .eq('supplier_invoice_id', id);

            if (items.length > 0) {
                const invoiceItems = items.map((item: any) => ({
                    supplier_invoice_id: id,
                    description: item.description,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    tax_rate: item.tax_rate || 25,
                    created_at: new Date().toISOString()
                }));

                await supabase
                    .from('supplier_invoice_items')
                    .insert(invoiceItems);
            }
        }

        res.json({
            message: 'Supplier invoice updated successfully',
            invoice
        });
    });

    static deleteSupplierInvoice = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const { id } = req.params;
        const { foundation_id } = req.query;

        const { error } = await supabase
            .from('supplier_invoices')
            .delete()
            .eq('id', id)
            .eq('foundation_id', foundation_id);

        if (error) {
            throw createError('Failed to delete supplier invoice', 500);
        }

        res.json({
            message: 'Supplier invoice deleted successfully'
        });
    });

    static approveSupplierInvoice = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const { id } = req.params;
        const { foundation_id } = req.query;

        const { data: invoice, error } = await supabase
            .from('supplier_invoices')
            .update({
                status: 'approved',
                approved_by: req.user?.id,
                approved_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('foundation_id', foundation_id)
            .select()
            .single();

        if (error) {
            throw createError('Failed to approve invoice', 500);
        }

        res.json({
            message: 'Supplier invoice approved successfully',
            invoice
        });
    });

    static rejectSupplierInvoice = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const { id } = req.params;
        const { foundation_id } = req.query;
        const { reason } = req.body;

        // Fetch current invoice to append notes if needed
        const { data: currentInvoice } = await supabase
            .from('supplier_invoices')
            .select('notes')
            .eq('id', id)
            .single();

        const currentNotes = currentInvoice?.notes ? currentInvoice.notes + '\n' : '';
        const newNotes = reason ? `${currentNotes}Rejected reason: ${reason}` : currentNotes;

        const { data: invoice, error } = await supabase
            .from('supplier_invoices')
            .update({
                status: 'rejected',
                approved_by: req.user?.id, // User who rejected it
                approved_at: new Date().toISOString(),
                notes: newNotes,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('foundation_id', foundation_id)
            .select()
            .single();

        if (error) {
            throw createError('Failed to reject invoice', 500);
        }

        res.json({
            message: 'Supplier invoice rejected successfully',
            invoice
        });
    });
}
