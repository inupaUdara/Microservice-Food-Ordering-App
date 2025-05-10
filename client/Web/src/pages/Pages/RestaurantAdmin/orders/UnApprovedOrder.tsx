import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../../store/themeConfigSlice';
import { getOrderByRestaurantId, updateOrderStatus } from '../../../../services/order/order';
import Loader from '../../../Components/Loader';
import Swal from 'sweetalert2';
import DateSortingHeader from './components/DateSortingHeader';
import { sortByDate } from './utils/date-sorting';

type SortDirection = 'asc' | 'desc' | null;

const UnApprovedOrder = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Pending Orders'));
    }, [dispatch]);

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [recordsData, setRecordsData] = useState<any[]>([]);
    const [paginatedData, setPaginatedData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dateSortDirection, setDateSortDirection] = useState<SortDirection>(null);

    const showMessage = (msg = '', type = 'error') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const data = await getOrderByRestaurantId();
                // Filter for pending orders only
                const pendingOrders = data.filter((order: any) => order.status === 'pending');
                setRecordsData(pendingOrders);
                setError(null);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError('Failed to load pending orders. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, []);

    useEffect(() => {
        const sortedData = sortByDate(recordsData, 'createdAt', dateSortDirection);

        // Then paginate
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setPaginatedData(sortedData.slice(from, to));
    }, [page, pageSize, recordsData, dateSortDirection]);

    const handleDateSort = (direction: SortDirection) => {
        setDateSortDirection(direction);
        // Reset to first page when sorting changes
        setPage(1);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading) return <Loader />;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div>
            <div className="panel mt-6">
                <h5 className="font-semibold text-lg dark:text-white-light mb-5">Pending Orders</h5>
                <div className="datatables">
                    <DataTable
                        noRecordsText="No pending orders found"
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        records={paginatedData}
                        columns={[
                            {
                                accessor: '_id',
                                title: 'Order ID',
                                render: ({ _id }) => (
                                    <div className="flex items-center gap-4">
                                        <span className="font-semibold">{_id}</span>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'products',
                                title: 'Item Details',
                                render: ({ products }) => (
                                    <div className="flex items-start gap-4 flex-wrap">
                                        {products.map((product: any, index: number) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <img src={product.image || '/placeholder.svg'} alt={product.name} className="w-10 h-10 object-cover rounded" />
                                                <div className="flex flex-col">
                                                    <span className="font-semibold">{product.name}</span>
                                                    <span className="text-xs text-gray-500">Qty: {product.quantity}</span>
                                                    <span className="text-xs text-gray-500">Price: Rs. {product.price}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ),
                            },
                            {
                                accessor: 'shippingAddress',
                                title: 'Shipping Address',
                                render: ({ shippingAddress }) => (
                                    <div className="flex flex-col">
                                        <span>{shippingAddress.street}</span>
                                        <span className="text-xs text-gray-500">
                                            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                                        </span>
                                        <span className="text-xs text-gray-500">{shippingAddress.country}</span>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'createdAt',
                                title: <DateSortingHeader title="Date" onSort={handleDateSort} currentDirection={dateSortDirection} />,
                                render: ({ createdAt }) => <div>{formatDate(createdAt)}</div>,
                            },
                            {
                                accessor: 'status',
                                title: 'Status',
                                render: ({ _id, status }) => (
                                    <div className="flex items-center gap-4">
                                        <select
                                            value={status}
                                            onChange={async (e) => {
                                                const newStatus = e.target.value;
                                                try {
                                                    await updateOrderStatus(_id, { status: newStatus });
                                                    showMessage('Status updated successfully!', 'success');
                                                    setRecordsData((prev) =>
                                                        prev.map((order) => (order._id === _id ? { ...order, status: newStatus } : order)).filter((order) => order.status === 'pending')
                                                    );
                                                } catch (error) {
                                                    console.error('Failed to update status:', error);
                                                    showMessage('Failed to update status. Try again.', 'error');
                                                }
                                            }}
                                            className="border rounded p-1 dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="reject">Rejected</option>
                                        </select>
                                    </div>
                                ),
                            },
                        ]}
                        totalRecords={recordsData.length}
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
    );
};

export default UnApprovedOrder;
