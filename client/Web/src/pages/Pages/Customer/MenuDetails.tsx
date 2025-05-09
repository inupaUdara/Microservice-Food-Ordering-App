import { useEffect, useState } from 'react';
import { getAllMenuDetailsByRestaurantId } from '../../../services/restaurant/restaurant';
import { useParams } from 'react-router-dom';
import AddToCartButton from './Order/AddToCartButton';
import MenuCustomizationModal from './MenuCustomizationModal';
import { Search, Filter, Clock, Flame, Leaf, Tag, ShoppingBag, ChefHat, AlertCircle, Loader2, Heart, CirclePlus, Edit } from 'lucide-react';

interface CustomizationOption {
    label: string;
    price: number;
}

interface Customization {
    name: string;
    type: 'dropdown' | 'checkbox' | 'radio';
    options: CustomizationOption[];
}

interface MenuItem {
    _id: string;
    name: string;
    description: string;
    category: 'Appetizers' | 'Main Course' | 'Desserts' | 'Beverages' | 'Sides';
    price: number;
    image: string | null;
    availability: boolean;
    ingredients: string[];
    dietaryTags: ('vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free')[];
    customizations: Customization[];
    preparationTime: number;
    isVeg: boolean;
    spicyLevel: 'Mild' | 'Medium' | 'Hot';
}

// Type for tracking selected customizations
type SelectedCustomizationsType = {
    [key: string]: string | string[];
};

// Type for tracking customized prices
interface CustomizedItemInfo {
    customizations: SelectedCustomizationsType;
    customizedPrice: number;
    isCustomized: boolean;
}

interface MenuDetailsProps {
    restaurant: any;
}

