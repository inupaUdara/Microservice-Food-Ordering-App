import type React from 'react';
import { useEffect, useState } from 'react';
import { getAllMenuItems, deleteMenu } from '../../../../services/restaurant/restaurant';
import { getImageById, deleteImage } from '../../../../services/upload/upload';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { setPageTitle } from '../../../../store/themeConfigSlice';
import { DataTable } from 'mantine-datatable';
import { useDispatch } from 'react-redux';
import { Eye, Pencil, Trash2, Search, Filter, Plus, ChevronDown, AlertTriangle } from 'lucide-react';
import Loader from '../../../Components/Loader';
import MenuModel from './MenuModel';
import Swal from 'sweetalert2';

const Menus = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [filteredMenuItems, setFilteredMenuItems] = useState<any[]>([]);
    const [paginatedData, setPaginatedData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    useEffect(() => {
        dispatch(setPageTitle('Menu Items'));
    }, [dispatch]);

    const fetchMenuItems = async () => {
        setLoading(true);
        try {
            const data = await getAllMenuItems(id!);

            const itemsWithImages = await Promise.all(
                (data || []).map(async (item: any) => {
                    if (item.image) {
                        if (item.image.startsWith('http')) {
                            return { ...item, imageUrl: item.image };
                        } else {
                            try {
                                const imageData = await getImageById(item.image);
                                return { ...item, imageUrl: imageData.url };
                            } catch (error) {
                                console.error('Error fetching image for item:', item.name, error);
                                return { ...item, imageUrl: null };
                            }
                        }
                    }
                    return { ...item, imageUrl: null };
                })
            );

            setMenuItems(itemsWithImages);
            setFilteredMenuItems(itemsWithImages);
        } catch (error) {
            setError('Error fetching menu items');
            console.error('Error fetching menu items:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenuItems();
    }, [id]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        filterMenuItems(value, selectedCategory);
    };

    const filterMenuItems = (searchValue: string, category: string) => {
        let filtered = menuItems;

        if (category) {
            filtered = filtered.filter((item) => item.category === category);
        }

        if (searchValue) {
            filtered = filtered.filter(
                (item) =>
                    item.name.toLowerCase().includes(searchValue) ||
                    item.category?.toLowerCase().includes(searchValue) ||
                    item.description?.toLowerCase().includes(searchValue) ||
                    item.ingredients?.some((ingredient: string) => ingredient.toLowerCase().includes(searchValue)) ||
                    item.dietaryTags?.some((tag: string) => tag.toLowerCase().includes(searchValue)) ||
                    item.spicyLevel?.toLowerCase().includes(searchValue)
            );
        }

        setFilteredMenuItems(filtered);
        setPage(1);
    };

    const handleCategoryFilter = (category: string) => {
        setSelectedCategory(category);
        filterMenuItems(searchTerm, category);
    };

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setPaginatedData(filteredMenuItems.slice(from, to));
    }, [page, pageSize, filteredMenuItems]);

    const handleViewItem = (item: any) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleEditItem = (item: any) => {
        navigate(`/edit-menu/${item._id}`);
    };

    const handleDeleteItem = async (item: any) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete this menu item?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            try {
                // Delete the menu item
                await deleteMenu(item._id);

                // Only delete the image if it's not an external URL
                if (item.image && !item.image.startsWith('http')) {
                    await deleteImage(item.image);
                }

                // Refresh the menu items from server
                await fetchMenuItems();

                Swal.fire('Deleted!', 'Menu item has been deleted.', 'success');
            } catch (error) {
                console.error('Error deleting item:', error);
                Swal.fire('Error', 'Failed to delete the menu item.', 'error');
            }
        }
    };

    const toggleDropdown = (id: string) => {
        if (activeDropdown === id) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(id);
        }
    };

    if (loading)
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader />
            </div>
        );

    if (error)
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 max-w-md w-full">
                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 text-center mb-2">Error Loading Menu</h3>
                    <p className="text-red-600 dark:text-red-300 text-center">{error}</p>
                </div>
            </div>
        );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header with actions */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Menu Management</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your restaurant's menu items ({filteredMenuItems.length} items)</p>
                </div>

                <Link to={'/create-menu'}>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg transition-colors flex items-center shadow-sm">
                        <Plus className="w-5 h-5 mr-2" />
                        <span>Create New Item</span>
                    </button>
                </Link>
            </div>

            {/* Search and filters */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search menu items..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-700 focus:border-emerald-500 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    {/* Category filter */}
                    <div className="relative w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Filter className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => handleCategoryFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-700 focus:border-emerald-500 outline-none transition-all appearance-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        >
                            <option value="">All Categories</option>
                            <option value="Appetizers">Appetizers</option>
                            <option value="Main Course">Main Course</option>
                            <option value="Desserts">Desserts</option>
                            <option value="Beverages">Beverages</option>
                            <option value="Sides">Sides</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu items list */}
            {filteredMenuItems.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No menu items found</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                        {searchTerm || selectedCategory ? "Try adjusting your search or filter to find what you're looking for." : 'Start by adding your first menu item.'}
                    </p>
                    {(searchTerm || selectedCategory) && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('');
                                setFilteredMenuItems(menuItems);
                            }}
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden py-3 px-4">
                    <div className="datatables">
                        <DataTable
                            noRecordsText="No menu items found"
                            highlightOnHover
                            className="whitespace-nowrap table-hover"
                            records={paginatedData}
                            columns={[
                                {
                                    accessor: '_id',
                                    title: 'Menu ID',
                                    render: (item, index) => <span className="text-gray-700 dark:text-gray-300 font-mono">M{String(index + 1).padStart(3, '0')}</span>,
                                },
                                {
                                    accessor: 'name',
                                    title: 'Menu Item',
                                    render: (item) => (
                                        <div className="flex items-center gap-3 py-2">
                                            {item.imageUrl ? (
                                                <img
                                                    src={item.imageUrl || '/placeholder.svg'}
                                                    alt={item.name}
                                                    className="w-14 h-14 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                                                />
                                            ) : (
                                                <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="font-medium text-gray-800 dark:text-gray-200">{item.name}</h3>
                                            </div>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'price',
                                    title: 'Price',
                                    render: (item) => (
                                        <div className="flex items-center text-gray-700 dark:text-gray-300">
                                            <h1 className=" text-gray-400">LKR.</h1>
                                            <span className="font-medium">{item.price?.toFixed(2)}</span>
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'category',
                                    title: 'Category',
                                    render: (item) => <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">{item.category}</span>,
                                },
                                {
                                    accessor: 'availability',
                                    title: 'Status',
                                    render: (item) => (
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                item.availability
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                            }`}
                                        >
                                            {item.availability ? 'Available' : 'Unavailable'}
                                        </span>
                                    ),
                                },
                                {
                                    accessor: 'actions',
                                    title: 'Actions',
                                    render: (item) => (
                                        <div className="relative">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleViewItem(item)}
                                                    className="p-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors"
                                                    title="View details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleEditItem(item)}
                                                    className="p-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-800/40 transition-colors"
                                                    title="Edit item"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteItem(item)}
                                                    className="p-1.5 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-800/40 transition-colors"
                                                    title="Delete item"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ),
                                },
                            ]}
                            totalRecords={filteredMenuItems.length}
                            recordsPerPage={pageSize}
                            page={page}
                            onPageChange={(p) => setPage(p)}
                            recordsPerPageOptions={PAGE_SIZES}
                            onRecordsPerPageChange={setPageSize}
                            minHeight={200}
                            paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
                            paginationSize="sm"
                            fontSize="sm"
                            rowClassName="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                            rowStyle={{ height: '70px' }}
                        />
                    </div>
                </div>
            )}

            {/* Menu Item Modal */}
            <MenuModel isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} menuItem={selectedItem} />
        </div>
    );
};

export default Menus;
