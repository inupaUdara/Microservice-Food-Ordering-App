import { useEffect, useState } from 'react';
import IconEye from '../../../components/Icon/IconEye';
import IconHeart from '../../../components/Icon/IconHeart';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import { getAllRestaurants } from '../../../services/restaurant/restaurant';
import { Link } from 'react-router-dom';

const Restaurants = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Restaurants'));
    });

    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const data = await getAllRestaurants();
                setRestaurants(data);
            } catch (error) {
                console.error('Error fetching restaurants:', error);
            }
        };
        fetchRestaurants();
    }, []);
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="/restaurants" className="text-primary hover:underline">
                        Browse
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Restaurants</span>
                </li>
            </ul>
            <div className="mb-5 flex flex-wrap gap-6 pt-5">
                {restaurants.length === 0 ? (
                    <div>Loading restaurants...</div>
                ) : (
                    restaurants.map((restaurant: any) => (
                        <div
                            key={restaurant.id}
                            className="max-w-[22rem] w-full bg-white shadow rounded border border-white-light dark:border-[#1b2e4b] dark:bg-[#191e3a]"
                        >
                            <div className="py-7 px-6">
                                {/* Logo */}
                                <div className="-mt-7 mb-5 -mx-6 rounded-tl rounded-tr h-[180px] overflow-hidden flex items-center justify-center bg-gray-100">
                                    <img
                                        src={restaurant.logo || '/assets/images/profile-28.jpeg'}
                                        alt={restaurant.restaurantName}
                                        className="w-28 h-28 object-cover rounded-full border"
                                    />
                                </div>
                                {/* Restaurant Name */}
                                <h5 className="text-[#3b3f5c] text-lg font-bold mb-2 dark:text-white-light text-center">
                                    {restaurant.restaurantName}
                                </h5>
                                {/* City, State */}
                                <p className="text-sm text-gray-500 mb-2 text-center">
                                    {restaurant.restaurantAddress?.city}, {restaurant.restaurantAddress?.state}
                                </p>

                                {/* Rating */}
                                <div className="flex justify-center items-center text-primary font-semibold">
                                    <IconHeart className="w-4 h-4 mr-1" />
                                    {restaurant.rating || 0}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Restaurants;
