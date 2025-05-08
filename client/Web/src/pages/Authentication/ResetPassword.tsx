import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store';
import { FormEvent, useEffect, useState } from 'react';
import { setPageTitle, toggleRTL } from '../../store/themeConfigSlice';
import Dropdown from '../../components/Dropdown';
import i18next from 'i18next';
import IconCaretDown from '../../components/Icon/IconCaretDown';
import IconMail from '../../components/Icon/IconMail';
import Swal from 'sweetalert2';
import { forgetPassword, resetPassword } from '../../services/me/me';
import IconLockDots from '../../components/Icon/IconLockDots';
import IconCode from '../../components/Icon/IconCode';

const ResetPassword = () => {
    const [email, setEmail] = useState<string>('');
    const [formData, setFormData] = useState({
        token: '',
        newPassword: '',
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errors, setErrors] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Reset Password'));
    });
    const navigate = useNavigate();
    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl' ? true : false;
    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    const setLocale = (flag: string) => {
        setFlag(flag);
        if (flag.toLowerCase() === 'ae') {
            dispatch(toggleRTL('rtl'));
        } else {
            dispatch(toggleRTL('ltr'));
        }
    };
    const [flag, setFlag] = useState(themeConfig.locale);

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const submitForm = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.newPassword !== confirmPassword) {
            showMessage('Passwords do not match');
            return;
        }

        // Validate all fields
        const newErrors = {

            newPassword: validatePassword(formData.newPassword),
            confirmPassword: confirmPassword === formData.newPassword ? '' : 'Passwords do not match',
        };

        setErrors(newErrors);

        if (Object.values(newErrors).some((error) => error !== '')) {
            showMessage('Please correct the form errors');
            return;
        }

        try {
            const response = await resetPassword(formData);
            if (response.success === true) {
                showMessage(response.message, 'success');
                navigate('/auth/login');
            }
        } catch (error: any) {
            if (error.response) {
                showMessage(error.response.data.message);
            } else {
                showMessage('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div>
            <div className="absolute inset-0">
                <img src="/assets/images/auth/bg.jpg" alt="image" className="h-full w-full object-cover" />
            </div>

            <div className="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-6 py-10 dark:bg-[#060818] sm:px-16">
                <div className="relative w-full max-w-[600px] rounded-md bg-[linear-gradient(45deg,#fff9f9_0%,rgba(255,255,255,0)_25%,rgba(255,255,255,0)_75%,_#fff9f9_100%)] dark:bg-[linear-gradient(52.22deg,#0E1726_0%,rgba(14,23,38,0)_18.66%,rgba(14,23,38,0)_51.04%,rgba(14,23,38,0)_80.07%,#0E1726_100%)]">
                    <div className="relative flex flex-col justify-center rounded-md bg-white/65 backdrop-blur-lg dark:bg-black/50 px-6 lg:min-h-[758px] py-20">
                        <div className=" flex items-center sm:justify-center mb-16">
                            <img className="w-8 ml-[5px] inline flex-none" src="/assets/images/FoodLogo.png" alt="logo" />
                            <span className="text-2xl ltr:ml-1.5 rtl:mr-1.5  font-semibold  align-middle inline dark:text-white-light transition-all duration-300">QuickBite</span>
                        </div>
                        <div className="mx-auto w-full max-w-[440px]">
                            <div className="mb-7">
                                <h1 className="mb-3 text-2xl font-bold !leading-snug dark:text-white">Reset password</h1>
                                <p>Enter your email to recover your password</p>
                            </div>
                            <form className="space-y-5" onSubmit={submitForm}>
                                <div>
                                    <label htmlFor="FirstName">Code</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Code"
                                            name="token"
                                            type="text"
                                            placeholder="Enter Code"
                                            onChange={handleChange}
                                            value={formData.token}
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconCode fill={true} />
                                        </span>
                                    </div>
                                    {/* {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>} */}
                                </div>
                                <div>
                                    <label htmlFor="Password">Password</label>
                                    <div className="relative text-white-dark">
                                        <input
                                            id="Password"
                                            name="newPassword"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter Password"
                                            value={formData.newPassword}
                                            onChange={handleChange}
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
                                    {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
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
                                            // onBlur={() =>
                                            //     setErrors((prev) => ({
                                            //         ...prev,
                                            //         confirmPassword: confirmPassword === formData.password ? '' : 'Passwords do not match',
                                            //     }))
                                            // }
                                            className="form-input ps-10 placeholder:text-white-dark"
                                        />
                                        <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                            <IconLockDots fill={true} />
                                        </span>
                                    </div>
                                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                                </div>

                                <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                    RECOVER
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
