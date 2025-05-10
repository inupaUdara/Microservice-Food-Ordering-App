import type React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

type SortDirection = 'asc' | 'desc' | null;

interface DateSortingHeaderProps {
    title: string;
    onSort: (direction: SortDirection) => void;
    currentDirection: SortDirection;
}

const DateSortingHeader: React.FC<DateSortingHeaderProps> = ({ title, onSort, currentDirection }) => {
    const toggleSort = () => {
        if (currentDirection === null) {
            onSort('asc');
        } else if (currentDirection === 'asc') {
            onSort('desc');
        } else {
            onSort(null);
        }
    };

    return (
        <div className="flex items-center cursor-pointer select-none" onClick={toggleSort}>
            <span>{title}</span>
            <div className="flex flex-col ml-1">
                {currentDirection === 'asc' ? (
                    <ChevronUp className="h-4 w-4 text-gray-800" />
                ) : currentDirection === 'desc' ? (
                    <ChevronDown className="h-4 w-4 text-gray-800" />
                ) : (
                    <>
                        <ChevronUp className="h-4 w-4 text-gray-800" />
                        <ChevronDown className="h-4 w-4 text-gray-800" />
                    </>
                )}
            </div>
        </div>
    );
};

export default DateSortingHeader;
