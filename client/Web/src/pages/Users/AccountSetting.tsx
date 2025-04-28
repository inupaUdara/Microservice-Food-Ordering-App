import { Link } from 'react-router-dom';
import { FormEvent, useEffect, useState } from 'react';
import { setPageTitle } from '../../store/themeConfigSlice';
import { useDispatch, useSelector } from 'react-redux';
import IconHome from '../../components/Icon/IconHome';
import IconDollarSignCircle from '../../components/Icon/IconDollarSignCircle';
import IconUser from '../../components/Icon/IconUser';
import IconPhone from '../../components/Icon/IconPhone';
import IconLinkedin from '../../components/Icon/IconLinkedin';
import IconTwitter from '../../components/Icon/IconTwitter';
import IconFacebook from '../../components/Icon/IconFacebook';
import IconGithub from '../../components/Icon/IconGithub';
import { IRootState } from '../../store';
import { updateFailure, updateStart, updateSuccess } from '../../store/userConfigSlice';
import Swal from 'sweetalert2';
import IconLockDots from '../../components/Icon/IconLockDots';
import IconWheel from '../../components/Icon/IconWheel';

const AccountSetting = () => {
    const currentUser = useSelector((state: IRootState) => state.userConfig.currentUser);
    const dispatch = useDispatch();
    const [tabs, setTabs] = useState<string>('profile');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
        },
        ...(currentUser?.role === 'delivery-person' && {
            vehicleType: '',
            vehicleNumber: '',
            licenseNumber: '',
        }),
        ...(currentUser?.role === 'restaurant-admin' && {
            restaurantName: '',
            restaurantPhone: '',
            restaurantAddress: {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: '',
            },
            openingHours: [],
        }),
    });

    useEffect(() => {
        dispatch(setPageTitle('Account Setting'));
        if (currentUser) {
            setFormData({
                firstName: currentUser.firstName || '',
                lastName: currentUser.lastName || '',
                email: currentUser.email || '',
                phone: currentUser.phone || '',
                address: currentUser.address || {
                    street: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    country: '',
                },
                ...(currentUser.driverProfile && {
                    vehicleType: currentUser.driverProfile.vehicleType,
                    vehicleNumber: currentUser.driverProfile.vehicleNumber,
                    licenseNumber: currentUser.driverProfile.licenseNumber,
                }),
                ...(currentUser.restaurantProfile && {
                    restaurantName: currentUser.restaurantProfile.restaurantName,
                    restaurantPhone: currentUser.restaurantProfile.restaurantPhone,
                    restaurantAddress: currentUser.restaurantProfile.restaurantAddress,
                    openingHours: currentUser.restaurantProfile.openingHours,
                }),
            });
        }
    }, [currentUser, dispatch]);

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email) ? '' : 'Invalid email address';
    };

    const validatePhone = (phone: string) => {
        const re = /^\+?(\d[\d-. ]+)?(\([\d-. ]+\))?[\d-. ]+\d$/;
        const digits = phone.replace(/\D/g, '');
        if (!re.test(phone)) return 'Invalid phone number format';
        if (digits.length < 10) return 'Phone number must have at least 10 digits';
        return '';
    };

    const showErrorMessage = (msg = '', type = 'error') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    const showSuccessMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: { ...prev.address, [field]: value }
            }));
            setErrors(prev => ({ ...prev, address: { ...prev.address, [field]: '' } }));
        } else if (name.startsWith('restaurantAddress.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                restaurantAddress: { ...prev.restaurantAddress, [field]: value }
            }));
            setErrors(prev => ({ ...prev, restaurantAddress: { ...prev.restaurantAddress, [field]: '' } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleOpeningHoursChange = (index: number, field: 'open' | 'close', value: string) => {
        const updatedHours = formData.openingHours.map((hour, i) =>
            i === index ? { ...hour, [field]: value } : hour
        );
        setFormData(prev => ({ ...prev, openingHours: updatedHours }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationErrors: any = {
            email: validateEmail(formData.email),
            phone: validatePhone(formData.phone),
            ...(currentUser?.role === 'delivery-person' && {
                vehicleType: !formData.vehicleType ? 'Vehicle type is required' : '',
                vehicleNumber: !formData.vehicleNumber ? 'Vehicle number is required' : '',
                licenseNumber: !formData.licenseNumber ? 'License number is required' : '',
            }),
            ...(currentUser?.role === 'restaurant-admin' && {
                restaurantName: !formData.restaurantName ? 'Restaurant name is required' : '',
                restaurantPhone: validatePhone(formData.restaurantPhone),
            }),
        };

        setErrors(validationErrors);

        if (Object.values(validationErrors).some(error => error !== '')) {
            showErrorMessage('Please correct the form errors');
            return;
        }

        try {
            dispatch(updateStart());
            const res = await fetch(`/api/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                dispatch(updateFailure(data.message));
                showErrorMessage(data.message);
            } else {
                dispatch(updateSuccess(data));
                showSuccessMessage("Profile updated successfully");
            }
        } catch (error) {
            dispatch(updateFailure((error as Error).message));
            showErrorMessage((error as Error).message);
        }
    };

    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link to="#" className="text-primary hover:underline">
                        Profile
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Account Settings</span>
                </li>
            </ul>

            <div className="pt-5">
                <div className="flex items-center justify-between mb-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Settings</h5>
                </div>

                <div>
                    <ul className="sm:flex font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5 whitespace-nowrap overflow-y-auto">
                        <li className="inline-block">
                            <button
                                onClick={() => setTabs('profile')}
                                className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'profile' ? '!border-primary text-primary' : ''}`}
                            >
                                <IconUser />
                                Profile
                            </button>
                        </li>
                        {currentUser?.role === 'restaurant-admin' && (
                            <li className="inline-block">
                                <button
                                    onClick={() => setTabs('restaurant')}
                                    className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'restaurant' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconHome />
                                    Restaurant
                                </button>
                            </li>
                        )}
                        {currentUser?.role === 'delivery-person' && (
                            <li className="inline-block">
                                <button
                                    onClick={() => setTabs('vehicle')}
                                    className={`flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tabs === 'vehicle' ? '!border-primary text-primary' : ''}`}
                                >
                                    <IconWheel />
                                    Vehicle
                                </button>
                            </li>
                        )}
                    </ul>
                </div>

                {tabs === 'profile' && (
                    <form className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black" onSubmit={handleSubmit}>
                        <h6 className="text-lg font-bold mb-5">Personal Information</h6>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    className="form-input"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                            </div>
                            <div>
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    className="form-input"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                            </div>
                            <div>
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    className="form-input"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>
                            <div>
                                <label htmlFor="phone">Phone</label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    className="form-input"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                            </div>
                            <div className="sm:col-span-2">
                                <button type="submit" className="btn btn-primary">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {tabs === 'restaurant' && currentUser?.role === 'restaurant-admin' && (
                    <form className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black" onSubmit={handleSubmit}>
                        <h6 className="text-lg font-bold mb-5">Restaurant Information</h6>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="restaurantName">Restaurant Name</label>
                                <input
                                    id="restaurantName"
                                    name="restaurantName"
                                    type="text"
                                    className="form-input"
                                    value={formData.restaurantName}
                                    onChange={handleChange}
                                />
                                {errors.restaurantName && <p className="text-red-500 text-sm mt-1">{errors.restaurantName}</p>}
                            </div>
                            <div>
                                <label htmlFor="restaurantPhone">Restaurant Phone</label>
                                <input
                                    id="restaurantPhone"
                                    name="restaurantPhone"
                                    type="text"
                                    className="form-input"
                                    value={formData.restaurantPhone}
                                    onChange={handleChange}
                                />
                                {errors.restaurantPhone && <p className="text-red-500 text-sm mt-1">{errors.restaurantPhone}</p>}
                            </div>
                            {/* Add restaurant address fields here */}
                            <div>
                                <label htmlFor="restaurantAddress.street">Street</label>
                                <input
                                    id="restaurantAddress.street"
                                    name="restaurantAddress.street"
                                    type="text"
                                    className="form-input"
                                    value={formData.restaurantAddress.street}
                                    onChange={handleChange}
                                />
                                {errors.restaurantAddress?.street && <p className="text-red-500 text-sm mt-1">{errors.restaurantAddress.street}</p>}
                            </div>
                            <div>
                                <label htmlFor="restaurantAddress.city">City</label>
                                <input
                                    id="restaurantAddress.city"
                                    name="restaurantAddress.city"
                                    type="text"
                                    className="form-input"
                                    value={formData.restaurantAddress.city}
                                    onChange={handleChange}
                                />
                                {errors.restaurantAddress?.city && <p className="text-red-500 text-sm mt-1">{errors.restaurantAddress.city}</p>}
                            </div>
                            <div>
                                <label htmlFor="restaurantAddress.state">State</label>
                                <input
                                    id="restaurantAddress.state"
                                    name="restaurantAddress.state"
                                    type="text"
                                    className="form-input"
                                    value={formData.restaurantAddress.state}
                                    onChange={handleChange}
                                />
                                {errors.restaurantAddress?.state && <p className="text-red-500 text-sm mt-1">{errors.restaurantAddress.state}</p>}
                            </div>
                            <div>
                                <label htmlFor="restaurantAddress.zipCode">Zip Code</label>
                                <input
                                    id="restaurantAddress.zipCode"
                                    name="restaurantAddress.zipCode"
                                    type="text"
                                    className="form-input"
                                    value={formData.restaurantAddress.zipCode}
                                    onChange={handleChange}
                                />
                                {errors.restaurantAddress?.zipCode && <p className="text-red-500 text-sm mt-1">{errors.restaurantAddress.zipCode}</p>}
                            </div>
                            <div>
                                <label htmlFor="restaurantAddress.country">Country</label>
                                <input
                                    id="restaurantAddress.country"
                                    name="restaurantAddress.country"
                                    type="text"
                                    className="form-input"
                                    value={formData.restaurantAddress.country}
                                    onChange={handleChange}
                                />
                                {errors.restaurantAddress?.country && <p className="text-red-500 text-sm mt-1">{errors.restaurantAddress.country}</p>}
                            </div>
                            <div>
                                <label htmlFor="openingHours">Opening Hours</label>
                                {formData.openingHours.map((hour, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input
                                            type="time"
                                            value={hour.open}
                                            onChange={(e) => handleOpeningHoursChange(index, 'open', e.target.value)}
                                            className="form-input"
                                        />
                                        <input
                                            type="time"
                                            value={hour.close}
                                            onChange={(e) => handleOpeningHoursChange(index, 'close', e.target.value)}
                                            className="form-input"
                                        />
                                    </div>
                                ))}
                                {/* <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, openingHours: [...prev.openingHours, { open: '', close: '' }] }))}
                                    className="btn btn-secondary"
                                >
                                    Add Opening Hour
                                </button> */}
                                {errors.openingHours && <p className="text-red-500 text-sm mt-1">{errors.openingHours}</p>}
                            </div>


                            <div className="sm:col-span-2">
                                <button type="submit" className="btn btn-primary">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {tabs === 'vehicle' && currentUser?.role === 'delivery-person' && (
                    <form className="border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-5 bg-white dark:bg-black" onSubmit={handleSubmit}>
                        <h6 className="text-lg font-bold mb-5">Vehicle Information</h6>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="vehicleType">Vehicle Type</label>
                                <select
                                    id="vehicleType"
                                    name="vehicleType"
                                    className="form-select"
                                    value={formData.vehicleType}
                                    onChange={handleChange}
                                >
                                    <option value="">Select Vehicle Type</option>
                                    <option value="bike">Bike</option>
                                    <option value="three-wheeler">Three Wheeler</option>
                                </select>
                                {errors.vehicleType && <p className="text-red-500 text-sm mt-1">{errors.vehicleType}</p>}
                            </div>
                            <div>
                                <label htmlFor="vehicleNumber">Vehicle Number</label>
                                <input
                                    id="vehicleNumber"
                                    name="vehicleNumber"
                                    type="text"
                                    className="form-input"
                                    value={formData.vehicleNumber}
                                    onChange={handleChange}
                                />
                                {errors.vehicleNumber && <p className="text-red-500 text-sm mt-1">{errors.vehicleNumber}</p>}
                            </div>
                            <div>
                                <label htmlFor="licenseNumber">License Number</label>
                                <input
                                    id="licenseNumber"
                                    name="licenseNumber"
                                    type="text"
                                    className="form-input"
                                    value={formData.licenseNumber}
                                    onChange={handleChange}
                                />
                                {errors.licenseNumber && <p className="text-red-500 text-sm mt-1">{errors.licenseNumber}</p>}
                            </div>
                            <div className="sm:col-span-2">
                                <button type="submit" className="btn btn-primary">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AccountSetting;
