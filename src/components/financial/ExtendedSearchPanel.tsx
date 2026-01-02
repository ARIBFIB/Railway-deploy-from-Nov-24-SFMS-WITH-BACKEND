import React, { useState } from 'react';
import { X, CheckCircle, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../Button';
import { Input } from '../Input';
import { type VerificationSeriesItem } from '../../services/verificationSeriesService';
import { type Account } from '../../services/accountService';

interface ExtendedSearchPanelProps {
    onClose: () => void;
    onSearch: (filters: any) => void;
    onClear: () => void;
    seriesList: VerificationSeriesItem[];
    accounts: Account[];
}

export const ExtendedSearchPanel: React.FC<ExtendedSearchPanelProps> = ({
    onClose,
    onSearch,
    onClear,
    seriesList,
    accounts
}) => {
    const [formData, setFormData] = useState({
        verificationNumber: '',
        description: '',
        dateFrom: '',
        dateTo: '',
        comment: '',
        accountFrom: '',
        accountTo: '',
        amountType: 'Debit/Credit',
        amountFrom: '',
        amountTo: '',
        transactionInfo: ''
    });

    const [expandedSections, setExpandedSections] = useState({
        basicDetails: true,
        voucherContent: true
    });

    const [history, setHistory] = useState<{
        comments: string[];
        transactionInfos: string[];
    }>({
        comments: [],
        transactionInfos: []
    });

    // Load history on mount
    React.useEffect(() => {
        const savedComments = localStorage.getItem('search_history_comments');
        const savedTransInfos = localStorage.getItem('search_history_transaction_info');
        setHistory({
            comments: savedComments ? JSON.parse(savedComments) : [],
            transactionInfos: savedTransInfos ? JSON.parse(savedTransInfos) : []
        });
    }, []);

    const toggleSection = (section: 'basicDetails' | 'voucherContent') => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleClear = () => {
        setFormData({
            verificationNumber: '',
            description: '',
            dateFrom: '',
            dateTo: '',
            comment: '',
            accountFrom: '',
            accountTo: '',
            amountType: 'Debit/Credit',
            amountFrom: '',
            amountTo: '',
            transactionInfo: ''
        });
        onClear();
    };

    const handleSearch = () => {
        // Save history
        if (formData.comment && !history.comments.includes(formData.comment)) {
            const newComments = [formData.comment, ...history.comments].slice(0, 50);
            localStorage.setItem('search_history_comments', JSON.stringify(newComments));
            setHistory(prev => ({ ...prev, comments: newComments }));
        }
        if (formData.transactionInfo && !history.transactionInfos.includes(formData.transactionInfo)) {
            const newTrans = [formData.transactionInfo, ...history.transactionInfos].slice(0, 50);
            localStorage.setItem('search_history_transaction_info', JSON.stringify(newTrans));
            setHistory(prev => ({ ...prev, transactionInfos: newTrans }));
        }

        onSearch(formData);
    };



    return (
        <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm mb-6 overflow-hidden">
            <div className="p-6 space-y-6">
                {/* Basic Details Section */}
                <div className="border border-gray-200 rounded">
                    <button
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 text-left font-semibold text-[#2E2E2E]"
                        onClick={() => toggleSection('basicDetails')}
                    >
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-[#2E7D32]" />
                            Basic Details
                        </div>
                        {expandedSections.basicDetails ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </button>

                    {expandedSections.basicDetails && (
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-[#333333] mb-1">Voucher Number</label>
                                <Input
                                    value={formData.verificationNumber}
                                    onChange={(e) => handleInputChange('verificationNumber', e.target.value)}
                                    className="h-10 text-sm border-[#CFCFCF] focus:border-[#1976D2]"
                                    placeholder="Enter number"
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-[#333333] mb-1">Description</label>
                                <Input
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    className="h-10 text-sm border-[#CFCFCF] focus:border-[#1976D2]"
                                    placeholder="Enter description"
                                />
                            </div>
                            <div className="col-span-1 relative">
                                <label className="block text-sm font-medium text-[#333333] mb-1">Date From</label>
                                <div className="relative">
                                    <Input
                                        type="date"
                                        value={formData.dateFrom}
                                        onChange={(e) => handleInputChange('dateFrom', e.target.value)}
                                        className="h-10 text-sm border-[#CFCFCF] focus:border-[#1976D2] pr-8"
                                    />
                                    <Calendar className="w-4 h-4 text-[#757575] absolute right-2 top-3 pointer-events-none" />
                                </div>
                            </div>
                            <div className="col-span-1 relative">
                                <label className="block text-sm font-medium text-[#333333] mb-1">Date To</label>
                                <div className="relative">
                                    <Input
                                        type="date"
                                        value={formData.dateTo}
                                        onChange={(e) => handleInputChange('dateTo', e.target.value)}
                                        className="h-10 text-sm border-[#CFCFCF] focus:border-[#1976D2] pr-8"
                                    />
                                    <Calendar className="w-4 h-4 text-[#757575] absolute right-2 top-3 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Verification Content Section */}
                <div className="border border-gray-200 rounded overflow-hidden">
                    <button
                        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200 text-left font-semibold text-[#2E2E2E]"
                        onClick={() => toggleSection('voucherContent')}
                    >
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-[#2E7D32]" />
                            Verification content
                        </div>
                        {expandedSections.voucherContent ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </button>

                    {expandedSections.voucherContent && (
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-[#333333] mb-1">Comment</label>
                                <div className="relative">
                                    <Input
                                        value={formData.comment}
                                        onChange={(e) => handleInputChange('comment', e.target.value)}
                                        className="h-10 text-sm border-[#CFCFCF] focus:border-[#1976D2]"
                                        placeholder="Enter comment"
                                        list="comment-history"
                                    />
                                    <datalist id="comment-history">
                                        {history.comments.map((item, idx) => (
                                            <option key={idx} value={item} />
                                        ))}
                                    </datalist>
                                </div>
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-[#333333] mb-1">Account From</label>
                                <select
                                    className="w-full h-10 border border-[#CFCFCF] rounded px-3 text-sm text-[#333333] focus:outline-none focus:border-[#1976D2]"
                                    value={formData.accountFrom}
                                    onChange={(e) => handleInputChange('accountFrom', e.target.value)}
                                >
                                    <option value="">Select account</option>
                                    <option value="1930">1930 - Business Account</option>
                                    <option value="2440">2440 - Supplier Debts</option>
                                </select>
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-[#333333] mb-1">Account To</label>
                                <select
                                    className="w-full h-10 border border-[#CFCFCF] rounded px-3 text-sm text-[#333333] focus:outline-none focus:border-[#1976D2]"
                                    value={formData.accountTo}
                                    onChange={(e) => handleInputChange('accountTo', e.target.value)}
                                >
                                    <option value="">Select account</option>
                                    <option value="1930">1930 - Business Account</option>
                                    <option value="2440">2440 - Supplier Debts</option>
                                </select>
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-[#333333] mb-1">Transaction Information</label>
                                <div className="relative">
                                    <Input
                                        value={formData.transactionInfo}
                                        onChange={(e) => handleInputChange('transactionInfo', e.target.value)}
                                        className="h-10 text-sm border-[#CFCFCF] focus:border-[#1976D2]"
                                        placeholder="Enter transaction info"
                                        list="trans-history"
                                    />
                                    <datalist id="trans-history">
                                        {history.transactionInfos.map((item, idx) => (
                                            <option key={idx} value={item} />
                                        ))}
                                    </datalist>
                                </div>
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-[#333333] mb-1">Amount Type</label>
                                <select
                                    className="w-full h-10 border border-[#CFCFCF] rounded px-3 text-sm text-[#333333] focus:outline-none focus:border-[#1976D2]"
                                    value={formData.amountType}
                                    onChange={(e) => handleInputChange('amountType', e.target.value)}
                                >
                                    <option value="Debit/Credit">Debit/Credit</option>
                                    <option value="Debit">Debit</option>
                                    <option value="Credit">Credit</option>
                                </select>
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-[#333333] mb-1">Amount From</label>
                                <Input
                                    type="number"
                                    value={formData.amountFrom}
                                    onChange={(e) => handleInputChange('amountFrom', e.target.value)}
                                    className="h-10 text-sm border-[#CFCFCF] focus:border-[#1976D2]"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-[#333333] mb-1">Amount To</label>
                                <Input
                                    type="number"
                                    value={formData.amountTo}
                                    onChange={(e) => handleInputChange('amountTo', e.target.value)}
                                    className="h-10 text-sm border-[#CFCFCF] focus:border-[#1976D2]"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3 rounded-b">
                <button
                    onClick={handleClear}
                    className="px-5 py-2 rounded-full bg-[#9E9E9E] text-white hover:bg-[#757575] text-sm font-medium transition-colors"
                >
                    Clear
                </button>
                <button
                    onClick={handleSearch}
                    className="px-6 py-2 rounded-full bg-[#757575] text-white hover:bg-[#616161] text-sm font-medium transition-colors"
                >
                    Search
                </button>
            </div>
        </div>
    );
};
