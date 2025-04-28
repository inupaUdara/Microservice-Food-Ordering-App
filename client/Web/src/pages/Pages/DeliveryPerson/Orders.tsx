import { useEffect, useState } from 'react';
import DriverDashboard from './Location/DriverDashboard';
import { getDeliveryByDriverId } from '../../../services/delivery/delivery';
import { getMe } from '../../../services/me/me';
import Loader from '../../Components/Loader';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../store';

interface Location {
    latitude: number;
    longitude: number;
}

interface Delivery {
    pickupLocation: Location;
    deliveryLocation: Location;
    _id: string;
    orderId: string;
    driverId: string;
    status: string;
    estimatedTime: number;
    createdAt: string;
}

const Orders = () => {
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const currentUser = useSelector((state: IRootState) => state.userConfig.currentUser);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');



    useEffect(() => {
        const fetchDeliveries = async () => {
            try {
                const data = await getDeliveryByDriverId(currentUser && currentUser.driverProfile._id);
                setDeliveries(data);
            } catch (err) {
                setError('Failed to fetch deliveries');
            } finally {
                setLoading(false);
            }
        };

        // if (driver && driver.driverProfile && driver.driverProfile._id) {
            fetchDeliveries();
        // }
    }, [currentUser && currentUser.driverProfile._id]);

    const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    };

    if (loading)
        return (
            <div className="p-4 text-gray-600">
                <Loader />
            </div>
        );
    if (error) return <div className="p-4 text-red-500">{error}</div>;
    return (
        <div>
            <DriverDashboard />
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Deliveries</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {deliveries.map((delivery) => (
                        <div key={delivery._id} className="bg-white rounded-lg shadow-md p-4">
                            <div className="mb-4">
                                <h2 className="text-lg font-semibold mb-2">Order ID: {delivery.orderId}</h2>
                                <span
                                    className={`px-2 py-1 rounded text-sm ${
                                        delivery.status === 'assigned'
                                            ? 'bg-yellow-200 text-yellow-800'
                                            : delivery.status === 'in-transit'
                                            ? 'bg-blue-200 text-blue-800'
                                            : 'bg-green-200 text-green-800'
                                    }`}
                                >
                                    {delivery.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <h3 className="font-medium mb-1">Pickup Location</h3>
                                    <p className="text-sm text-gray-600">
                                        Lat: {delivery.pickupLocation.latitude.toFixed(6)}
                                        <br />
                                        Lng: {delivery.pickupLocation.longitude.toFixed(6)}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-medium mb-1">Delivery Location</h3>
                                    <p className="text-sm text-gray-600">
                                        Lat: {delivery.deliveryLocation.latitude.toFixed(6)}
                                        <br />
                                        Lng: {delivery.deliveryLocation.longitude.toFixed(6)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-between text-sm">
                                <div>
                                    <p className="text-gray-600">Estimated Time: {formatTime(delivery.estimatedTime)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Created: {new Date(delivery.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {deliveries.length === 0 && !loading && <div className="text-gray-500">No deliveries found</div>}
            </div>
        </div>
    );
};

export default Orders;
