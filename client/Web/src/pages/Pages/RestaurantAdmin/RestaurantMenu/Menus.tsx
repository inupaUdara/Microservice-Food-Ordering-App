import { useEffect, useState } from 'react';
import { getAllMenuItems, deleteMenu } from '../../../../services/restaurant/restaurant';
import { getImageById, deleteImage } from '../../../../services/upload/upload';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { setPageTitle } from '../../../../store/themeConfigSlice';
import { DataTable } from 'mantine-datatable';
import { useDispatch } from 'react-redux';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import Loader from '../../../Components/Loader';
import MenuModel from './MenuModel';
import Swal from 'sweetalert2'; // NEW: import SweetAlert2

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

    if (loading) return <Loader />;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
                <Link to={'/create-menu'}>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200">Create New Menu Item</button>
                </Link>
                <div className="flex items-center gap-4">
                    <select
                        value={selectedCategory}
                        onChange={(e) => handleCategoryFilter(e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 rounded-md p-2 dark:bg-gray-700 dark:text-white"
                    >
                        <option value="">All Categories</option>
                        <option value="Appetizers">Appetizers</option>
                        <option value="Main Course">Main Course</option>
                        <option value="Desserts">Desserts</option>
                        <option value="Beverages">Beverages</option>
                        <option value="Sides">Sides</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Search menu items..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-64 dark:bg-gray-700 dark:text-white"
                    />
                </div>
            </div>

            {filteredMenuItems.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-400">No menu items found.</p>
            ) : (
                <div>
                    <div className="panel mt-6">
                        <h5 className="font-semibold text-lg dark:text-white-light mb-5">Menu Items</h5>
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
                                        render: (item) => <span className="text-gray-700 dark:text-gray-300">{item._id}</span>,
                                    },
                                    {
                                        accessor: 'name',
                                        title: 'Menu Item',
                                        render: (item) => (
                                            <div className="flex items-center gap-3">
                                                {item.imageUrl ? (
                                                    <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded" />
                                                ) : (
                                                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-500 dark:bg-gray-700">No Image</div>
                                                )}
                                                <span className="font-medium text-gray-800 dark:text-gray-200">{item.name}</span>
                                            </div>
                                        ),
                                    },
                                    {
                                        accessor: 'price',
                                        title: 'Price',
                                        render: (item) => <span className="text-gray-700 dark:text-gray-300">${item.price?.toFixed(2)}</span>,
                                    },
                                    {
                                        accessor: 'category',
                                        title: 'Category',
                                        render: (item) => <span className="text-gray-700 dark:text-gray-300">{item.category}</span>,
                                    },
                                    {
                                        accessor: 'availability',
                                        title: 'Status',
                                        render: (item) => (
                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${item.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {item.availability ? 'Available' : 'Unavailable'}
                                            </span>
                                        ),
                                    },
                                    {
                                        accessor: 'actions',
                                        title: 'Actions',
                                        render: (item) => (
                                            <div className="flex items-center gap-3">
                                                <button title="View" onClick={() => handleViewItem(item)}>
                                                    <Eye size={20} className="text-blue-500 hover:text-blue-700 cursor-pointer" />
                                                </button>
                                                <button title="Edit" onClick={() => handleEditItem(item)}>
                                                    <Pencil size={20} className="text-green-500 hover:text-green-700 cursor-pointer" />
                                                </button>
                                                <button type="button" title="Delete" onClick={() => handleDeleteItem(item)}>
                                                    <Trash2 size={20} className="text-red-500 hover:text-red-700 cursor-pointer" />
                                                </button>
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
                            />
                        </div>
                    </div>
                </div>
            )}

            <MenuModel isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} menuItem={selectedItem} />
        </div>
    );
};

export default Menus;
