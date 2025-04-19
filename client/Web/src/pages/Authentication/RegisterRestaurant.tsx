import { FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setPageTitle } from '../../store/themeConfigSlice';
import { IRootState } from '../../store';
import Swal from 'sweetalert2';
import { signUpFailure, signUpStart, signUpSuccess } from '../../store/userConfigSlice';
import axiosInstanceNoToken from '../../services/axiosInstanceNoToken';

import IconUser from '../../components/Icon/IconUser';
import IconMail from '../../components/Icon/IconMail';
import IconLockDots from '../../components/Icon/IconLockDots';
import IconWheel from '../../components/Icon/IconWheel';

const RegisterRestaurantAdmin = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        restaurantName: '',
        licenseNumber: '',
        restaurantPhone: '',
        restaurantAddress: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
        },
        openingHours: [
            { day: 'Monday', open: '', close: '' },
            { day: 'Tuesday', open: '', close: '' },
            { day: 'Wednesday', open: '', close: '' },
            { day: 'Thursday', open: '', close: '' },
            { day: 'Friday', open: '', close: '' },
            { day: 'Saturday', open: '', close: '' },
            { day: 'Sunday', open: '', close: '' },
        ],
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state: IRootState) => state.userConfig);

    useEffect(() => {
        dispatch(setPageTitle('Register Restaurant Admin'));
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name in formData.restaurantAddress) {
            setFormData({
                ...formData,
                restaurantAddress: {
                    ...formData.restaurantAddress,
                    [name]: value,
                },
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleOpeningHoursChange = (index: number, field: 'open' | 'close', value: string) => {
        const updatedHours = [...formData.openingHours];
        updatedHours[index][field] = value;
        setFormData({ ...formData, openingHours: updatedHours });
    };

    const showMessage = (msg = '', type = 'error') => {
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

    const submitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const {
            firstName,
            lastName,
            email,
            password,
            phone,
            restaurantName,
            licenseNumber,
            restaurantPhone,
            restaurantAddress,
            openingHours,
        } = formData;

        if (!firstName || !lastName || !email || !password || !phone || !restaurantName || !licenseNumber || !restaurantPhone) {
            showMessage('Please fill all required fields');
            return;
        }

        dispatch(signUpStart());

        try {
            const response = await axiosInstanceNoToken.post('users/api/v1/auth/sign-up', {
                ...formData,
                role: 'restaurant-admin',
            });
            dispatch(signUpSuccess(response.data));
            showMessage('Restaurant Admin Registered!', 'success');
            navigate('/auth/login');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Something went wrong!';
            dispatch(signUpFailure(message));
            showMessage(message);
        }
    };

    const fields = [
        { id: 'firstName', icon: <IconUser />, placeholder: 'First Name' },
        { id: 'lastName', icon: <IconUser />, placeholder: 'Last Name' },
        { id: 'email', icon: <IconMail />, placeholder: 'Email', type: 'email' },
        { id: 'password', icon: <IconLockDots />, placeholder: 'Password', type: 'password' },
        { id: 'phone', icon: '📞', placeholder: 'Phone' },
        { id: 'restaurantName', icon: '🏪', placeholder: 'Restaurant Name' },
        { id: 'licenseNumber', icon: <IconWheel />, placeholder: 'License Number' },
        { id: 'restaurantPhone', icon: '☎️', placeholder: 'Restaurant Phone' },
    ];

    const addressFields = [
        { id: 'street', placeholder: 'Street' },
        { id: 'city', placeholder: 'City' },
        { id: 'state', placeholder: 'State' },
        { id: 'zipCode', placeholder: 'Zip Code' },
        { id: 'country', placeholder: 'Country' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-[#060818] overflow-hidden">
            <div className="hidden lg:flex h-screen fixed top-0 left-0 w-1/2 bg-[url(/assets/images/auth/bg.jpg)] bg-cover bg-center items-center justify-center">
                <div className="text-white text-center px-10">
                    <h2 className="text-4xl font-extrabold mb-4">Register Your Restaurant</h2>
                    <p className="text-lg font-medium">Partner with us and grow your business today!</p>
                </div>
            </div>

            <div className="relative ml-auto w-full lg:w-1/2 flex items-center justify-center py-12 px-12 bg-black overflow-y-auto min-h-screen">
                <div className="absolute inset-0 bg-[url('/assets/images/auth/bg.jpg')] bg-cover bg-center bg-no-repeat z-0">
                    <div className="absolute inset-0 backdrop-blur-lg bg-white/55 dark:bg-black/50"></div>
                </div>

                <div className="relative w-full max-w-3xl z-10 bg-white/80 dark:bg-white/5 backdrop-blur-md shadow-xl rounded-2xl p-10 transition-all duration-300 ease-in-out">
                    <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-2">Register as a Restaurant Admin</h2>
                    <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-6">Fill in the information to get started.</p>

                    <form onSubmit={submitForm} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {fields.map(({ id, icon, placeholder, type = 'text' }) => (
                                <div key={id}>
                                    <label htmlFor={id} className="text-sm font-semibold block mb-1 text-gray-700 dark:text-gray-300">
                                        {placeholder}
                                    </label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id={id}
                                            name={id}
                                            type={type}
                                            placeholder={placeholder}
                                            value={(formData as any)[id]}
                                            onChange={handleChange}
                                            className="form-input ps-10 placeholder:text-white-dark w-full"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white-dark">{icon}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h3 className="font-semibold text-md text-gray-800 dark:text-white mt-6 mb-2">Restaurant Address</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {addressFields.map(({ id, placeholder }) => (
                                <div key={id}>
                                    <label htmlFor={id} className="text-sm font-semibold block mb-1 text-gray-700 dark:text-gray-300">
                                        {placeholder}
                                    </label>
                                    <input
                                        id={id}
                                        name={id}
                                        type="text"
                                        value={(formData.restaurantAddress as any)[id]}
                                        onChange={handleChange}
                                        className="form-input w-full"
                                        placeholder={placeholder}
                                    />
                                </div>
                            ))}
                        </div>

                        <h3 className="font-semibold text-md text-gray-800 dark:text-white mt-6 mb-2">Opening Hours</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {formData.openingHours.map((dayInfo, index) => (
                                <div key={index} className="flex flex-col gap-1">
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{dayInfo.day}</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="time"
                                            value={dayInfo.open}
                                            onChange={(e) => handleOpeningHoursChange(index, 'open', e.target.value)}
                                            className="form-input w-full"
                                        />
                                        <span className="text-gray-500">to</span>
                                        <input
                                            type="time"
                                            value={dayInfo.close}
                                            onChange={(e) => handleOpeningHoursChange(index, 'close', e.target.value)}
                                            className="form-input w-full"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button type="submit" className="btn btn-gradient mt-6 w-full uppercase font-bold transition hover:scale-[1.02] duration-200">
                            {loading ? 'Registering...' : 'Sign Up'}
                        </button>

                        <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{' '}
                            <Link to="/auth/login" className="text-primary font-medium underline">
                                Sign In
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterRestaurantAdmin;
