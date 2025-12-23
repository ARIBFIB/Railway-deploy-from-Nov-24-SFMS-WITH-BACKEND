import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Printer,
    Calendar,
    ChevronDown,
    Search,
    ArrowLeft,
    Download,
    Filter
} from 'lucide-react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Card } from '../Card';
import { VerificationService, type Verification, type VerificationEntry } from '../../services/verificationService';
import { AccountService, type Account } from '../../services/accountService';

interface ReportTransaction {
    id: string;
    date: string;
    verificationNumber: string;
    description: string;
    transactionInfo: string;
    debit: number;
    credit: number;
    balance: number;
}

export const AccountAnalysisReport: React.FC = () => {
    const [searchParams] = useSearchParams();
    const initialVerificationId = searchParams.get('verificationId');

    const [accounts, setAccounts] = useState<Account[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<string>('');
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });
    const [transactions, setTransactions] = useState<ReportTransaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [openingBalance, setOpeningBalance] = useState(0);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await AccountService.getAccounts();
                if (response.success) {
                    setAccounts(response.data);

                    if (initialVerificationId) {
                        const verRes = await VerificationService.getVerificationById(initialVerificationId);
                        if (verRes.success && verRes.data.entries && verRes.data.entries.length > 0) {
                            // Default to the first account number in the verification
                            const firstAccount = verRes.data.entries[0].account_number;
                            setSelectedAccount(firstAccount);
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to fetch accounts:', err);
            }
        };
        fetchAccounts();
    }, [initialVerificationId]);

    useEffect(() => {
        if (selectedAccount) {
            loadReport();
        }
    }, [selectedAccount, dateRange]);

    const loadReport = async () => {
        setLoading(true);
        try {
            // In a real scenario, this would be a dedicated report endpoint.
            // For now, we'll fetch all verifications and filter on the client.
            const response = await VerificationService.getVerifications({
                accounting_date_from: dateRange.start,
                accounting_date_to: dateRange.end,
                limit: 1000 // Get a large enough set for analysis
            });

            if (response.success) {
                const acc = accounts.find(a => a.account_number === selectedAccount);
                const startBalance = acc?.opening_balance || 0;
                setOpeningBalance(startBalance);

                let currentBalance = startBalance;
                const filteredTransactions: ReportTransaction[] = [];

                // Sort all items by date
                const sortedVerifications = response.data.sort((a, b) =>
                    new Date(a.accounting_date).getTime() - new Date(b.accounting_date).getTime()
                );

                sortedVerifications.forEach(ver => {
                    ver.entries?.forEach(entry => {
                        if (entry.account_number === selectedAccount) {
                            currentBalance += (entry.debit || 0) - (entry.credit || 0);
                            filteredTransactions.push({
                                id: entry.id || Math.random().toString(),
                                date: ver.accounting_date,
                                verificationNumber: ver.verification_number,
                                description: ver.description || '',
                                transactionInfo: entry.transaction_info,
                                debit: entry.debit || 0,
                                credit: entry.credit || 0,
                                balance: currentBalance
                            });
                        }
                    });
                });

                setTransactions(filteredTransactions);
            }
        } catch (err) {
            console.error('Failed to load report:', err);
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => window.print();

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-6">
            <div className="flex items-center justify-between no-print">
                <div className="flex items-center gap-4">
                    <Button variant="secondary" onClick={() => window.close()} className="flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-900">Account Analysis Report</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Button icon={Printer} onClick={handlePrint} variant="secondary">Print</Button>
                    <Button icon={Download}>Export CSV</Button>
                </div>
            </div>

            {/* Filters Container */}
            <Card className="no-print">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Account</label>
                        <select
                            value={selectedAccount}
                            onChange={(e) => setSelectedAccount(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select Account</option>
                            {accounts.map(acc => (
                                <option key={acc.id} value={acc.account_number}>
                                    {acc.account_number} - {acc.account_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">Start Date</label>
                        <Input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase">End Date</label>
                        <Input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                        />
                    </div>
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                        onClick={loadReport}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Update Report'}
                    </Button>
                </div>
            </Card>

            {/* Report View */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden print:border-none">
                <div className="p-8 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Account Analysis</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Account: <span className="font-semibold text-gray-900">{selectedAccount ? accounts.find(a => a.account_number === selectedAccount)?.account_name : 'N/A'} ({selectedAccount})</span>
                            </p>
                            <p className="text-sm text-gray-500">
                                Period: <span className="font-semibold text-gray-900">{dateRange.start}</span> to <span className="font-semibold text-gray-900">{dateRange.end}</span>
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Opening Balance</p>
                            <p className="text-lg font-bold text-gray-900">{openingBalance.toFixed(2)} SEK</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Ver. #</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Info</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Debit</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Credit</th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Balance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-12 text-center text-gray-400 italic">
                                            {selectedAccount ? 'No transactions found for this period' : 'Select an account to view transactions'}
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map((tx) => (
                                        <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-4 py-3 text-sm text-gray-600 font-medium">{tx.date}</td>
                                            <td className="px-4 py-3 text-sm text-blue-600 font-semibold">{tx.verificationNumber}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{tx.description}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500 italic">{tx.transactionInfo}</td>
                                            <td className="px-4 py-3 text-sm text-right text-green-600 font-medium">
                                                {tx.debit > 0 ? tx.debit.toFixed(2) : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right text-red-600 font-medium">
                                                {tx.credit > 0 ? tx.credit.toFixed(2) : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right font-bold text-gray-900 border-l border-gray-50 bg-gray-50/30">
                                                {tx.balance.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                            {transactions.length > 0 && (
                                <tfoot className="bg-gray-50/80">
                                    <tr>
                                        <td colSpan={6} className="px-4 py-4 text-sm font-bold text-gray-900 text-right">Closing Balance</td>
                                        <td className="px-4 py-4 text-sm font-bold text-blue-700 text-right">
                                            {transactions[transactions.length - 1].balance.toFixed(2)} SEK
                                        </td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                </div>
            </div>

            <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .max-w-7xl { max-width: 100% !important; padding: 0 !important; }
          .shadow-sm { shadow: none !important; border: none !important; }
        }
      `}</style>
        </div>
    );
};