const MenuDetails = ({ restaurant }: MenuDetailsProps) => {
    const { id } = useParams();
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

    // Track customized items and their prices
    const [customizedItems, setCustomizedItems] = useState<Record<string, CustomizedItemInfo>>({});

    // Get all unique categories from menu items
    const categories = menuItems.length ? ['All', ...new Set(menuItems.map((item) => item.category))] : ['All'];

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

    const toggleFavorite = (itemId: string) => {
        setFavorites((prev) => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(itemId)) {
                newFavorites.delete(itemId);
            } else {
                newFavorites.add(itemId);
            }
            return newFavorites;
        });
    };

    const openCustomizationModal = (item: MenuItem) => {
        setSelectedMenuItem(item);
        setIsCustomizationModalOpen(true);
    };

    const closeCustomizationModal = () => {
        setIsCustomizationModalOpen(false);
    };

    const handleCustomizationDone = (itemId: string, selectedCustomizations: SelectedCustomizationsType, customizedPrice: number) => {
        // Store the customizations and price for this item
        setCustomizedItems((prev) => ({
            ...prev,
            [itemId]: {
                customizations: selectedCustomizations,
                customizedPrice: customizedPrice,
                isCustomized: true,
            },
        }));
    };

    // Get the display price for an item (either base or customized)
    const getItemPrice = (item: MenuItem) => {
        if (customizedItems[item._id]?.isCustomized) {
            return customizedItems[item._id].customizedPrice;
        }
        return item.price;
    };

    // Filter menu items based on search term and selected category
    const filteredMenuItems = menuItems.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || !selectedCategory || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Helper function to get spicy level color
    const getSpicyLevelColor = (level: string) => {
        switch (level) {
            case 'Mild':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Medium':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Hot':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Helper function to get dietary tag color
    const getDietaryTagColor = (tag: string) => {
        switch (tag) {
            case 'vegetarian':
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'vegan':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'gluten-free':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'dairy-free':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
                <p className="text-lg text-gray-600 dark:text-gray-300">Loading menu items...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 max-w-md w-full">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 text-center mb-2">Error Loading Menu</h3>
                    <p className="text-red-600 dark:text-red-300 text-center">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header with search and filters */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white text-center mb-6">{restaurant?.name || 'Restaurant'} Menu</h1>

                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    {/* Search */}
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search menu items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-700 focus:border-emerald-500 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        />
                    </div>

                    {/* Category filter */}
                    <div className="relative w-full md:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Filter className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            value={selectedCategory || 'All'}
                            onChange={(e) => setSelectedCategory(e.target.value === 'All' ? null : e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-700 focus:border-emerald-500 outline-none transition-all appearance-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Results count */}
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {filteredMenuItems.length} of {menuItems.length} menu items
                    {selectedCategory && selectedCategory !== 'All' && (
                        <span>
                            {' '}
                            in <span className="font-medium text-emerald-600 dark:text-emerald-400">{selectedCategory}</span>
                        </span>
                    )}
                    {searchTerm && (
                        <span>
                            {' '}
                            matching "<span className="font-medium text-emerald-600 dark:text-emerald-400">{searchTerm}</span>"
                        </span>
                    )}
                </div>
            </div>

            {/* Menu items grid */}
            {filteredMenuItems.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                    <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No menu items found</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">Try adjusting your search or filter to find what you're looking for.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredMenuItems.map((item) => (
                        <div
                            key={item._id}
                            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full"
                        >
                            {/* Image with category badge */}
                            <div className="relative h-48 overflow-hidden">
                                <img src={item.image || '/assets/images/default-food.jpg'} alt={item.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
                                    <span className="px-2 py-1 bg-white/90 dark:bg-black/70 text-gray-800 dark:text-white text-xs font-medium rounded">{item.category}</span>
                                    <button
                                        onClick={() => toggleFavorite(item._id)}
                                        className={`p-1.5 rounded-full ${
                                            favorites.has(item._id) ? 'bg-red-500 text-white' : 'bg-white/90 dark:bg-black/70 text-gray-600 dark:text-gray-300 hover:text-red-500'
                                        } transition-colors`}
                                        aria-label={favorites.has(item._id) ? 'Remove from favorites' : 'Add to favorites'}
                                    >
                                        <Heart className="w-4 h-4" fill={favorites.has(item._id) ? 'currentColor' : 'none'} />
                                    </button>
                                </div>
                                {!item.availability && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <span className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">Currently Unavailable</span>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{item.name}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">{item.description}</p>

                                    {/* Quick info badges */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {item.preparationTime > 0 && (
                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {item.preparationTime} min
                                            </span>
                                        )}
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${getSpicyLevelColor(item.spicyLevel)}`}>
                                            <Flame className="w-3 h-3 mr-1" />
                                            {item.spicyLevel}
                                        </span>
                                        {item.isVeg && (
                                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800">
                                                <Leaf className="w-3 h-3 mr-1" />
                                                Vegetarian
                                            </span>
                                        )}
                                    </div>

                                    {/* Dietary tags */}
                                    {item.dietaryTags.length > 0 && (
                                        <div className="mb-3">
                                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                                                <Tag className="w-3 h-3 mr-1" />
                                                <span>Dietary Info:</span>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {item.dietaryTags.map((tag) => (
                                                    <span key={tag} className={`px-2 py-0.5 rounded-full text-xs border ${getDietaryTagColor(tag)}`}>
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Ingredients preview */}
                                    {item.ingredients.length > 0 && (
                                        <div className="mb-3">
                                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                                                <ChefHat className="w-3 h-3 mr-1" />
                                                <span>Ingredients:</span>
                                            </div>
                                            <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-1">{item.ingredients.join(', ')}</p>
                                        </div>
                                    )}

                                    {/* Customizations indicator */}
                                    {item.customizations.length > 0 && (
                                        <div className="mb-3">
                                            <div className="flex items-center text-xs text-emerald-600 dark:text-emerald-400">
                                                <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5"></span>
                                                <span>{item.customizations.length} customization options available</span>
                                            </div>

                                            {/* Show customized badge if item has been customized */}
                                            {customizedItems[item._id]?.isCustomized && (
                                                <div className="mt-1.5 flex items-center text-xs text-purple-600 dark:text-purple-400">
                                                    <span className="inline-block w-1.5 h-1.5 bg-purple-500 rounded-full mr-1.5"></span>
                                                    <span>Customized</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Price and actions */}
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        {/* If customized, show both prices */}
                                        {customizedItems[item._id]?.isCustomized && item.price !== getItemPrice(item) ? (
                                            <>
                                                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">${item.price.toFixed(2)}</span>
                                                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">${getItemPrice(item).toFixed(2)}</span>
                                            </>
                                        ) : (
                                            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">${getItemPrice(item).toFixed(2)}</span>
                                        )}
                                    </div>
                                    <div className="flex space-x-2">
                                        {item.customizations.length > 0 && (
                                            <button
                                                onClick={() => openCustomizationModal(item)}
                                                className={`p-2 rounded-full ${
                                                    customizedItems[item._id]?.isCustomized
                                                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                                } hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors`}
                                                aria-label={customizedItems[item._id]?.isCustomized ? 'Edit customizations' : 'Customize item'}
                                            >
                                                {customizedItems[item._id]?.isCustomized ? <Edit className="w-5 h-5" /> : <CirclePlus className="w-5 h-5" />}
                                            </button>
                                        )}
                                        <AddToCartButton
                                            restaurantId={id!}
                                            item={{
                                                ...item,
                                                // Pass the customized price to the cart
                                                price: getItemPrice(item),
                                                // You might want to pass the customizations as well
                                                // customizations: customizedItems[item._id]?.customizations || item.customizations
                                            }}
                                            restaurant={restaurant}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Customization Modal */}
            {selectedMenuItem && (
                <MenuCustomizationModal isOpen={isCustomizationModalOpen} onClose={closeCustomizationModal} menuItem={selectedMenuItem} onCustomizationDone={handleCustomizationDone} />
            )}
        </div>
    );
};

export default MenuDetails;
