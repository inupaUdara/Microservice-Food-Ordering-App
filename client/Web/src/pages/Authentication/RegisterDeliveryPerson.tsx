import { FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setPageTitle, toggleRTL } from '../../store/themeConfigSlice';
import { IRootState } from '../../store';
import Swal from 'sweetalert2';
import { signUpFailure, signUpStart, signUpSuccess } from '../../store/userConfigSlice';
import axiosInstanceNoToken from '../../services/axiosInstanceNoToken';

import IconUser from '../../components/Icon/IconUser';
import IconMail from '../../components/Icon/IconMail';
import IconLockDots from '../../components/Icon/IconLockDots';
import IconWheel from '../../components/Icon/IconWheel';

const RegisterDeliveryPerson = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        vehicleType: '',
        vehicleNumber: '',
        licenseNumber: '',
    });

    const { loading, error: errorMessage } = useSelector((state: IRootState) => state.userConfig);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setPageTitle('Register Delivery Person'));
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
        const { firstName, lastName, email, password, phone, vehicleType, vehicleNumber, licenseNumber } = formData;

        if (!firstName || !lastName || !email || !password || !phone || !vehicleType || !vehicleNumber || !licenseNumber) {
            const message = 'Please fill all the fields!';
            dispatch(signUpFailure(message));
            showMessage(message);
            return;
        }

        try {
            dispatch(signUpStart());

            const response = await axiosInstanceNoToken.post('users/api/v1/auth/sign-up', {
                ...formData,
                role: 'delivery-person',
            });

            dispatch(signUpSuccess(response.data));
            showMessage('Registration successful!', 'success');
            navigate('/auth/login');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Something went wrong. Please try again.';
            dispatch(signUpFailure(message));
            showMessage(message);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-[#060818] overflow-hidden">
            {/* Left Section */}
            <div className="hidden lg:flex w-1/2 h-screen fixed top-0 left-0 bg-[url(/assets/images/auth/bg.jpg)] bg-cover bg-center items-center justify-center overflow-hidden">
                <div className="text-white text-center px-10">
                    <h2 className="text-4xl font-extrabold mb-4">Become a Delivery Partner</h2>
                    <p className="text-lg font-medium">Earn money delivering food using your vehicle. Join us today!</p>
                </div>
            </div>
            {/* Right Section */}
            <div className="relative ml-auto lg:w-1/2 w-full flex items-center justify-center py-12 px-4 bg-black overflow-y-auto min-h-screen">
                {/* Background Image + Blur Overlay */}
                <div className="absolute inset-0 bg-[url('/assets/images/auth/bg.jpg')] bg-cover bg-center bg-no-repeat z-0">
                    <div className="absolute inset-0 backdrop-blur-lg bg-white/55 dark:bg-black/50"></div>
                </div>

                {/* Form Content */}
                <div className="relative w-full max-w-lg z-10 bg-white/80 dark:bg-white/5 backdrop-blur-md  shadow-xl rounded-2xl p-10 transition-all duration-300 ease-in-out">
                    <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-2">Register as a Delivery Person</h2>
                    <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-6">Join our team and start delivering with flexibility and freedom.</p>

                    <form onSubmit={submitForm} className="space-y-4">
                        {[
                            { id: 'firstName', icon: <IconUser />, placeholder: 'First Name' },
                            { id: 'lastName', icon: <IconUser />, placeholder: 'Last Name' },
                            { id: 'email', icon: <IconMail />, placeholder: 'Email', type: 'email' },
                            { id: 'password', icon: <IconLockDots />, placeholder: 'Password', type: 'password' },
                            { id: 'phone', icon: '📞', placeholder: 'Phone' },
                            { id: 'vehicleType', icon: <IconWheel />, placeholder: 'Vehicle Type' },
                            { id: 'vehicleNumber', icon: <IconWheel />, placeholder: 'Vehicle Number' },
                            { id: 'licenseNumber', icon: <IconWheel />, placeholder: 'License Number' },
                        ].map(({ id, icon, placeholder, type = 'text' }) => (
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

                        <button type="submit" className="btn btn-gradient mt-6 w-full uppercase font-bold transition hover:scale-[1.02] duration-200">
                            Sign Up
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

export default RegisterDeliveryPerson;
