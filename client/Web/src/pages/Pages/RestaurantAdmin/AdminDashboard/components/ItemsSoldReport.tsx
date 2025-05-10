import { useEffect, useState, useMemo } from 'react';
import { getItemsSoldByRestaurant } from '../../../../../services/order/order';
import { ArrowDown, ArrowUp, Search, FileText, Download, Printer, BarChart3 } from 'lucide-react';

interface ItemSold {
    productId: string;
    name: string;
    totalQuantity: number;
}

const ItemsSoldReport = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [items, setItems] = useState<ItemSold[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof ItemSold; direction: 'asc' | 'desc' }>({
        key: 'totalQuantity',
        direction: 'desc',
    });

    // Fetch items sold data
    useEffect(() => {
        const fetchItemsSold = async () => {
            try {
                setLoading(true);
                const data = await getItemsSoldByRestaurant();
                setItems(data);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching items sold:', err);
                setError(err.message || 'Failed to fetch items sold data');
            } finally {
                setLoading(false);
            }
        };

        fetchItemsSold();
    }, []);

    // Handle sorting
    const handleSort = (key: keyof ItemSold) => {
        setSortConfig((prevConfig) => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    // Filter and sort items
    const filteredAndSortedItems = useMemo(() => {
        let filteredItems = [...items];

        // Apply search filter
        if (searchTerm) {
            filteredItems = filteredItems.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        // Apply sorting
        filteredItems.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        return filteredItems;
    }, [items, searchTerm, sortConfig]);

    // Calculate total quantity sold
    const totalQuantitySold = useMemo(() => {
        return items.reduce((total, item) => total + item.totalQuantity, 0);
    }, [items]);

    // Export to CSV
    const exportToCSV = () => {
        const csvContent = [['Product ID', 'Product Name', 'Quantity Sold'], ...filteredAndSortedItems.map((item) => [item.productId, item.name, item.totalQuantity.toString()])]
            .map((row) => row.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'items_sold_report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Print report
    const printReport = () => {
        window.print();
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 print:shadow-none print:border-none">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 print:hidden">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Items Sold Report</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Showing items sold for orders with status "out for delivery"</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button onClick={exportToCSV} className="flex items-center px-3 py-2 bg-[#4361ee] text-white text-sm font-medium rounded-lg hover:bg-[#4361ee]/90 transition-colors">
                        <Download className="w-4 h-4 mr-1.5" />
                        Export CSV
                    </button>

                    <button
                        onClick={printReport}
                        className="flex items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        <Printer className="w-4 h-4 mr-1.5" />
                        Print
                    </button>
                </div>
            </div>

            {/* Print Header - Only visible when printing */}
            <div className="hidden print:block mb-6">
                <h1 className="text-2xl font-bold text-center">Items Sold Report</h1>
                <p className="text-center text-gray-600">
                    Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                </p>
            </div>

            {/* Search and Stats */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 print:hidden">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#4361ee] dark:focus:ring-[#4361ee] focus:border-[#4361ee] outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    />
                </div>

                <div className="bg-[#4361ee]/10 rounded-lg px-4 py-2 flex items-center">
                    <BarChart3 className="h-5 w-5 text-[#4361ee] mr-2" />
                    <span className="text-sm font-medium text-[#4361ee]">Total Items Sold: {totalQuantitySold}</span>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4361ee]"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg border border-red-200 dark:border-red-800 text-center">
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                    <button onClick={() => window.location.reload()} className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Try Again
                    </button>
                </div>
            ) : (
                <>
                    {/* Items Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
                            <thead className="text-xs text-gray-600 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-800/60">
                                <tr>
                                    <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('productId')}>
                                        <div className="flex items-center">
                                            Product ID
                                            {sortConfig.key === 'productId' && (
                                                <span className="ml-1">{sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}</span>
                                            )}
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('name')}>
                                        <div className="flex items-center">
                                            Product Name
                                            {sortConfig.key === 'name' && (
                                                <span className="ml-1">{sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}</span>
                                            )}
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 cursor-pointer" onClick={() => handleSort('totalQuantity')}>
                                        <div className="flex items-center">
                                            Quantity Sold
                                            {sortConfig.key === 'totalQuantity' && (
                                                <span className="ml-1">{sortConfig.direction === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}</span>
                                            )}
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAndSortedItems.length > 0 ? (
                                    filteredAndSortedItems.map((item, index) => (
                                        <tr
                                            key={item.productId}
                                            className={`${
                                                index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'
                                            } border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30`}
                                        >
                                            <td className="px-6 py-4 font-medium">{item.productId}</td>
                                            <td className="px-6 py-4">{item.name}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <span className="font-medium">{item.totalQuantity}</span>
                                                    <div className="ml-2 w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                                        <div
                                                            className="bg-[#4361ee] h-2.5 rounded-full"
                                                            style={{
                                                                width: `${Math.min(100, (item.totalQuantity / Math.max(...items.map((i) => i.totalQuantity))) * 100)}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                            <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">No items found</p>
                                            <p>Try adjusting your search or filters</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary for Print */}
                    <div className="hidden print:block mt-8">
                        <h2 className="text-xl font-bold mb-2">Summary</h2>
                        <div className="flex justify-between border-t border-b py-2 my-2">
                            <span className="font-medium">Total Items:</span>
                            <span>{items.length}</span>
                        </div>
                        <div className="flex justify-between border-b py-2 mb-2">
                            <span className="font-medium">Total Quantity Sold:</span>
                            <span>{totalQuantitySold}</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ItemsSoldReport;
