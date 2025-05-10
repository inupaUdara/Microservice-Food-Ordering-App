import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import Dropdown from '../../components/Dropdown';
import { setPageTitle } from '../../store/themeConfigSlice';
import { FormEvent, useEffect, useState } from 'react';
import IconPencilPaper from '../../components/Icon/IconPencilPaper';
import IconCoffee from '../../components/Icon/IconCoffee';
import IconCalendar from '../../components/Icon/IconCalendar';
import IconMapPin from '../../components/Icon/IconMapPin';
import IconMail from '../../components/Icon/IconMail';
import IconPhone from '../../components/Icon/IconPhone';
import IconTwitter from '../../components/Icon/IconTwitter';
import IconDribbble from '../../components/Icon/IconDribbble';
import IconGithub from '../../components/Icon/IconGithub';
import IconShoppingBag from '../../components/Icon/IconShoppingBag';
import IconTag from '../../components/Icon/IconTag';
import IconCreditCard from '../../components/Icon/IconCreditCard';
import IconClock from '../../components/Icon/IconClock';
import IconHorizontalDots from '../../components/Icon/IconHorizontalDots';
import IconUser from '../../components/Icon/IconUser';
import IconAward from '../../components/Icon/IconAward';
import IconHome from '../../components/Icon/IconHome';
import IconWheel from '../../components/Icon/IconWheel';

import IconStar from '../../components/Icon/IconStar';
import IconFile from '../../components/Icon/IconFile';


