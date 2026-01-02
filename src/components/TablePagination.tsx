import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Menu, Check } from 'lucide-react';

export type RowDensity = 'compact' | 'normal' | 'expanded';

export interface TablePaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    rowDensity: RowDensity;
    onRowDensityChange: (density: RowDensity) => void;
    totalItems?: number;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    rowDensity,
    onRowDensityChange,
    totalItems
}) => {
    const [isPageSelectorOpen, setIsPageSelectorOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsPageSelectorOpen(false);
            }
        };

        if (isPageSelectorOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPageSelectorOpen]);

    const handleDensityClick = () => {
        if (rowDensity === 'compact') onRowDensityChange('normal');
        else if (rowDensity === 'normal') onRowDensityChange('expanded');
        else onRowDensityChange('compact');
    };

    const getDensityLabel = () => {
        if (rowDensity === 'compact') return 'Compact rows';
        if (rowDensity === 'normal') return 'Comfortable rows';
        return 'Expanded rows';
    };

    // Generate page options (limit to reasonable number if too many pages)
    // For simplicity, we just show all or a range. Since the dropdown height is limited, we render all.
    const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex items-center gap-1.5 bg-[#F5F5F5] h-10 px-1.5 rounded select-none w-fit border border-gray-200">
            {/* Row Height Control */}
            <button
                onClick={handleDensityClick}
                className="p-1 rounded hover:bg-gray-200 text-[#5F6368] hover:text-[#1A73E8] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100"
                title={`Current: ${getDensityLabel()} (Click to change)`}
                aria-label={getDensityLabel()}
            >
                <Menu className="w-4 h-4" />
            </button>

            <div className="h-4 w-[1px] bg-gray-300 mx-1" />

            {/* Navigation Controls */}
            <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className={`p-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100 ${currentPage === 1
                        ? 'text-[#C4C7C5] cursor-not-allowed'
                        : 'text-[#5F6368] hover:bg-gray-200 hover:text-[#1A73E8]'
                    }`}
                aria-label="First page"
                title="First page"
            >
                <ChevronsLeft className="w-3.5 h-3.5" />
            </button>

            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`p-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100 ${currentPage === 1
                        ? 'text-[#C4C7C5] cursor-not-allowed'
                        : 'text-[#5F6368] hover:bg-gray-200 hover:text-[#1A73E8]'
                    }`}
                aria-label="Previous page"
                title="Previous page"
            >
                <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {/* Page Selector */}
            <div className="relative mx-1 h-6 flex items-center" ref={dropdownRef}>
                <button
                    onClick={() => setIsPageSelectorOpen(!isPageSelectorOpen)}
                    className="flex items-center gap-1 bg-white border border-[#DADCE0] rounded px-2 py-0.5 text-[13px] text-[#202124] hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
                    title="Select page"
                >
                    <span>{currentPage}</span>
                    <span className="text-[10px] text-[#5F6368]">▼</span>
                </button>

                {isPageSelectorOpen && (
                    <div className="absolute bottom-full left-0 mb-1 w-20 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded shadow-lg z-50 py-1">
                        {pageOptions.map(page => (
                            <button
                                key={page}
                                onClick={() => {
                                    onPageChange(page);
                                    setIsPageSelectorOpen(false);
                                }}
                                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-100 transition-colors ${page === currentPage ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-700'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <span className="text-[13px] text-[#5F6368] mx-1 font-medium">
                of {totalPages}
            </span>

            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`p-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100 ${currentPage === totalPages
                        ? 'text-[#C4C7C5] cursor-not-allowed'
                        : 'text-[#5F6368] hover:bg-gray-200 hover:text-[#1A73E8]'
                    }`}
                aria-label="Next page"
                title="Next page"
            >
                <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className={`p-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100 ${currentPage === totalPages
                        ? 'text-[#C4C7C5] cursor-not-allowed'
                        : 'text-[#5F6368] hover:bg-gray-200 hover:text-[#1A73E8]'
                    }`}
                aria-label="Last page"
                title="Last page"
            >
                <ChevronsRight className="w-3.5 h-3.5" />
            </button>
        </div>
    );
};
