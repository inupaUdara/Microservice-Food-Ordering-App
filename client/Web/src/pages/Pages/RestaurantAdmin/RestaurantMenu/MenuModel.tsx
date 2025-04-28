import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { ClockIcon, FireIcon } from '@heroicons/react/24/outline';
import { LeafIcon } from 'lucide-react';

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
    category: 'App,”etizers' | 'Main Course' | 'Desserts' | 'Beverages' | 'Sides';
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

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black bg-opacity-50" />
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
                            <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                {/* Header */}
                                <div className="flex justify-center items-start relative">
                                    <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-gray-900 dark:text-white text-center">
                                        {menuItem.name}
                                    </Dialog.Title>
                                    <button type="button" className="absolute right-0 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" onClick={onClose}>
                                        ✖️
                                    </button>
                                </div>

                                {/* Content with dividers */}
                                <div className="mt-6 divide-y divide-gray-200 dark:divide-gray-700">
                                    {/* Image */}
                                    {menuItem.image && (
                                        <div className="py-4">
                                            <div className="flex justify-center">
                                                <img src={menuItem.image} alt={menuItem.name} className="w-80 h-48 rounded-lg object-cover" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Details */}
                                    <div className="py-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">Description:</p>
                                                <p className="font-semibold text-gray-800 dark:text-white">{menuItem.description || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">Category:</p>
                                                <p className="font-semibold text-gray-800 dark:text-white">{menuItem.category}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">Price:</p>
                                                <p className="font-bold text-lg text-green-600 dark:text-green-400">${menuItem.price.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400">Availability:</p>
                                                <p className="font-semibold text-gray-800 dark:text-white">{menuItem.availability ? 'Available' : 'Unavailable'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400 flex items-center">
                                                    <ClockIcon className="h-5 w-5 mr-1 text-gray-400" />
                                                    Preparation Time:
                                                </p>
                                                <p className="font-semibold text-gray-800 dark:text-white">{menuItem.preparationTime} minutes</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400 flex items-center">
                                                    <FireIcon className="h-5 w-5 mr-1 text-gray-400" />
                                                    Spicy Level:
                                                </p>
                                                <p className="font-semibold text-gray-800 dark:text-white">{menuItem.spicyLevel}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 dark:text-gray-400 flex items-center">
                                                    <LeafIcon className="h-5 w-5 mr-1 text-gray-400" />
                                                    Vegetarian:
                                                </p>
                                                <p className="font-semibold text-gray-800 dark:text-white">{menuItem.isVeg ? 'Yes' : 'No'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ingredients */}
                                    {menuItem.ingredients.length > 0 && (
                                        <div className="py-4">
                                            <p className="text-gray-500 dark:text-gray-400">Ingredients:</p>
                                            <ul className="list-disc list-inside text-gray-800 dark:text-white">
                                                {menuItem.ingredients.map((ingredient, index) => (
                                                    <li key={index}>{ingredient}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Dietary Tags */}
                                    {menuItem.dietaryTags.length > 0 && (
                                        <div className="py-4">
                                            <p className="text-gray-500 dark:text-gray-400">Dietary Tags:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {menuItem.dietaryTags.map((tag, index) => (
                                                    <span key={index} className="px-3 py-1 rounded-full text-sm bg-green-200 dark:bg-green-700 text-green-800 dark:text-white">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Customizations */}
                                    {menuItem.customizations.length > 0 && (
                                        <div className="py-4">
                                            <p className="text-gray-500 dark:text-gray-400 mb-2">Customizations:</p>
                                            {menuItem.customizations.map((customization, index) => (
                                                <div key={index} className="mb-4">
                                                    <p className="font-semibold text-gray-800 dark:text-white">
                                                        {customization.name} ({customization.type})
                                                    </p>
                                                    <ul className="list-disc list-inside ml-4">
                                                        {customization.options.map((option, idx) => (
                                                            <li key={idx} className="text-gray-700 dark:text-gray-300">
                                                                {option.label} {option.price > 0 ? `(+$${option.price.toFixed(2)})` : ''}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
