import { useSelector } from 'react-redux';
import DriverLocationUpdater from './LocationUpdater';
import { IRootState } from '../../../../store';
import DriverStatusToggle from './DriverStatusToggle';
import { useEffect, useState } from 'react';
import { getMe } from '../../../../services/me/me';
import Loader from '../../../Components/Loader';
import { Link } from 'react-router-dom';

const DriverDashboard = () => {
    const currentUser = useSelector((state: IRootState) => state.userConfig.currentUser);
    const [driver, setDriver] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDriverData = async () => {
            try {
                const driverData = await getMe();
                setDriver(driverData);
            } catch (err) {
                setError('Failed to load driver data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDriverData();
    }, []);

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader />
                <span className="ml-2">Loading dashboard...</span>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className={`bg-red-100 border-l-4 border-red-500 text-red-700 p-4 `}>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="">
            <ul className="flex space-x-2 rtl:space-x-reverse mb-4">
                <li>
                    <Link to="/orders" className="text-primary hover:underline">
                        Orders
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Overview</span>
                </li>
            </ul>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                <div className="bg-white rounded-lg shadow-md p-4 mb-4 min-h-fit">
                    <h2 className="text-lg font-semibold mb-4">Your Status</h2>
                    <DriverStatusToggle driverId={driver.driverProfile._id} initialStatus={driver.driverProfile.isAvailable} />
                </div>

                <div className="mb-4 max-h-fit">
                    <DriverLocationUpdater driverId={driver.driverProfile._id} updateInterval={15000} />
                </div>

                {/* Other dashboard components */}
            </div>
        </div>
    );
};

export default DriverDashboard;
