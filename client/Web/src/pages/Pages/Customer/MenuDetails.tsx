import { useEffect, useState } from 'react';
import { getAllMenuDetailsByRestaurantId } from '../../../services/restaurant/restaurant';
import { useParams } from 'react-router-dom';
import AddToCartButton from './Order/AddToCartButton';

const MenuDetails = () => {
    const { id } = useParams();
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log('Restaurant ID from useParams:', id); // Debug
        const fetchMenuItems = async () => {
            try {
                const data = await getAllMenuDetailsByRestaurantId(id);
                console.log('Raw menu items:', data);
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

    if (loading) return <p className="text-center py-8 text-gray-700 dark:text-gray-300">Loading menu items...</p>;
    if (error) return <p className="text-center py-8 text-red-500 dark:text-red-400">{error}</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">All Menu Items</h1>
            {menuItems.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-400">No menu items found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItems.map((item: any) => (
                        <div key={item._id} className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                            {item.image && <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded-md mb-4" />}
                            <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">{item.name}</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-1">{item.description}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                <strong>Category:</strong> {item.category}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                <strong>Price:</strong> ${item.price}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                <strong>Availability:</strong> {item.availability ? 'Available' : 'Not Available'}
                            </p>
                            {item.dietaryTags?.length > 0 && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                    <strong>Dietary:</strong> {item.dietaryTags.join(', ')}
                                </p>
                            )}
                            {item.customizations?.length > 0 && (
                                <div className="mt-2">
                                    <p className="font-medium text-sm text-gray-700 dark:text-gray-200">Customizations:</p>
                                    <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300">
                                        {item.customizations.map((cust: any, i: number) => (
                                            <li key={i}>
                                                {cust.name} ({cust.type})
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                             <AddToCartButton restaurantId={id!} item={item} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MenuDetails;
