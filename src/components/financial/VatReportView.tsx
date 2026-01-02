import React from 'react';
import { X, ExternalLink, Monitor, Printer, FileText, Download } from 'lucide-react';

interface VatReportViewProps {
    isOpen: boolean;
    onClose: () => void;
    companyName?: string;
    financialYear?: string;
    period?: string;
}

export const VatReportView: React.FC<VatReportViewProps> = ({
    isOpen,
    onClose,
    companyName = "Test company",
    financialYear = "2025-01-01 - 2025-12-31",
    period = "2025-12-01 - 2025-12-31"
}) => {
    if (!isOpen) return null;

    const formatAmount = (amount: number) => {
        const fixed = Math.abs(amount).toFixed(2);
        const [int, dec] = fixed.split('.');
        const withSpaces = int.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        const formatted = `${withSpaces}.${dec}`;
        return amount < 0 ? `(${formatted})` : formatted;
    };

    const sections = [
        {
            id: 'A',
            title: 'Sales subject to VAT or withdrawals excluding VAT',
            items: [
                { box: '05', label: 'Sales subject to VAT that are not included in another box below', codes: 'MP1+MP2+MP3', amount: 0 },
                { box: '06', label: 'Taxable withdrawals', codes: 'UT', amount: 0 },
                { box: '07', label: 'Tax base for profit margin taxation', codes: 'BVMB', amount: 0 },
                { box: '08', label: 'Rental income in case of voluntary tax liability', codes: 'HFS', amount: 0 },
            ]
        },
        {
            id: 'B',
            title: 'Output VAT on sales or withdrawals in box 05-08',
            items: [
                { box: '10', label: 'Output VAT 25%', codes: 'UT', amount: 0 },
                { box: '11', label: 'Output VAT 12%', codes: 'U2', amount: 0 },
                { box: '12', label: 'Output VAT 6%', codes: 'U3', amount: 0 },
            ]
        },
        {
            id: 'C',
            title: 'Purchases of services from another EU country',
            items: [
                { box: '20', label: 'Purchases of services from another EU country', codes: 'EU-TJ', amount: 0 },
                { box: '21', label: 'Purchases of goods from another EU country', codes: 'EU-V', amount: 0 },
                { box: '22', label: 'Purchases of services from outside EU', codes: 'U-EU', amount: 0 },
            ]
        },
        {
            id: 'D',
            title: 'Purchases of goods from another EU country',
            items: [
                { box: '30', label: 'Purchases of goods from another EU country', codes: 'D1', amount: 0 },
                { box: '31', label: 'Vat on purchases in box 30', codes: 'D2', amount: 0 },
            ]
        },
        {
            id: 'E',
            title: 'Import',
            items: [
                { box: '50', label: 'Taxable value on imports', codes: 'IMP', amount: 0 },
            ]
        },
        {
            id: 'F',
            title: 'Export m.m.',
            items: [
                { box: '39', label: 'Sales of services to another EU country', codes: 'E1', amount: 0 },
                { box: '40', label: 'Export of goods outside EU', codes: 'E2', amount: 0 },
            ]
        },
        {
            id: 'G',
            title: 'Other sales m.m.',
            items: [
                { box: '41', label: 'Other sales', codes: 'G1', amount: 0 },
                { box: '42', label: 'Other services', codes: 'G2', amount: 0 },
            ]
        },
        {
            id: 'H',
            title: 'Output VAT on purchases in boxes 20-47',
            items: [
                { box: '30', label: 'Output VAT 25%', codes: 'H1', amount: 0 },
                { box: '31', label: 'Output VAT 12%', codes: 'H2', amount: 0 },
                { box: '32', label: 'Output VAT 6%', codes: 'H3', amount: 0 },
            ]
        },
        {
            id: 'I',
            title: 'Input VAT',
            items: [
                { box: '48', label: 'Input VAT', codes: 'ING', amount: 0 },
            ]
        },
        {
            id: 'L',
            title: 'VAT to pay or receive',
            items: [
                { box: '49', label: 'VAT to pay or receive', codes: 'TAX', amount: 0 },
            ]
        }
    ];

    const generateReportHTML = () => {
        const reportContent = document.getElementById('vat-report-content')?.innerHTML;
        const styles = Array.from(document.styleSheets)
            .map(sheet => {
                try {
                    return Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n');
                } catch (e) {
                    return '';
                }
            })
            .join('\n');

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>VAT Report - ${companyName}</title>
                <style>
                    ${styles}
                    body { margin: 0; padding: 0; background: white; font-family: Arial, sans-serif; }
                    .report-print-container { padding: 1in; max-width: 210mm; margin: 0 auto; background: white; }
                    .print-hidden { display: none !important; }
                    hr { border: none; border-top: 1pt solid black; margin: 4pt 0; }
                    @media print {
                        .report-print-container { padding: 0; width: 100%; }
                    }
                </style>
            </head>
            <body>
                <div class="report-print-container">
                    ${reportContent}
                </div>
            </body>
            </html>
        `;
    };

    const handleOpenNewTab = () => {
        const html = generateReportHTML();
        const win = window.open('', '_blank');
        if (win) {
            win.document.write(html);
            win.document.close();
        }
    };

    const handleOpenNewWindow = () => {
        const html = generateReportHTML();
        const win = window.open('', '_blank', 'width=1000,height=900,menubar=no,status=no,toolbar=no');
        if (win) {
            win.document.write(html);
            win.document.close();
        }
    };

    const handleSavePDF = () => {
        const html = generateReportHTML();
        const win = window.open('', '_blank');
        if (win) {
            win.document.write(html);
            win.document.close();
            win.onload = () => {
                win.print();
            };
            // Fallback if onload doesn't trigger correctly in some browsers for document.write
            setTimeout(() => {
                win.print();
            }, 500);
        }
    };

    const handleSaveTXT = () => {
        let content = `VAT Report\n${companyName}\nFinancial Year: ${financialYear}\nPeriod: ${period}\n\n`;
        sections.forEach(s => {
            content += `${s.id}. ${s.title}\n`;
            content += '-'.repeat(40) + '\n';
            s.items.forEach(i => {
                const formattedAmt = formatAmount(i.amount);
                content += `${i.box} ${i.label.padEnd(60)} (${i.codes}) ${formattedAmt.padStart(15)} SEK\n`;
            });
            content += '\n';
        });

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `VAT_Report_${companyName.replace(/\s+/g, '_')}.txt`;
        a.click();
    };

    return (
        <div className="fixed inset-0 z-[60] flex justify-end bg-black/60 overflow-hidden">
            <div className="bg-white w-full max-w-[210mm] flex flex-col shadow-2xl animate-in slide-in-from-right duration-500 h-full origin-right">

                {/* Scrollable Report Content */}
                <div id="vat-report-content" className="flex-1 overflow-y-auto custom-scrollbar p-[1in] pt-12 pb-12 font-['Arial',_sans-serif] text-black leading-normal relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors print:hidden"
                    >
                        <X className="w-6 h-6 text-gray-400" />
                    </button>

                    <div className="text-center space-y-0 mb-6 font-sans">
                        <h1 className="text-[28pt] font-bold m-0 mb-[24pt]">VAT report</h1>
                        <h2 className="text-[20pt] font-semibold m-0 mb-[12pt]">{companyName}</h2>
                        <div className="text-[11pt] font-normal leading-tight mb-[18pt]">
                            <p className="m-0 font-sans">Financial Year {financialYear}</p>
                            <p className="m-0 font-sans">Period {period}</p>
                        </div>
                    </div>

                    <div className="space-y-[16pt]">
                        {sections.map(section => (
                            <div key={section.id} className="mb-[16pt]">
                                <h3 className="text-[12pt] font-bold m-0 mt-[16pt] mb-[8pt] flex items-center uppercase">
                                    <span>{section.id}.</span>
                                    <span className="ml-[4px] capitalize tracking-tight">{section.title}</span>
                                </h3>
                                <hr className="border-t-[1pt] border-black m-0 mt-[4pt] mb-[4pt] w-full" />
                                <div className="space-y-[4pt]">
                                    {section.items.map((item) => (
                                        <div key={item.box} className="flex text-[11pt] leading-normal items-start font-sans">
                                            <div className="w-[1.5cm] shrink-0 font-bold">{item.box}</div>
                                            <div className="flex-1 pr-4">
                                                {item.label} <span className="italic font-normal">({item.codes})</span>
                                            </div>
                                            <div className="w-[3cm] shrink-0 text-right">
                                                <span className="pr-2">{formatAmount(item.amount)}</span>
                                            </div>
                                            <div className="w-[1cm] shrink-0 text-right">SEK</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-[24pt]">
                        <h4 className="text-[11pt] font-bold m-0 mt-[12pt] mb-[6pt]">Control count: Block B</h4>
                        <div className="space-y-[4pt] text-[11pt]">
                            <div className="flex">
                                <span className="font-bold min-w-[70px]">VAT 25%</span>
                                <span className="w-[3cm] text-right ml-2">{formatAmount(0)}</span>
                                <span className="italic ml-4 font-normal">((MP1+UT+BVMB+HF5) * 0.25)</span>
                            </div>
                            <div className="flex">
                                <span className="font-bold min-w-[70px]">VAT 12%</span>
                                <span className="w-[3cm] text-right ml-2">{formatAmount(0)}</span>
                                <span className="italic ml-4 font-normal">(MP2 * 0.12)</span>
                            </div>
                            <div className="flex">
                                <span className="font-bold min-w-[70px]">VAT 6%</span>
                                <span className="w-[3cm] text-right ml-2">{formatAmount(0)}</span>
                                <span className="italic ml-4 font-normal">(MP3 * 0.06)</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-[10pt] mt-[16pt]">
                        What do I do if the VAT report is incorrect? <span className="underline cursor-pointer font-normal">Run VAT discrepancy report</span>
                    </div>
                </div>

                {/* GREEN PILL STICKY ACTION BUTTON BAR */}
                <div className="bg-white border-t border-[#E5E7EB] p-[16px_24px] print:hidden sticky bottom-0 z-10 flex flex-wrap items-center justify-center gap-4 min-h-[80px]">
                    <button
                        onClick={handleOpenNewTab}
                        className="inline-flex items-center gap-2 px-5 h-[42px] border-[1.5px] border-[#15803D] bg-white text-[#15803D] text-[14px] font-medium rounded-full hover:bg-[#F0FDF4] hover:border-[#166534] active:bg-[#DCFCE7] transition-all cursor-pointer whitespace-nowrap"
                    >
                        <ExternalLink size={16} strokeWidth={1.8} className="shrink-0" />
                        Open in a new tab
                    </button>

                    <button
                        onClick={handleOpenNewWindow}
                        className="inline-flex items-center gap-2 px-5 h-[42px] border-[1.5px] border-[#15803D] bg-white text-[#15803D] text-[14px] font-medium rounded-full hover:bg-[#F0FDF4] hover:border-[#166534] active:bg-[#DCFCE7] transition-all cursor-pointer whitespace-nowrap"
                    >
                        <Monitor size={16} strokeWidth={1.8} className="shrink-0" />
                        Open in a new window
                    </button>

                    <button
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-2 px-5 h-[42px] border-[1.5px] border-[#15803D] bg-white text-[#15803D] text-[14px] font-medium rounded-full hover:bg-[#F0FDF4] hover:border-[#166534] active:bg-[#DCFCE7] transition-all cursor-pointer whitespace-nowrap"
                    >
                        <Printer size={16} strokeWidth={1.8} className="shrink-0" />
                        Print
                    </button>

                    <button
                        onClick={handleSavePDF}
                        className="inline-flex items-center gap-2 px-5 h-[42px] border-[1.5px] border-[#15803D] bg-white text-[#15803D] text-[14px] font-medium rounded-full hover:bg-[#F0FDF4] hover:border-[#166534] active:bg-[#DCFCE7] transition-all cursor-pointer whitespace-nowrap"
                    >
                        <FileText size={16} strokeWidth={1.8} className="shrink-0" />
                        Save to PDF
                    </button>

                    <button
                        onClick={handleSaveTXT}
                        className="inline-flex items-center gap-2 px-5 h-[42px] border-[1.5px] border-[#15803D] bg-white text-[#15803D] text-[14px] font-medium rounded-full hover:bg-[#F0FDF4] hover:border-[#166534] active:bg-[#DCFCE7] transition-all cursor-pointer whitespace-nowrap"
                    >
                        <Download size={16} strokeWidth={1.8} className="shrink-0" />
                        Save to TXT-file
                    </button>
                </div>
            </div>
        </div>
    );
};
