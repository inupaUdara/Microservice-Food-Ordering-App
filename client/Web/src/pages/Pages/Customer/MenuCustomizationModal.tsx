import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { X, DollarSign, Check, ChevronDown, ChevronUp } from 'lucide-react';

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
    category: string;
    price: number;
    image: string | null;
    availability: boolean;
    ingredients: string[];
    dietaryTags: string[];
    customizations: Customization[];
    preparationTime: number;
    isVeg: boolean;
    spicyLevel: 'Mild' | 'Medium' | 'Hot';
}

interface MenuCustomizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    menuItem: MenuItem;
    onCustomizationDone: (itemId: string, selectedCustomizations: SelectedCustomizationsType, totalPrice: number) => void;
}

// Type for tracking selected customizations
type SelectedCustomizationsType = {
    [key: string]: string | string[];
};

const MenuCustomizationModal = ({ isOpen, onClose, menuItem, onCustomizationDone }: MenuCustomizationModalProps) => {
    const [selectedCustomizations, setSelectedCustomizations] = useState<SelectedCustomizationsType>({});
    const [totalPrice, setTotalPrice] = useState(menuItem.price);
    const [quantity, setQuantity] = useState(1);

    // Reset selections when menu item changes
    useEffect(() => {
        const initialSelections: SelectedCustomizationsType = {};

        // Initialize with default values
        menuItem.customizations.forEach((customization) => {
            if (customization.type === 'dropdown' && customization.options.length > 0) {
                initialSelections[customization.name] = customization.options[0].label;
            } else if (customization.type === 'radio' && customization.options.length > 0) {
                initialSelections[customization.name] = customization.options[0].label;
            } else if (customization.type === 'checkbox') {
                initialSelections[customization.name] = [];
            }
        });

        setSelectedCustomizations(initialSelections);
        setTotalPrice(menuItem.price);
        setQuantity(1);
    }, [menuItem]);

    // Calculate total price based on selected customizations
    useEffect(() => {
        let calculatedPrice = menuItem.price;

        menuItem.customizations.forEach((customization) => {
            if (customization.type === 'dropdown' || customization.type === 'radio') {
                const selectedOption = customization.options.find((option) => option.label === selectedCustomizations[customization.name]);
                if (selectedOption) {
                    calculatedPrice += selectedOption.price;
                }
            } else if (customization.type === 'checkbox') {
                const selectedOptions = (selectedCustomizations[customization.name] as string[]) || [];
                selectedOptions.forEach((selected) => {
                    const option = customization.options.find((opt) => opt.label === selected);
                    if (option) {
                        calculatedPrice += option.price;
                    }
                });
            }
        });

        setTotalPrice(calculatedPrice * quantity);
    }, [selectedCustomizations, menuItem, quantity]);

    const handleDropdownChange = (customizationName: string, value: string) => {
        setSelectedCustomizations((prev) => ({
            ...prev,
            [customizationName]: value,
        }));
    };

    const handleRadioChange = (customizationName: string, value: string) => {
        setSelectedCustomizations((prev) => ({
            ...prev,
            [customizationName]: value,
        }));
    };

    const handleCheckboxChange = (customizationName: string, value: string, checked: boolean) => {
        setSelectedCustomizations((prev) => {
            const currentSelections = (prev[customizationName] as string[]) || [];

            if (checked) {
                return {
                    ...prev,
                    [customizationName]: [...currentSelections, value],
                };
            } else {
                return {
                    ...prev,
                    [customizationName]: currentSelections.filter((item) => item !== value),
                };
            }
        });
    };

    const handleDone = () => {
        // Calculate price per item (without quantity)
        const pricePerItem = totalPrice / quantity;

        // Pass the selected customizations, total price, and item ID back to parent
        onCustomizationDone(menuItem._id, selectedCustomizations, pricePerItem);
        onClose();
    };

    const incrementQuantity = () => {
        setQuantity((prev) => prev + 1);
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                                {/* Header with image */}
                                <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700">
                                    <img src={menuItem.image || '/assets/images/default-food.jpg'} alt={menuItem.name} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

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
                                        <Dialog.Title as="h3" className="text-2xl font-bold text-white">
                                            {menuItem.name}
                                        </Dialog.Title>
                                        <p className="text-white/80 text-sm mt-1 line-clamp-2">{menuItem.description}</p>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="mb-6">
                                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Customize Your Order</h4>

                                        {menuItem.customizations.length === 0 ? (
                                            <div className="text-center py-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                <p className="text-gray-500 dark:text-gray-400">No customizations available for this item.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                {menuItem.customizations.map((customization, index) => (
                                                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                                        <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                                                            <h5 className="font-medium text-gray-800 dark:text-white">{customization.name}</h5>
                                                        </div>

                                                        <div className="p-4">
                                                            {customization.type === 'dropdown' && (
                                                                <select
                                                                    value={(selectedCustomizations[customization.name] as string) || ''}
                                                                    onChange={(e) => handleDropdownChange(customization.name, e.target.value)}
                                                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                                                >
                                                                    {customization.options.map((option, optIndex) => (
                                                                        <option key={optIndex} value={option.label}>
                                                                            {option.label} {option.price > 0 ? `(+LKR.${option.price.toFixed(2)})` : ''}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            )}

                                                            {customization.type === 'radio' && (
                                                                <div className="space-y-2">
                                                                    {customization.options.map((option, optIndex) => (
                                                                        <label
                                                                            key={optIndex}
                                                                            className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                                                        >
                                                                            <div className="flex items-center">
                                                                                <input
                                                                                    type="radio"
                                                                                    name={customization.name}
                                                                                    value={option.label}
                                                                                    checked={(selectedCustomizations[customization.name] as string) === option.label}
                                                                                    onChange={() => handleRadioChange(customization.name, option.label)}
                                                                                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 dark:border-gray-600"
                                                                                />
                                                                                <span className="ml-2 text-gray-700 dark:text-gray-300">{option.label}</span>
                                                                            </div>
                                                                            {option.price > 0 && (
                                                                                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">+LKR.{option.price.toFixed(2)}</span>
                                                                            )}
                                                                        </label>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            {customization.type === 'checkbox' && (
                                                                <div className="space-y-2">
                                                                    {customization.options.map((option, optIndex) => (
                                                                        <label
                                                                            key={optIndex}
                                                                            className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                                                                        >
                                                                            <div className="flex items-center">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    value={option.label}
                                                                                    checked={((selectedCustomizations[customization.name] as string[]) || []).includes(option.label)}
                                                                                    onChange={(e) => handleCheckboxChange(customization.name, option.label, e.target.checked)}
                                                                                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 rounded border-gray-300 dark:border-gray-600"
                                                                                />
                                                                                <span className="ml-2 text-gray-700 dark:text-gray-300">{option.label}</span>
                                                                            </div>
                                                                            {option.price > 0 && (
                                                                                <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">+LKR.{option.price.toFixed(2)}</span>
                                                                            )}
                                                                        </label>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Quantity selector and price */}
                                    <div className="flex items-center justify-between py-4 border-t border-b border-gray-200 dark:border-gray-700 mb-6">
                                        <div className="flex items-center">
                                            <span className="text-gray-700 dark:text-gray-300 mr-4">Quantity:</span>
                                            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                                                <button
                                                    type="button"
                                                    onClick={decrementQuantity}
                                                    disabled={quantity <= 1}
                                                    className="px-2 py-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                                                >
                                                    <ChevronDown className="w-4 h-4" />
                                                </button>
                                                <span className="px-4 py-1 text-gray-800 dark:text-white">{quantity}</span>
                                                <button type="button" onClick={incrementQuantity} className="px-2 py-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    <ChevronUp className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{totalPrice.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button type="button" onClick={handleDone} className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors flex items-center">
                                            <Check className="w-4 h-4 mr-2" />
                                            Done
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default MenuCustomizationModal;
