import React from 'react';
import { ChevronRight, Printer, FileText, Plus } from 'lucide-react';
import { Button } from '../Button';

interface VatPeriod {
    id: string;
    name: string;
    period: string;
    lastReportingDate: string;
    status: 'Normal' | 'Delayed' | 'Completed';
}

interface VatReportingPeriodsProps {
    onPeriodClick?: (id: string) => void;
}

export const VatReportingPeriods: React.FC<VatReportingPeriodsProps> = ({ onPeriodClick }) => {
    const vatPeriods: VatPeriod[] = [
        {
            id: 'dec-2025',
            name: 'December',
            period: '2025-12-01 to 2025-12-31',
            lastReportingDate: '2026-02-12',
            status: 'Normal'
        },
        {
            id: 'nov-2025',
            name: 'November',
            period: '2025-11-01 to 2025-11-30',
            lastReportingDate: '2026-01-19',
            status: 'Normal'
        },
        {
            id: 'mar-2025',
            name: 'March',
            period: '2025-03-01 to 2025-03-31',
            lastReportingDate: '2025-05-12',
            status: 'Delayed'
        },
        {
            id: 'q2-2025',
            name: 'Second quarter',
            period: '2025-04-01 to 2025-06-30',
            lastReportingDate: '2025-08-18',
            status: 'Delayed'
        }
    ];

    return (
        <div className="max-w-[1100px] mx-auto px-6 md:px-8 py-6 space-y-8 bg-white min-h-screen font-sans">
            {/* Page Header */}
            <div className="space-y-3">
                <h1 className="text-[32px] font-bold text-[#1a4d2e] leading-tight">
                    VAT reporting periods to handle
                </h1>
                <p className="text-[15px] text-gray-600 max-w-[700px] leading-relaxed">
                    Check each VAT reporting period and register the statement with Skatteverket before the last reporting day of each period.
                </p>
            </div>

            {/* VAT Period List */}
            <div className="space-y-4">
                {vatPeriods.map((period) => (
                    <div
                        key={period.id}
                        onClick={() => onPeriodClick?.(period.id)}
                        className="flex flex-row items-center justify-between p-5 border border-[#E0E0E0] rounded-[16px] bg-white cursor-pointer hover:shadow-md hover:border-gray-300 transition-all group"
                    >
                        {/* Left Section (Status + Period Info) */}
                        <div className="flex items-center gap-4">
                            {period.status !== 'Normal' && (
                                <span className={`px-3 py-1.5 rounded-full text-[13px] font-semibold ${period.status === 'Delayed'
                                    ? 'bg-[#FFE8A1] text-[#333]'
                                    : 'bg-green-100 text-green-800'
                                    }`}>
                                    {period.status}
                                </span>
                            )}
                            <div className="flex flex-col">
                                <span className="text-[17px] font-semibold text-[#111] leading-snug">
                                    {period.name}
                                </span>
                                <span className="text-[14px] text-gray-500 mt-1 font-normal">
                                    Refers to the period {period.period}
                                </span>
                            </div>
                        </div>

                        {/* Right Section (Due Date + Arrow) */}
                        <div className="flex items-center gap-4">
                            <span className="text-[15px] font-medium text-[#111] whitespace-nowrap">
                                Due date {period.lastReportingDate}
                            </span>
                            <ChevronRight className="w-5 h-5 text-[#111] group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};
