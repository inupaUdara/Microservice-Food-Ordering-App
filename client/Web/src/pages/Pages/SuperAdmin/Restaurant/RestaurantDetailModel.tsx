// components/RestaurantDetailsModal.tsx
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { getRestaurantById } from '../../../../services/restaurant/restaurant';
import Loader from '../../../Components/Loader';
import IconX from '../../../../components/Icon/IconX';

interface RestaurantDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    rowId: string | null;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
}

const RestaurantDetailsModal = ({ isOpen, onClose, rowId, onApprove, onReject }: RestaurantDetailsModalProps) => {
    const [restaurant, setRestaurant] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRestaurant = async () => {
            if (!rowId) return;

            try {
                setLoading(true);
                const data = await getRestaurantById(rowId);
                setRestaurant(data);
                setError(null);
            } catch (error) {
                console.error('Error fetching restaurant:', error);
                setError('Failed to load restaurant details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (isOpen && rowId) {
            fetchRestaurant();
        }
    }, [rowId, isOpen]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatOpeningHours = (hours: any[]) => {
        return hours.map((h) => `${h.day}: ${h.open} - ${h.close}`).join('\n');
    };

    if (!isOpen) return null;

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
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-between items-start">
                                    <Dialog.Title as="h3" className="text-xl font-bold leading-6 text-gray-900 dark:text-white">
                                        Restaurant Details
                                    </Dialog.Title>
                                    <button type="button" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" onClick={onClose}>
                                        <IconX className="w-6 h-6" />
                                    </button>
                                </div>

                                {loading ? (
                                    <div className="py-10">
                                        <Loader />
                                    </div>
                                ) : error ? (
                                    <div className="text-center py-10 text-red-500">{error}</div>
                                ) : restaurant ? (
                                    <div className="mt-6 space-y-6">
                                        {/* Restaurant Header */}
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="flex-shrink-0">
                                                <img src={restaurant.logo} alt={restaurant.restaurantName} className="w-32 h-32 rounded-lg object-cover border dark:border-gray-700" />
                                            </div>
                                            <div className="flex-grow">
                                                <h2 className="text-2xl font-bold dark:text-white">{restaurant.restaurantName}</h2>
                                                <div className="flex items-center mt-2">
                                                    <span className="text-yellow-500 text-lg">★ {restaurant.rating || 'N/A'}</span>
                                                    <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
                                                        {restaurant.isApproved ? <span className="text-green-500">Approved</span> : <span className="text-yellow-500">Pending Approval</span>}
                                                    </span>
                                                </div>
                                                <p className="mt-2 text-gray-600 dark:text-gray-300">License: {restaurant.licenseNumber}</p>
                                            </div>
                                        </div>

                                        {/* Details Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Contact Information */}
                                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                                <h3 className="font-semibold text-lg dark:text-white mb-3">Contact Information</h3>
                                                <div className="space-y-2">
                                                    <p className="text-gray-600 dark:text-gray-300">
                                                        <span className="font-medium">Phone:</span> {restaurant.restaurantPhone}
                                                    </p>
                                                    <p className="text-gray-600 dark:text-gray-300">
                                                        <span className="font-medium">Registered:</span> {formatDate(restaurant.createdAt)}
                                                    </p>
                                                    <p className="text-gray-600 dark:text-gray-300">
                                                        <span className="font-medium">Status:</span> {restaurant.isActive ? 'Active' : 'Inactive'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Address */}
                                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                                <h3 className="font-semibold text-lg dark:text-white mb-3">Address</h3>
                                                <address className="text-gray-600 dark:text-gray-300 not-italic">
                                                    {restaurant.restaurantAddress.street}
                                                    <br />
                                                    {restaurant.restaurantAddress.city}, {restaurant.restaurantAddress.state}
                                                    <br />
                                                    {restaurant.restaurantAddress.zipCode}
                                                    <br />
                                                    {restaurant.restaurantAddress.country}
                                                </address>
                                            </div>
                                        </div>

                                        {/* Opening Hours */}
                                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                            <h3 className="font-semibold text-lg dark:text-white mb-3">Opening Hours</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                {restaurant.openingHours.map((hours: any) => (
                                                    <div key={hours._id} className="text-gray-600 dark:text-gray-300">
                                                        <span className="font-medium">{hours.day}:</span> {hours.open} - {hours.close}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                            <button
                                                type="button"
                                                className="btn btn-outline-danger"
                                                onClick={() => {
                                                    if (rowId) onReject(rowId);
                                                    onClose();
                                                }}
                                                disabled={loading}
                                            >
                                                Reject
                                            </button>
                                            {!restaurant.isApproved && (
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() => {
                                                        if (rowId) onApprove(rowId);
                                                        onClose();
                                                    }}
                                                    disabled={loading}
                                                >
                                                    Approve
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-10 text-gray-500">Restaurant not found</div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default RestaurantDetailsModal;
