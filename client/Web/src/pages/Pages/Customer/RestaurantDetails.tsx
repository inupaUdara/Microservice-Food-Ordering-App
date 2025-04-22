// components/RestaurantDetails.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRestaurantById } from '../../../services/restaurant/restaurant';
import Loader from '../../Components/Loader';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';

const RestaurantDetails = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        dispatch(setPageTitle(`${restaurant?.restaurantName || 'Restaurant Details'}`));
    });

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                setLoading(true);
                const data = await getRestaurantById(id);
                setRestaurant(data);
                setError(null);
            } catch (error) {
                console.error('Error fetching restaurant:', error);
                setError('Failed to load restaurant details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurant();
    }, [id]);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    if (!restaurant) {
        return <div className="text-center py-10 text-gray-500">Restaurant not found</div>;
    }

    return (
        <div className="">
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/restaurants" className="text-primary hover:underline">
                        Browse
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <Link to="/restaurants" className="text-primary hover:underline">
                        Restaurants
                    </Link>
                </li>
                {restaurant.restaurantName && (
                    <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                        <span>{restaurant.restaurantName}</span>
                    </li>
                )}
            </ul>
            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                {/* Header with back button */}
                <div className="p-4 border-b dark:border-gray-700">
                    <h1 className="text-2xl font-bold mt-2 dark:text-white">{restaurant.restaurantName}</h1>
                </div>

                {/* Restaurant Content */}
                <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Left Column - Image */}
                        <div className="w-full md:w-1/3">
                            <img src={restaurant.logo || '/assets/images/profile-28.jpeg'} alt={restaurant.restaurantName} className="w-full rounded-lg border dark:border-gray-700" />
                            <div className="mt-4 flex items-center justify-center">
                                <span className="text-xl font-bold text-primary">★ {restaurant.rating || 0}</span>
                            </div>
                        </div>

                        {/* Right Column - Details */}
                        <div className="w-full md:w-2/3">
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold dark:text-white mb-2">Contact Information</h2>
                                <p className="dark:text-gray-300">
                                    <span className="font-medium">Phone:</span> {restaurant.restaurantPhone}
                                </p>
                                <p className="dark:text-gray-300">
                                    <span className="font-medium">Address:</span> {restaurant.restaurantAddress.street}, {restaurant.restaurantAddress.city}, {restaurant.restaurantAddress.state}{' '}
                                    {restaurant.restaurantAddress.zipCode}
                                </p>
                            </div>

                            <div className="mb-6">
                                <h2 className="text-lg font-semibold dark:text-white mb-2">Opening Hours</h2>
                                <div className="grid grid-cols-2 gap-2">
                                    {restaurant.openingHours.map((hours: any) => (
                                        <div key={hours._id} className="dark:text-gray-300">
                                            <span className="font-medium">{hours.day}:</span> {hours.open} - {hours.close}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold dark:text-white mb-2">Owner Information</h2>
                                <p className="dark:text-gray-300">
                                    <span className="font-medium">Name:</span> {restaurant.owner.firstName} {restaurant.owner.lastName}
                                </p>
                                <p className="dark:text-gray-300">
                                    <span className="font-medium">Email:</span> {restaurant.owner.email}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantDetails;
