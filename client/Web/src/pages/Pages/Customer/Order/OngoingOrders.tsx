import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../../store/themeConfigSlice';
import { Link, useNavigate } from 'react-router-dom';
import { getAllUserOrders } from '../../../../services/order/order';
import Loader from '../../../Components/Loader';

const OngoingOrders = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setPageTitle('My Orders'));
    }, [dispatch]);

    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await getAllUserOrders();
                console.log('Response:', response);
                // Make sure the response contains the orders array
                const ordersData = response?.orders || response?.data?.orders || response;
                setOrders(Array.isArray(ordersData) ? ordersData : []);
                setError(null);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError('Failed to load orders. Please try again later.');
                setOrders([]); // Ensure orders is always an array
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    console.log('Orders:', orders);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        const statusMap: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            preparing: 'bg-purple-100 text-purple-800',
            out_for_delivery: 'bg-orange-100 text-orange-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return statusMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    if (loading) return <Loader />;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/ongoing-orders" className="text-primary hover:underline">
                        Orders
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span> Ongoing Orders</span>
                </li>
            </ul>

            <div className="pt-5">
                {!orders || orders.length === 0 ? (
                    <div className="text-center py-10">
                        <div className="text-gray-500 text-lg mb-4">No orders found</div>
                        <Link to="/restaurants" className="btn btn-primary">
                            Browse Restaurants
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                onClick={() => navigate(`/ongoing-orders/${order._id}`)}
                                className="bg-white shadow rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a] p-4 cursor-pointer hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold dark:text-white">
                                            Order #{order._id?.substring(18, 24)?.toUpperCase()}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {order.createdAt ? formatDate(order.createdAt) : 'Date not available'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(order.status || 'pending')}`}>
                                            {order.status?.replace(/_/g, ' ') || 'Pending'}
                                        </span>
                                        <span className="font-bold text-primary">
                                            {formatCurrency(order.grandTotal || 0)}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        {order.products?.length || 0} item{order.products?.length !== 1 ? 's' : ''} • {order.shippingAddress?.city || 'Location not specified'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OngoingOrders;
