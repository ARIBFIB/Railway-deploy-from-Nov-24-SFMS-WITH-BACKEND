import React, { useState } from 'react';
import {
    ChevronLeft,
    ChevronDown,
    ChevronUp,
    Info,
    CheckCircle2,
    Circle,
    MessageSquare,
    ExternalLink,
    FileText,
    Eye
} from 'lucide-react';
import { Button } from '../Button';
import { VatFeedbackModal } from './VatFeedbackModal';
import { VatReportView } from './VatReportView';
import { X } from 'lucide-react';

interface VatPeriodDetailProps {
    period: {
        id: string;
        name: string;
        startDate: string;
        endDate: string;
        dueDate: string;
        status: 'Future' | 'Open' | 'Delayed' | 'Completed';
    };
    onBack: () => void;
}

export const VatPeriodDetail: React.FC<VatPeriodDetailProps> = ({ period, onBack }) => {
    const [openSections, setOpenSections] = useState<number[]>([1, 2]);
    const [status, setStatus] = useState(period.status);
    const [showFeedback, setShowFeedback] = useState(false);
    const [showReport, setShowReport] = useState(false);

    const toggleSection = (id: number) => {
        setOpenSections(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const isFuture = status === 'Future';

    return (
        <div className="max-w-[1000px] mx-auto px-6 md:px-8 py-4 bg-white min-h-screen font-sans">
            {/* Top Navigation */}
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-1 text-[14px] font-medium text-gray-800 hover:text-gray-600 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                </button>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="text-[14px] border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1a4d2e]/20"
                >
                    <option value="Future">Future</option>
                    <option value="Open">Open</option>
                    <option value="Delayed">Delayed</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>

            {/* Page Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-[30px] font-bold text-[#1a4d2e]">{period.name}</h1>
                    <button
                        onClick={() => setShowFeedback(true)}
                        className="flex items-center gap-2 px-4 py-1.5 border border-gray-300 rounded-full text-[13px] font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        <MessageSquare className="w-4 h-4" />
                        Leave feedback
                    </button>
                </div>
                <div className="mt-2 space-y-1 text-[13px] text-gray-600">
                    <p>Due date {period.dueDate}</p>
                    <p>Refers to period {period.startDate} to {period.endDate}</p>
                </div>
            </div>

            {/* Informational Banner */}
            {isFuture && (
                <div className="bg-[#D9ECF7] border-l-4 border-[#2D79B0] rounded-lg p-4 flex gap-3 mb-8">
                    <Info className="w-5 h-5 text-[#2D79B0] shrink-0 mt-0.5" />
                    <p className="text-[13px] text-[#1e4b6b] leading-relaxed">
                        This is a future VAT period that you can currently view and prepare, but you must complete the previous periods before you can post this one.
                    </p>
                </div>
            )}

            {/* Step-Based Sections */}
            <div className="space-y-4">
                {/* Section 1 — Deviations */}
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <button
                        onClick={() => toggleSection(1)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold ${openSections.includes(1) ? 'bg-[#1a4d2e] text-white' : 'bg-gray-100 text-gray-500'
                                }`}>
                                1
                            </div>
                            <h2 className="text-[16px] font-semibold text-gray-900">Deviations – no deviations found</h2>
                        </div>
                        {openSections.includes(1) ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </button>

                    {openSections.includes(1) && (
                        <div className="px-16 pb-6 space-y-4">
                            <div className="flex items-center gap-2">
                                <p className="text-[13px] text-gray-600">
                                    <span className="inline-block bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded mr-2">New!</span>
                                    The system validates that VAT is booked correctly.
                                </p>
                            </div>
                            <button className="text-[13px] text-[#1a4d2e] font-medium hover:underline flex items-center gap-1">
                                Settings – VAT codes
                                <ExternalLink className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Section 2 — VAT Details */}
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <button
                        onClick={() => toggleSection(2)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold ${openSections.includes(2) ? 'bg-[#1a4d2e] text-white' : 'bg-gray-100 text-gray-500'
                                }`}>
                                2
                            </div>
                            <h2 className="text-[16px] font-semibold text-gray-900">VAT details</h2>
                        </div>
                        {openSections.includes(2) ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                    </button>

                    {openSections.includes(2) && (
                        <div className="px-16 pb-6 space-y-6">
                            <div className="space-y-4 text-[13px] text-gray-600">
                                <p>The system reads accounting transactions and summarizes their VAT impact for {period.startDate} to {period.endDate}.</p>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => setShowReport(true)}
                                        className="text-[#1a4d2e] font-medium hover:underline flex items-center gap-1 w-fit"
                                    >
                                        Show VAT report
                                    </button>
                                    <button className="text-[#1a4d2e] font-medium hover:underline flex items-center gap-1 w-fit">
                                        What should I do if the VAT report is incorrect?
                                    </button>
                                </div>
                            </div>

                            {/* VAT Calculation Box */}
                            <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 space-y-4">
                                <h3 className="text-[14px] font-bold text-gray-900 uppercase tracking-tight">G. VAT to pay or reclaim</h3>
                                <div className="flex items-center justify-between py-2 border-b border-gray-200/60">
                                    <span className="text-[14px] font-medium text-gray-700">VAT to reclaim</span>
                                    <span className="text-[14px] font-bold text-gray-900">0,00 SEK</span>
                                </div>

                                <div className="flex justify-end gap-3 pt-2">
                                    <Button
                                        variant="secondary"
                                        disabled
                                        className="h-9 px-4 text-[13px] border-gray-300 disabled:opacity-40"
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        Show voucher
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => setShowReport(true)}
                                        className="h-9 px-4 text-[13px] border-[#1a4d2e] text-[#1a4d2e] hover:bg-[#1a4d2e]/5"
                                    >
                                        <FileText className="w-4 h-4 mr-2" />
                                        Show VAT report
                                    </Button>
                                    <Button
                                        disabled={isFuture}
                                        className="h-9 px-8 text-[13px] bg-[#1a4d2e] hover:bg-[#153d25] text-white disabled:opacity-40"
                                    >
                                        Approve
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Section 3 — VAT Return */}
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm opacity-60">
                    <button
                        disabled
                        className="w-full flex items-center justify-between p-4"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold bg-gray-100 text-gray-500">
                                3
                            </div>
                            <h2 className="text-[16px] font-semibold text-gray-900">VAT return</h2>
                        </div>
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Section 4 — Done */}
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm opacity-60">
                    <button
                        disabled
                        className="w-full flex items-center justify-between p-4"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold bg-gray-100 text-gray-500">
                                4
                            </div>
                            <h2 className="text-[16px] font-semibold text-gray-900">Done</h2>
                        </div>
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
            </div>

            <VatFeedbackModal
                isOpen={showFeedback}
                onClose={() => setShowFeedback(false)}
            />

            <VatReportView
                isOpen={showReport}
                onClose={() => setShowReport(false)}
                companyName="Test Company"
                financialYear="2025-01-01 - 2025-12-31"
                period={`${period.startDate} - ${period.endDate}`}
            />
        </div>
    );
};
