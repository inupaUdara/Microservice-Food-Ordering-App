import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../../store/themeConfigSlice';
import { getOrderById, getOrderByRestaurantId, updateOrderStatus } from '../../../../services/order/order';
import Loader from '../../../Components/Loader';
import Swal from 'sweetalert2';
import { geocodeAddress } from '../../../../services/location/mapService';
import { assignDriverToDelivery } from '../../../../services/driver/driver';

const ApprovedOrder = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPageTitle('Approved Orders'));
    }, [dispatch]);

    const [order, setOrder] = useState<any>(null);
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [recordsData, setRecordsData] = useState<any[]>([]);
    const [paginatedData, setPaginatedData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRecord, setSelectedRecord] = useState();

    const fetchOrderAndAssignDriver = async (orderId: string) => {
        setLoading(true);
        try {
            const data = await getOrderById(orderId);
            setOrder(data);
            setError(null);

            const restaurantAddress = [
                data.restaurant.restaurantAddress.street,
                data.restaurant.restaurantAddress.city,
                data.restaurant.restaurantAddress.country
            ].filter(Boolean).join(', ');

            const customerAddress = [
                data.shippingAddress.street,
                data.shippingAddress.city,
                data.shippingAddress.country
            ].filter(Boolean).join(', ');

            const [restaurantCoords, customerCoords] = await Promise.all([
                geocodeAddress(restaurantAddress),
                geocodeAddress(customerAddress)
            ]);

            const restaurantLocation = {
                type: "Point",
                coordinates: [restaurantCoords.lng, restaurantCoords.lat]
            };

            const deliveryLocation = {
                type: "Point",
                coordinates: [customerCoords.lng, customerCoords.lat]
            };

            await assignDriverToDelivery(data._id, restaurantLocation, deliveryLocation);
            console.log('Driver assigned successfully');
        } catch (error: any) {
            console.error('Detailed error:', error);

            if (error.response) {
                setError(error.response.data.message || 'Server error occurred.');
            } else {
                setError('Failed to process order. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    console.log('Records Data:', recordsData);
    console.log('Selected Record:', selectedRecord);

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
                // Filter for confirmed orders only
                const confirmedOrders = data.filter((order: any) => order.status === 'confirmed');
                setRecordsData(confirmedOrders);
                setError(null);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError('Failed to load approved orders. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, []);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        setPaginatedData(recordsData.slice(from, to));
    }, [page, pageSize, recordsData]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatOrderId = (index: number) => {
        return `#O${String(index + 1).padStart(3, '0')}`;
    };

    if (loading) return <Loader />;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div>
            <div className="panel mt-6">
                <h5 className="font-semibold text-lg dark:text-white-light mb-5">Approved Orders</h5>
                <div className="datatables">
                    <DataTable
                        noRecordsText="No approved orders found"
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
                                                <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded" />
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
                                title: 'Date',
                                render: ({ createdAt }) => <div>{formatDate(createdAt)}</div>,
                            },
                            {
                                accessor: 'status',
                                title: 'Status',
                                render: ({ _id, status }) => (
                                    <div className="flex items-center gap-4">
                                        <select
                                            value={status}
                                            placeholder="Select Status"
                                            onChange={async (e) => {
                                                const newStatus = e.target.value;
                                                try {
                                                    await updateOrderStatus(_id, { status: newStatus });
                                                    showMessage('Status updated successfully!', 'success');

                                                    setRecordsData((prev) =>
                                                        prev.map((order) => (order._id === _id ? { ...order, status: newStatus } : order))
                                                        .filter((order) => order.status === 'confirmed')
                                                    );

                                                    if (newStatus === 'out_for_delivery') {
                                                        const data = await getOrderById(_id);

                                                        const restaurantAddress = [
                                                            data.restaurant?.address?.street,
                                                            data.restaurant?.address?.city,
                                                            data.restaurant?.address?.country
                                                        ].filter(Boolean).join(', ');

                                                        const customerAddress = [
                                                            data.shippingAddress?.street,
                                                            data.shippingAddress?.city,
                                                            data.shippingAddress?.country
                                                        ].filter(Boolean).join(', ');

                                                        const [restaurantCoords, customerCoords] = await Promise.all([
                                                            geocodeAddress(restaurantAddress),
                                                            geocodeAddress(customerAddress)
                                                        ]);

                                                        const restaurantLocation = {
                                                            type: "Point",
                                                            coordinates: [restaurantCoords.lng, restaurantCoords.lat]
                                                        };

                                                        const deliveryLocation = {
                                                            type: "Point",
                                                            coordinates: [customerCoords.lng, customerCoords.lat]
                                                        };

                                                        await assignDriverToDelivery(data._id, restaurantLocation, deliveryLocation);
                                                        console.log('Driver assigned successfully');
                                                        showMessage('Driver assigned successfully!', 'success');
                                                    }
                                                } catch (error) {
                                                    console.error('Failed to update status or assign driver:', error);
                                                    showMessage('Failed to update status or assign driver. Try again.', 'error');
                                                }
                                            }}
                                            className="border rounded p-1 dark:bg-gray-700 dark:text-white"
                                        >
                                            <option value="preparing">Preparing</option>
                                            <option value="out_for_delivery">Out for Delivery</option>
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

export default ApprovedOrder;
