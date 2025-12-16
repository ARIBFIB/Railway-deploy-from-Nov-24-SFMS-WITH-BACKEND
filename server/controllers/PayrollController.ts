import { Response } from 'express';
import { supabase } from '../config/database';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { AuthenticatedRequest } from '../middleware/auth';

const calculateSwedishTax = (monthlyGross: number): number => {
    // 2024 Simplified Tax Calculation
    const municipalRate = 0.32; // Average municipal tax
    const stateTaxThresholdMonthly = 598500 / 12; // ~49,875 SEK
    const stateTaxRate = 0.20;

    let tax = monthlyGross * municipalRate;

    // Add State Tax if applicable
    if (monthlyGross > stateTaxThresholdMonthly) {
        const taxableAmount = monthlyGross - stateTaxThresholdMonthly;
        tax += taxableAmount * stateTaxRate;
    }

    // Basic Job Tax Deduction (Jobbskatteavdrag) Approximation
    // (Very simplified: reduces tax by ~2-3k for average earners)
    if (monthlyGross > 10000) {
        tax = Math.max(0, tax - 2500);
    }

    return Math.round(tax);
};

const calculateSocialSecurity = (monthlyGross: number, age: number = 30): number => {
    // 2024 Social Security Rates (Arbetsgivaravgifter)
    // Standard: 31.42%
    // Youth (15-18): Reduced (often ~10.21% on part) - Simplified to standard for now
    // Elderly (>66): Reduced (~10.21%)

    let rate = 0.3142;

    // If we had birthdate, we could adjust rate:
    // if (age > 66) rate = 0.1021; 

    return Math.round(monthlyGross * rate);
};

export class PayrollController {
    // Payroll Runs
    static getPayrollRuns = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const { foundation_id, status } = req.query;

        if (!foundation_id) {
            throw createError('Foundation ID is required', 400);
        }

        let query = supabase
            .from('payroll_runs')
            .select('*')
            .eq('foundation_id', foundation_id)
            .order('created_at', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        const { data: runs, error } = await query;

        if (error) {
            throw createError(error.message, 500);
        }

        res.json({
            payroll_runs: runs || [],
            total: runs?.length || 0
        });
    });

    static getPayrollRunById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const { id } = req.params;
        const { foundation_id } = req.query;

        const { data: run, error } = await supabase
            .from('payroll_runs')
            .select(`
        *,
        payroll_entries(
          *,
          employees(first_name, last_name, social_security_number, email)
        )
      `)
            .eq('id', id)
            .eq('foundation_id', foundation_id)
            .single();

        if (error) {
            throw createError('Payroll run not found', 404);
        }

        res.json({ payroll_run: run });
    });

    static createPayrollRun = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const { foundation_id } = req.query;
        const {
            payroll_period_start,
            payroll_period_end,
            pay_date,
            currency
        } = req.body;

        if (!foundation_id) {
            throw createError('Foundation ID is required', 400);
        }

        // 1. Create the run
        const { data: run, error: runError } = await supabase
            .from('payroll_runs')
            .insert({
                foundation_id,
                payroll_period_start,
                payroll_period_end,
                pay_date,
                currency: currency || 'SEK',
                status: 'draft',
                created_by: req.user?.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (runError) {
            throw createError(runError.message, 400);
        }

        res.status(201).json({
            message: 'Payroll run created successfully',
            payroll_run: run
        });
    });

    static calculatePayrollRun = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const { id } = req.params;
        const { foundation_id } = req.query;

        // Fetch the run
        const { data: run, error: fetchError } = await supabase
            .from('payroll_runs')
            .select('*')
            .eq('id', id)
            .eq('foundation_id', foundation_id)
            .single();

        if (fetchError || !run) {
            throw createError('Payroll run not found', 404);
        }

        // Fetch active employees
        const { data: employees } = await supabase
            .from('employees')
            .select('*')
            .eq('foundation_id', foundation_id)
            .eq('is_active', true);

        if (!employees || employees.length === 0) {
            throw createError('No active employees found to calculate payroll', 400);
        }

        // Clear existing entries
        await supabase.from('payroll_entries').delete().eq('payroll_run_id', id);

        // Generate new entries with advanced calculation
        const entries = employees.map((emp: any) => {
            // Determine Base Salary (Gross)
            // Use 'agreement_for_salaries' or fallback
            // We ensure it is a number
            const gross = Number(emp.agreement_for_salaries) || 25000;

            // Calculate Tax
            const tax = calculateSwedishTax(gross);

            // Calculate Social Security
            // Note: We don't have birthdate easily accessible here unless in 'emp' object.
            // We assume standard rate.
            const social = calculateSocialSecurity(gross);

            // Vacation Pay (Semesterersättning)
            // Assuming 12% accrued per month (often handled separately or paid out)
            // If we want to include it in cost, we can put it in other_deductions or just ignore for now if not paying out.
            // Let's assume standard monthly salary doesn't pay out vacation unless specified.

            return {
                payroll_run_id: id,
                employee_id: emp.id,
                gross_pay: gross,
                tax_deduction: tax,
                social_security_deduction: social,
                other_deductions: 0,
                created_at: new Date().toISOString()
            };
        });

        const { error: insertError } = await supabase
            .from('payroll_entries')
            .insert(entries);

        if (insertError) {
            throw createError('Failed to save calculated entries', 500);
        }

        // Update Run Totals
        const sumGross = entries.reduce((acc, curr) => acc + curr.gross_pay, 0);
        const sumTax = entries.reduce((acc, curr) => acc + curr.tax_deduction, 0);
        const sumSocial = entries.reduce((acc, curr) => acc + curr.social_security_deduction, 0);
        const sumNet = sumGross - sumTax; // Net Pay = Gross - Tax

        await supabase
            .from('payroll_runs')
            .update({
                status: 'calculated',
                total_gross_pay: sumGross,
                total_deductions: sumTax, // Employee tax (deduction from gross)
                // Note: Social security is NOT deducted from Net, it's an employer cost. 
                // We might want to store it in total_deductions OR a separate field if available.
                // Standard: total_deductions usually refers to what is taken FROM the employee (Tax + maybe student loan etc).

                total_net_pay: sumNet,
                employee_count: employees.length,
                updated_at: new Date().toISOString()
            })
            .eq('id', id);

        res.json({
            message: 'Payroll calculated successfully',
            payroll_run_id: id,
            processed_employees: employees.length,
            totals: {
                gross: sumGross,
                tax: sumTax,
                social_security: sumSocial, // Returned for UI confirmation roughly
                net: sumNet
            }
        });
    });

    static approvePayrollRun = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const { id } = req.params;
        const { foundation_id } = req.query;

        const { data: run, error } = await supabase
            .from('payroll_runs')
            .update({
                status: 'approved',
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('foundation_id', foundation_id)
            .select()
            .single();

        if (error) {
            throw createError('Failed to approve payroll run', 500);
        }

        res.json({
            message: 'Payroll run approved',
            payroll_run: run
        });
    });

    static deletePayrollRun = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
        const { id } = req.params;
        const { foundation_id } = req.query;

        const { error } = await supabase
            .from('payroll_runs')
            .delete()
            .eq('id', id)
            .eq('foundation_id', foundation_id);

        if (error) {
            throw createError('Failed to delete payroll run', 500);
        }

        res.json({ message: 'Payroll run deleted successfully' });
    });
}
