import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Clock, X, Leaf, Flame, ChefHat, Tag, DollarSign, CheckCircle, XCircle, Utensils, Info } from 'lucide-react';

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
    restaurantId: string;
    name: string;
    description?: string;
    category: 'Appetizers' | 'Main Course' | 'Desserts' | 'Beverages' | 'Sides';
    price: number;
    image?: string;
    availability: boolean;
    ingredients: string[];
    dietaryTags: ('vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free')[];
    customizations: Customization[];
    preparationTime: number;
    isVeg: boolean;
    spicyLevel: 'Mild' | 'Medium' | 'Hot';
}

interface MenuDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    menuItem: MenuItem | null;
}

const MenuModal = ({ isOpen, onClose, menuItem }: MenuDetailsModalProps) => {
    if (!isOpen || !menuItem) return null;

    // Helper function to get spicy level color
    const getSpicyLevelColor = (level: string) => {
        switch (level) {
            case 'Mild':
                return 'bg-green-100 text-green-800';
            case 'Medium':
                return 'bg-orange-100 text-orange-800';
            case 'Hot':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
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

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Backdrop */}
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-2xl transition-all">
                                {/* Image Header */}
                                {menuItem.image && (
                                    <div className="relative w-full h-56 bg-gray-200 dark:bg-gray-700">
                                        <img src={menuItem.image || '/placeholder.svg'} alt={menuItem.name} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                                        {/* Category Badge */}
                                        <div className="absolute top-4 left-4">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-800 shadow-sm">{menuItem.category}</span>
                                        </div>

                                        {/* Close Button */}
                                        <button
                                            type="button"
                                            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/90 text-gray-700 hover:bg-white transition-colors shadow-sm"
                                            onClick={onClose}
                                            aria-label="Close modal"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>

                                        {/* Title on image */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6">
                                            <Dialog.Title as="h3" className="text-3xl font-bold text-white">
                                                {menuItem.name}
                                            </Dialog.Title>

                                            {/* Price and Availability */}
                                            <div className="flex items-center mt-2 space-x-4">
                                                <span className="text-xl font-bold text-white flex items-center">
                                                    <DollarSign className="h-5 w-5 mr-0.5 text-white/80" />
                                                    {menuItem.price.toFixed(2)}
                                                </span>

                                                <span
                                                    className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        menuItem.availability ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    {menuItem.availability ? <CheckCircle className="h-3.5 w-3.5 mr-1" /> : <XCircle className="h-3.5 w-3.5 mr-1" />}
                                                    {menuItem.availability ? 'Available' : 'Unavailable'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* If no image, show header with title */}
                                {!menuItem.image && (
                                    <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
                                        <button
                                            type="button"
                                            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                                            onClick={onClose}
                                            aria-label="Close modal"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>

                                        <Dialog.Title as="h3" className="text-3xl font-bold text-white">
                                            {menuItem.name}
                                        </Dialog.Title>

                                        <div className="flex items-center mt-3 space-x-4">
                                            <span className="text-xl font-bold text-white flex items-center">
                                                <DollarSign className="h-5 w-5 mr-0.5 text-white/80" />
                                                {menuItem.price.toFixed(2)}
                                            </span>

                                            <span
                                                className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    menuItem.availability ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {menuItem.availability ? <CheckCircle className="h-3.5 w-3.5 mr-1" /> : <XCircle className="h-3.5 w-3.5 mr-1" />}
                                                {menuItem.availability ? 'Available' : 'Unavailable'}
                                            </span>

                                            <span className="text-sm text-white/90 font-medium">{menuItem.category}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Content */}
                                <div className="p-6">
                                    {/* Description */}
                                    {menuItem.description && (
                                        <div className="mb-6">
                                            <div className="flex items-center text-gray-500 dark:text-gray-400 mb-1">
                                                <Info className="h-4 w-4 mr-1.5" />
                                                <h4 className="font-medium">Description</h4>
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-300">{menuItem.description}</p>
                                        </div>
                                    )}

                                    {/* Quick Info */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-md bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                                <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Prep Time</p>
                                                <p className="text-base font-semibold text-gray-900 dark:text-white">{menuItem.preparationTime} min</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-md bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                                                <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Spice Level</p>
                                                <p className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${getSpicyLevelColor(menuItem.spicyLevel)}`}>
                                                    {menuItem.spicyLevel}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-md bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                                <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Vegetarian</p>
                                                <p className="text-base font-semibold text-gray-900 dark:text-white">{menuItem.isVeg ? 'Yes' : 'No'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

                                    {/* Ingredients */}
                                    {menuItem.ingredients.length > 0 && (
                                        <div className="mb-6">
                                            <div className="flex items-center text-gray-500 dark:text-gray-400 mb-3">
                                                <ChefHat className="h-4 w-4 mr-1.5" />
                                                <h4 className="font-medium">Ingredients</h4>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {menuItem.ingredients.map((ingredient, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600"
                                                    >
                                                        <Utensils className="h-3.5 w-3.5 mr-1.5 text-gray-500 dark:text-gray-400" />
                                                        {ingredient}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Dietary Tags */}
                                    {menuItem.dietaryTags.length > 0 && (
                                        <div className="mb-6">
                                            <div className="flex items-center text-gray-500 dark:text-gray-400 mb-3">
                                                <Tag className="h-4 w-4 mr-1.5" />
                                                <h4 className="font-medium">Dietary Information</h4>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {menuItem.dietaryTags.map((tag, index) => (
                                                    <span key={index} className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${getDietaryTagColor(tag)}`}>
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Customizations */}
                                    {menuItem.customizations.length > 0 && (
                                        <div>
                                            <div className="flex items-center text-gray-500 dark:text-gray-400 mb-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                                    />
                                                </svg>
                                                <h4 className="font-medium">Customizations</h4>
                                            </div>

                                            <div className="space-y-4">
                                                {menuItem.customizations.map((customization, index) => (
                                                    <div key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h5 className="font-medium text-gray-900 dark:text-white">{customization.name}</h5>
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 capitalize">
                                                                {customization.type}
                                                            </span>
                                                        </div>

                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                            {customization.options.map((option, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="flex items-center justify-between p-2 rounded-md bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600"
                                                                >
                                                                    <span className="text-gray-700 dark:text-gray-300">{option.label}</span>
                                                                    {option.price > 0 && (
                                                                        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">+${option.price.toFixed(2)}</span>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 transition-colors"
                                        onClick={onClose}
                                    >
                                        Close
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default MenuModal;
