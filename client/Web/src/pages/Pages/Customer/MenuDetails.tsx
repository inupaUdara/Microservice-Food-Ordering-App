import { useEffect, useState } from 'react';
import { getAllMenuDetailsByRestaurantId } from '../../../services/restaurant/restaurant';
import { useParams } from 'react-router-dom';
import AddToCartButton from './Order/AddToCartButton';
import IconHeart from '../../../components/Icon/IconHeart';
import IconEye from '../../../components/Icon/IconEye';

interface MenuDetailsProps {
    restaurant: any;
}

const MenuDetails = ({ restaurant }: MenuDetailsProps) => {
    const { id } = useParams();
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const data = await getAllMenuDetailsByRestaurantId(id);
                setMenuItems(data || []);
            } catch (error: any) {
                setError(error.message || 'Error fetching menu items');
                console.error('Error fetching menu items:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchMenuItems();
        }
    }, [id]);

    if (loading) {
        return <p className="text-center py-8 text-gray-700 dark:text-gray-300">Loading menu items...</p>;
    }
    if (error) {
        return <p className="text-center py-8 text-red-500 dark:text-red-400">{error}</p>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">All Menu Items</h1>
            {menuItems.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-400">No menu items found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItems.map((item: any) => (
                        <div
                            key={item._id}
                            className="flex flex-col max-w-[20rem] w-full mx-auto h-[500px] bg-white dark:bg-[#191e3a] shadow-[4px_6px_10px_-3px_#bfc9d4] rounded border border-white-light dark:border-[#1b2e4b] hover:scale-105 transition-transform duration-300"
                        >
                            <div className="flex-1 py-6 px-5 overflow-hidden flex flex-col">
                                {/* Image */}
                                <div className="-mt-6 mb-4 -mx-5 rounded-tl rounded-tr h-[160px] overflow-hidden">
                                    <img src={item.image || '/assets/images/default-food.jpg'} alt={item.name} className="w-full h-full object-cover" />
                                </div>

                                {/* Content */}
                                <div className="flex-1 overflow-auto">
                                    <p className="text-primary text-xs mb-1 font-bold">{item.category}</p>
                                    <h5 className="text-[#3b3f5c] text-[15px] font-bold mb-2 dark:text-white-light line-clamp-2">{item.name}</h5>

                                    <p className="text-white-dark text-sm mb-2 line-clamp-2">{item.description}</p>

                                    <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-400 mb-3">
                                        <span>
                                            <strong>Price:</strong> ${item.price}
                                        </span>
                                        <span>
                                            <strong>Availability:</strong> {item.availability ? 'Available' : 'Not Available'}
                                        </span>
                                        {item.dietaryTags?.length > 0 && (
                                            <span>
                                                <strong>Dietary:</strong> {item.dietaryTags.join(', ')}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="relative flex justify-between items-center mt-4 pt-3 border-t border-gray-200 dark:border-[#1b2e4b]">
                                    <div className="flex items-center font-semibold">
                                        <div className="w-8 h-8 rounded-full overflow-hidden inline-block mr-2">
                                            <span className="flex w-full h-full items-center justify-center bg-[#515365] text-white-light shrink-0">
                                                {restaurant.name?.slice(0, 2).toUpperCase() || 'RS'}
                                            </span>
                                        </div>
                                        <div className="text-[#515365] dark:text-white-dark text-sm">{restaurant.name || 'Restaurant'}</div>
                                    </div>

                                    <div className="flex font-semibold text-sm">
                                        <div className="text-primary flex items-center mr-2">
                                            <IconHeart className="w-4 h-4 mr-1" />
                                            {item.likes || 0}
                                        </div>
                                        <div className="text-primary flex items-center">
                                            <IconEye className="w-4 h-4 mr-1" />
                                            {item.views || 0}
                                        </div>
                                    </div>
                                </div>

                                {/* Add to cart button */}
                                <div className="mt-3">
                                    <AddToCartButton restaurantId={id!} item={item} restaurant={restaurant} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MenuDetails;
