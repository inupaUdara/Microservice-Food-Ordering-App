import { useEffect, useState } from 'react';
import { getAllMenuItems } from '../../../../services/restaurant/restaurant';
import { getImageById } from '../../../../services/upload/upload';
import { useParams, Link } from 'react-router-dom';

const Menus = () => {
    const { id } = useParams();
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [filteredMenuItems, setFilteredMenuItems] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const data = await getAllMenuItems(id!);
                console.log('Fetched menu data:', data);

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
                setFilteredMenuItems(itemsWithImages); // Initialize filtered items
            } catch (error) {
                setError('Error fetching menu items');
                console.error('Error fetching menu items:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMenuItems();
    }, [id]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);

        const filtered = menuItems.filter((item) => item.name.toLowerCase().includes(value) || item.category?.toLowerCase().includes(value) || item.description?.toLowerCase().includes(value));

        setFilteredMenuItems(filtered);
    };

    if (loading) return <p className="text-center py-8 text-gray-700 dark:text-gray-300">Loading menu items...</p>;
    if (error) return <p className="text-center py-8 text-red-500 dark:text-red-400">{error}</p>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <Link to="/create-menu">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200">Create New Menu Item</button>
                </Link>
                <input
                    type="text"
                    placeholder="Search menu items..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-64 dark:bg-gray-700 dark:text-white"
                />
            </div>
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">All Menu Items</h1>
            {filteredMenuItems.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-400">No menu items found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMenuItems.map((item: any) => (
                        <div key={item._id} className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                            {item.imageUrl && <img src={item.imageUrl} alt={item.name} className="w-full h-40 object-cover rounded-md mb-4" />}
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Menus;
