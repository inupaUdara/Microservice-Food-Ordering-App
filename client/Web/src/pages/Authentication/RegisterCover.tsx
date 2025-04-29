import { FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setPageTitle, toggleRTL } from '../../store/themeConfigSlice';
import Dropdown from '../../components/Dropdown';
import { IRootState } from '../../store';
import i18next from 'i18next';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import IconUser from '../../components/Icon/IconUser';
import IconMail from '../../components/Icon/IconMail';
import IconLockDots from '../../components/Icon/IconLockDots';
import IconInstagram from '../../components/Icon/IconInstagram';
import IconFacebookCircle from '../../components/Icon/IconFacebookCircle';
import IconTwitter from '../../components/Icon/IconTwitter';
import IconGoogle from '../../components/Icon/IconGoogle';
import IconRestore from '../../components/Icon/IconRestore';
import IconHome from '../../components/Icon/IconHome';
import IconMenu from '../../components/Icon/IconMenu';
import IconWheel from '../../components/Icon/IconWheel';
import Swal from 'sweetalert2';
import { signUpFailure, signUpStart, signUpSuccess } from '../../store/userConfigSlice';
import axiosInstanceNoToken from '../../services/axiosInstanceNoToken';

const RegisterCover = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        confirmPassword: '',
    });

    const { loading, error: errorMessage } = useSelector((state: IRootState) => state.userConfig);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Register Cover'));
    });
    const navigate = useNavigate();

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
        setErrors((prev) => ({ ...prev, [name]: '' }));
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
        }
        setErrors((prev) => ({ ...prev, [field]: error }));
    };

    const submitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validate all fields
        const newErrors = {
            firstName: formData.firstName.trim() ? '' : 'First name is required',
            lastName: formData.lastName.trim() ? '' : 'Last name is required',
            email: validateEmail(formData.email),
            password: validatePassword(formData.password),
            phone: validatePhone(formData.phone),
            confirmPassword: confirmPassword === formData.password ? '' : 'Passwords do not match',
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error !== '')) {
            showMessage('Please correct the form errors');
            return;
        }

        try {
            dispatch(signUpStart());
            const response = await axiosInstanceNoToken.post('users/api/v1/auth/sign-up', {
                ...formData,
                role: 'customer',
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
        <div>
            <div className="relative flex min-h-screen items-center justify-center bg-[url(/assets/images/auth/bg.jpg)] bg-cover bg-center bg-no-repeat px-3 py-14 dark:bg-[#060818] sm:px-16">
                <div className="relative flex w-full max-w-[600px] flex-col justify-between overflow-hidden rounded-md bg-white/60 backdrop-blur-lg dark:bg-black/50 lg:min-h-[758px] lg:flex-row lg:gap-10 xl:gap-0">
                    <div className="relative flex w-full flex-col items-center justify-center gap-6 px-4 pb-16 pt-6 sm:px-6 lg:max-w-[667px]">
                        <div className=" flex items-center justify-center">
                            <img className="w-8 ml-[5px] hidden md:inline flex-none" src="/assets/images/FoodLogo.png" alt="logo" />
                            <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5  font-semibold  align-middle hidden md:inline dark:text-white-light transition-all duration-300">QuickBite</span>
                        </div>
                        <div className="w-full max-w-[440px] lg:mt-10">
                            <div className="mb-10">
                                <h1 className="text-3xl font-extrabold uppercase !leading-snug text-black md:text-4xl">Sign Up</h1>
                                <p className="text-base font-bold leading-normal dark:text-white-dark">Enter your details to register</p>
                            </div>
                            <form className="space-y-5 dark:text-white" onSubmit={submitForm}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="FirstName">First Name</label>
                                        <div className="relative text-white-dark">
                                            <input
                                                id="FirstName"
                                                name="firstName"
                                                type="text"
                                                placeholder="Enter First Name"
                                                onChange={handleChange}
                                                onBlur={(e) => handleBlur('firstName', e.target.value)}
                                                value={formData.firstName}
                                                className="form-input ps-10 placeholder:text-white-dark"
                                            />
                                            <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                <IconUser fill={true} />
                                            </span>
                                        </div>
                                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="LastName">Last Name</label>
                                        <div className="relative text-white-dark">
                                            <input
                                                id="LastName"
                                                type="text"
                                                name="lastName"
                                                placeholder="Enter Last Name"
                                                onChange={handleChange}
                                                onBlur={(e) => handleBlur('lastName', e.target.value)}
                                                value={formData.lastName}
                                                className="form-input ps-10 placeholder:text-white-dark"
                                            />
                                            <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                                <IconUser fill={true} />
                                            </span>
                                        </div>
                                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="Email">Email</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Email"
                                            name="email"
                                            type="email"
                                            placeholder="Enter Email"
                                            onChange={handleChange}
                                            onBlur={(e) => handleBlur('email', e.target.value)}
                                            value={formData.email}
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconMail fill={true} />
                                        </span>
                                    </div>
                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label htmlFor="Password">Password</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            onBlur={(e) => handleBlur('password', e.target.value)}
                                            className="form-input ps-10 pe-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                        <span className="absolute end-4 top-1/2 -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                                                    />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                                                    />
                                                </svg>
                                            )}
                                        </span>
                                    </div>
                                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                                    <p className="text-xs text-gray-500 mt-1">Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character</p>
                                </div>

                                <div>
                                    <label htmlFor="ConfirmPassword">Confirm Password</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="ConfirmPassword"
                                            type="password"
                                            placeholder="Confirm Password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            onBlur={() =>
                                                setErrors((prev) => ({
                                                    ...prev,
                                                    confirmPassword: confirmPassword === formData.password ? '' : 'Passwords do not match',
                                                }))
                                            }
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                    </div>
                                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                                </div>

                                <div>
                                    <label htmlFor="Phone">Phone</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Phone"
                                            type="tel"
                                            placeholder="Enter Phone Number"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            onBlur={(e) => handleBlur('phone', e.target.value)}
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">📞</span>
                                    </div>
                                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                </div>

                                <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                    {loading ? (
                                        <>
                                            <span className="animate-spin border-2 border-white border-l-transparent rounded-full w-5 h-5 ltr:mr-4 rtl:ml-4 inline-block align-middle"></span>
                                            Signing Up...
                                        </>
                                    ) : (
                                        'Sign Up'
                                    )}
                                </button>
                            </form>

                            {/* ... rest of the component remains the same ... */}
                            <div className="relative my-7 text-center md:mb-4">
                                <span className="absolute inset-x-0 top-1/2 h-px w-full -translate-y-1/2 bg-white-light dark:bg-white-dark"></span>
                                <span className="relative bg-white px-2 font-bold uppercase text-white-dark dark:bg-dark dark:text-white-light">or</span>
                            </div>
                            <div className="mb-10 md:mb-[60px]">
                                <div className="text-center dark:text-white">
                                    Already have an account ?&nbsp;
                                    <Link to="/auth/login" className="uppercase text-primary underline transition hover:text-black dark:hover:text-white">
                                        SIGN IN
                                    </Link>
                                </div>
                                <div>
                                    <div className="text-center dark:text-white pb-4">Register as</div>
                                    <ul className="flex flex-col sm:flex-row items-center justify-center gap-4 text-white">
                                        <li>
                                            <Link
                                                to="/auth/register-restaurant"
                                                className="inline-flex items-center gap-2 rounded-full px-4 py-2 transition hover:scale-105 text-sm font-medium"
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)',
                                                }}
                                            >
                                                <IconMenu />
                                                Restaurant
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/auth/register-delivery-person"
                                                className="inline-flex items-center gap-2 rounded-full px-4 py-2 transition hover:scale-105 text-sm font-medium"
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(239, 18, 98, 1) 0%, rgba(67, 97, 238, 1) 100%)',
                                                }}
                                            >
                                                <IconWheel fill={true} />
                                                Delivery Person
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <p className="absolute bottom-6 w-full text-center dark:text-white">© {new Date().getFullYear()}.quickbite All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterCover;
