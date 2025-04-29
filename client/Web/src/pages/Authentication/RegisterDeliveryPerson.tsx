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
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        vehicleType: '',
        vehicleNumber: '',
        licenseNumber: '',
    });

    const { loading, error: errorMessage } = useSelector((state: IRootState) => state.userConfig);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        dispatch(setPageTitle('Register Delivery Person'));
    }, [dispatch]);

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email) ? '' : 'Invalid email address';
    };

    const validatePassword = (password: string) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) return 'Password must be at least 8 characters';
        if (!hasUpperCase) return 'Must contain at least one uppercase letter';
        if (!hasLowerCase) return 'Must contain at least one lowercase letter';
        if (!hasNumber) return 'Must contain at least one number';
        if (!hasSpecialChar) return 'Must contain at least one special character';
        return '';
    };

    const validatePhone = (phone: string) => {
        const re = /^\+?(\d[\d-. ]+)?(\([\d-. ]+\))?[\d-. ]+\d$/;
        const digits = phone.replace(/\D/g, '');
        if (!re.test(phone)) return 'Invalid phone number format';
        if (digits.length < 10) return 'Phone number must have at least 10 digits';
        return '';
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleBlur = (field: string, value: string) => {
        let error = '';
        switch (field) {
            case 'email':
                error = validateEmail(value);
                break;
            case 'password':
                error = validatePassword(value);
                break;
            case 'phone':
                error = validatePhone(value);
                break;
            case 'firstName':
                error = value.trim() ? '' : 'First name is required';
                break;
            case 'lastName':
                error = value.trim() ? '' : 'Last name is required';
                break;
            case 'vehicleType':
                error = value.trim() ? '' : 'Vehicle type is required';
                break;
            case 'vehicleNumber':
                error = value.trim() ? '' : 'Vehicle number is required';
                break;
            case 'licenseNumber':
                error = value.trim() ? '' : 'License number is required';
                break;
        }
        setErrors(prev => ({ ...prev, [field]: error }));
    };

    const submitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors = {
            firstName: formData.firstName.trim() ? '' : 'First name is required',
            lastName: formData.lastName.trim() ? '' : 'Last name is required',
            email: validateEmail(formData.email),
            password: validatePassword(formData.password),
            confirmPassword: confirmPassword === formData.password ? '' : 'Passwords do not match',
            phone: validatePhone(formData.phone),
            vehicleType: formData.vehicleType.trim() ? '' : 'Vehicle type is required',
            vehicleNumber: formData.vehicleNumber.trim() ? '' : 'Vehicle number is required',
            licenseNumber: formData.licenseNumber.trim() ? '' : 'License number is required',
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some(error => error !== '')) {
            showMessage('Please correct the form errors');
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
                            { id: 'password', icon: <IconLockDots />, placeholder: 'Password', type: 'password', showToggle: true  },
                            { id: 'phone', icon: '📞', placeholder: 'Phone' },
                            { id: 'vehicleType', icon: <IconWheel />, placeholder: 'Vehicle Type',isDropdown: true,
                                options: ['bike', 'three-wheeler'] },
                            { id: 'vehicleNumber', icon: <IconWheel />, placeholder: 'Vehicle Number' },
                            { id: 'licenseNumber', icon: <IconWheel />, placeholder: 'License Number' },
                        ].map(({ id, icon, placeholder, type = 'text', showToggle, isDropdown, options }) => (
                            <div key={id}>
                                <label htmlFor={id} className="text-sm font-semibold block mb-1 text-gray-700 dark:text-gray-300">
                                    {placeholder}
                                </label>
                                <div className="relative text-white-dark">
                                {isDropdown ? (
                                    <>
                                        <select
                                            id={id}
                                            name={id}
                                            value={(formData as any)[id]}
                                            onChange={handleChange}
                                            onBlur={(e) => handleBlur(id, e.target.value)}
                                            className="form-select ps-10 w-full"
                                        >
                                            <option value="">Select Vehicle Type</option>
                                            {options?.map(option => (
                                                <option key={option} value={option}>
                                                    {option.charAt(0).toUpperCase() + option.slice(1).replace('-', ' ')}
                                                </option>
                                            ))}
                                        </select>
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white-dark">
                                            {icon}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <input
                                            id={id}
                                            name={id}
                                            type={showToggle ? (showPassword ? 'text' : 'password') : type}
                                            placeholder={placeholder}
                                            value={(formData as any)[id]}
                                            onChange={handleChange}
                                            onBlur={(e) => handleBlur(id, e.target.value)}
                                            className="form-input ps-10 placeholder:text-white-dark w-full"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white-dark">
                                            {icon}
                                        </span>
                                        {showToggle && (
                                            <span
                                                className="absolute end-4 top-1/2 -translate-y-1/2 cursor-pointer"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {/* ... (keep eye icon SVG code) */}
                                                {showPassword ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.522a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                        </svg>
                                                    )}
                                            </span>
                                        )}
                                    </>
                                )}
                                </div>
                                {errors[id as keyof typeof errors] && (
                                    <p className="text-red-500 text-sm mt-1">{errors[id as keyof typeof errors]}</p>
                                )}
                                {id === 'password' && (
                                    <>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character
                                        </p>
                                        {/* Confirm Password Field */}
                                        <div className="mt-4">
                                            <label htmlFor="confirmPassword" className="text-sm font-semibold block mb-1 text-gray-700 dark:text-gray-300">
                                                Confirm Password
                                            </label>
                                            <div className="relative text-white-dark">
                                                <input
                                                    id="confirmPassword"
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Confirm Password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    onBlur={() => setErrors(prev => ({
                                                        ...prev,
                                                        confirmPassword: confirmPassword === formData.password ? '' : 'Passwords do not match'
                                                    }))}
                                                    className="form-input ps-10 placeholder:text-white-dark w-full"
                                                />
                                                <span className="absolute start-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white-dark">
                                                    <IconLockDots />
                                                </span>
                                                <span
                                                    className="absolute end-4 top-1/2 -translate-y-1/2 cursor-pointer"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.522a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                        </svg>
                                                    )}
                                                </span>
                                            </div>
                                            {errors.confirmPassword && (
                                                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}



                        <button type="submit" className="btn btn-gradient mt-6 w-full uppercase font-bold transition hover:scale-[1.02] duration-200">
                            {loading ? (
                                <>
                                    <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                                    Signing Up...
                                </>
                            ) : (
                                'Sign Up'
                            )}
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