const Profile = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Profile'));
    }, [dispatch]);

    const currentUser = useSelector((state: IRootState) => state.userConfig.currentUser);
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;

    // Helper function to format address
    const formatAddress = (address: any) => {
        if (!address) return 'No address provided';

        const parts = [
            address.street,
            address.city,
            address.state,
            address.zipCode,
            address.country
        ].filter(Boolean);

        return parts.join(', ');
    };

    // Helper function to get vehicle icon
    const getVehicleIcon = (vehicleType: string) => {
        if (vehicleType === 'bike') {
            return <IconWheel className="w-5 h-5 shrink-0" />;
        } else if (vehicleType === 'three-wheeler') {
            return <IconWheel className="w-5 h-5 shrink-0" />;
        }
        return <IconWheel className="w-5 h-5 shrink-0" />;
    };

    // Helper function to format opening hours
    const formatOpeningHours = (hours: any[]) => {
        if (!hours || hours.length === 0) return 'No opening hours provided';

        return hours.map((hour, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
                <span className="font-semibold">{hour.day}:</span> {hour.open} - {hour.close}
            </div>
        ));
    };

    // Get profile picture based on role
    const getProfilePicture = () => {
        if (currentUser?.role === 'restaurant-admin' && currentUser?.restaurantProfile?.logo) {
            return currentUser.restaurantProfile.logo;
        } else if (currentUser?.role === 'delivery-person' && currentUser?.driverProfile?.profilePicture) {
            return currentUser.driverProfile.profilePicture;
        }
        return "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740";
    };

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="#" className="text-primary hover:underline">
                        Users
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Profile</span>
                </li>
            </ul>
            <div className="pt-5">
                <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-5 mb-5">
                    <div className="panel">
                        <div className="flex items-center justify-between mb-5">
                            <h5 className="font-semibold text-lg dark:text-white-light">Profile</h5>
                            <Link to="/users/user-account-settings" className="ltr:ml-auto rtl:mr-auto btn btn-primary p-2 rounded-full">
                                <IconPencilPaper />
                            </Link>
                        </div>

                        {/* Basic Profile Information */}
                        <div className="mb-5 flex flex-col sm:flex-row justify-center max-w-4xl mx-auto gap-10">
                            <div className="flex flex-col justify-center items-center">
                                <img
                                    src={getProfilePicture() || "/placeholder.svg"}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full object-cover mb-5 border-4 border-primary/30"
                                />
                                <p className="font-semibold text-primary text-xl">
                                    {currentUser?.firstName} {currentUser?.lastName}
                                </p>
                                <span className="badge bg-primary text-white mt-2">
                                    {currentUser?.role?.replace('-', ' ').toUpperCase()}
                                </span>
                            </div>

                            <div className="flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Common Information */}
                                    <div className="space-y-4">
                                        <h6 className="text-lg font-bold border-b pb-2">Basic Information</h6>
                                        <ul className="space-y-4 font-semibold text-white-dark">
                                            <li className="flex items-center gap-2">
                                                <IconUser className="shrink-0 text-primary" />
                                                <span className="text-gray-800 dark:text-gray-300">ID: {currentUser?.id}</span>
                                            </li>
                                            <li>
                                                <div className="flex items-center gap-2">
                                                    <IconMail className="w-5 h-5 shrink-0 text-primary" />
                                                    <span className="text-gray-800 dark:text-gray-300 truncate">{currentUser?.email}</span>
                                                </div>
                                            </li>
                                            {currentUser?.phone && (
                                                <li className="flex items-center gap-2">
                                                    <IconPhone className="text-primary" />
                                                    <span className="whitespace-nowrap text-gray-800 dark:text-gray-300" dir="ltr">
                                                        {currentUser.phone}
                                                    </span>
                                                </li>
                                            )}
                                            {currentUser?.address && (
                                                <li className="flex items-start gap-2">
                                                    <IconMapPin className="shrink-0 mt-1 text-primary" />
                                                    <span className="text-gray-800 dark:text-gray-300">
                                                        {formatAddress(currentUser.address)}
                                                    </span>
                                                </li>
                                            )}
                                        </ul>
                                    </div>

                                    {/* Role-Specific Information */}
                                    {currentUser?.role === 'restaurant-admin' && currentUser.restaurantProfile && (
                                        <div className="space-y-4">
                                            <h6 className="text-lg font-bold border-b pb-2">Restaurant Details</h6>
                                            <ul className="space-y-4 font-semibold text-white-dark">
                                                <li className="flex items-center gap-2">
                                                    <IconHome className="shrink-0 text-primary" />
                                                    <span className="text-gray-800 dark:text-gray-300">
                                                        {currentUser.restaurantProfile.restaurantName}
                                                    </span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <IconPhone className="shrink-0 text-primary" />
                                                    <span className="text-gray-800 dark:text-gray-300">
                                                        {currentUser.restaurantProfile.restaurantPhone}
                                                    </span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <IconMapPin className="shrink-0 mt-1 text-primary" />
                                                    <span className="text-gray-800 dark:text-gray-300">
                                                        {formatAddress(currentUser.restaurantProfile.restaurantAddress)}
                                                    </span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <IconTag className="shrink-0 text-primary" />
                                                    <span className="text-gray-800 dark:text-gray-300">
                                                        License: {currentUser.restaurantProfile.licenseNumber}
                                                    </span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <IconStar className="shrink-0 text-primary" />
                                                    <span className="text-gray-800 dark:text-gray-300">
                                                        Rating: {currentUser.restaurantProfile.rating}/5
                                                    </span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <IconAward className="shrink-0 text-primary" />
                                                    <span className="text-gray-800 dark:text-gray-300">
                                                        Status: {currentUser.restaurantProfile.isApproved ? 'Approved' : 'Pending Approval'}
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    )}

                                    {currentUser?.role === 'delivery-person' && currentUser.driverProfile && (
                                        <div className="space-y-4">
                                            <h6 className="text-lg font-bold border-b pb-2">Driver Details</h6>
                                            <ul className="space-y-4 font-semibold text-white-dark">
                                                <li className="flex items-center gap-2">
                                                    {getVehicleIcon(currentUser.driverProfile.vehicleType)}
                                                    <span className="text-gray-800 dark:text-gray-300">
                                                        Vehicle: {currentUser.driverProfile.vehicleType.replace('-', ' ')}
                                                    </span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <IconTag className="shrink-0 text-primary" />
                                                    <span className="text-gray-800 dark:text-gray-300">
                                                        Vehicle Number: {currentUser.driverProfile.vehicleNumber}
                                                    </span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <IconFile className="shrink-0 text-primary" />
                                                    <span className="text-gray-800 dark:text-gray-300">
                                                        License: {currentUser.driverProfile.licenseNumber}
                                                    </span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <IconStar className="shrink-0 text-primary" />
                                                    <span className="text-gray-800 dark:text-gray-300">
                                                        Rating: {currentUser.driverProfile.rating}/5
                                                    </span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <IconMapPin className="shrink-0 text-primary" />
                                                    <span className="text-gray-800 dark:text-gray-300">
                                                        Status: {currentUser.driverProfile.isAvailable ? 'Available' : 'Busy'}
                                                    </span>
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <IconShoppingBag className="shrink-0 text-primary" />
                                                    <span className="text-gray-800 dark:text-gray-300">
                                                        Active Orders: {currentUser.driverProfile.activeOrders?.length || 0}
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Additional Information Sections */}
                        {currentUser?.role === 'restaurant-admin' && currentUser.restaurantProfile?.openingHours?.length > 0 && (
                            <div className="mt-8 border-t pt-6">
                                <h6 className="text-lg font-bold mb-4">Opening Hours</h6>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {currentUser.restaurantProfile.openingHours.map((hour, index) => (
                                        <div key={index} className="p-3 border rounded-md">
                                            <div className="font-bold text-primary">{hour.day}</div>
                                            <div className="text-sm mt-1">{hour.open} - {hour.close}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {currentUser?.role === 'delivery-person' && currentUser.driverProfile?.documents?.length > 0 && (
                            <div className="mt-8 border-t pt-6">
                                <h6 className="text-lg font-bold mb-4">Documents</h6>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {currentUser.driverProfile.documents.map((doc, index) => (
                                        <div key={index} className="p-4 border rounded-md">
                                            <div className="font-bold text-primary capitalize mb-2">
                                                {doc.type.replace('-', ' ')}
                                            </div>
                                            {doc.url && (
                                                <div className="h-40 overflow-hidden rounded-md border">
                                                    <img
                                                        src={doc.url || "/placeholder.svg"}
                                                        alt={doc.type}
                                                        className="w-full h-full object-contain"
                                                    />
                                                </div>
                                            )}
                                            <div className="mt-2 text-sm">
                                                <span className={`badge ${doc.verified ? 'bg-success' : 'bg-warning'}`}>
                                                    {doc.verified ? 'Verified' : 'Pending Verification'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
